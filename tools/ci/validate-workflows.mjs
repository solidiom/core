import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()

const collectYamlFiles = (directory) => {
  const entries = readdirSync(directory, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return collectYamlFiles(path)
    return entry.isFile() && (path.endsWith(".yml") || path.endsWith(".yaml")) ? [path] : []
  })
}

const workflowFiles = collectYamlFiles(join(root, ".github", "workflows")).sort()
const actionFiles = collectYamlFiles(join(root, ".github", "actions")).sort()
const files = [...workflowFiles, ...actionFiles]
const errors = []
const thirdPartyAction = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/
const selfHostedLabel = /\bself-hosted(?:[-\w]*)?\b/
const trustedPullRequestRunner =
  "${{ github.event_name == 'pull_request' && 'ubuntu-latest' || 'self-hosted-dfw-flex' }}"
const hostedRunner = "ubuntu-latest"
const runnerValues = (text) =>
  [...text.matchAll(/^\s*runs-on:\s*(.+?)\s*$/gm)].map(([, value]) => value)

// Split a workflow's `jobs:` mapping into per-job text blocks so job-scoped
// policy (runner vs container pairing) can be checked without a YAML parser.
const jobBlocks = (text) => {
  const lines = text.split("\n")
  const jobsIndex = lines.findIndex((line) => /^jobs:\s*$/.test(line))
  if (jobsIndex === -1) return []
  const blocks = []
  let current = null
  for (const line of lines.slice(jobsIndex + 1)) {
    const header = line.match(/^ {2}([A-Za-z0-9_-]+):\s*$/)
    if (header) {
      current = { name: header[1], lines: [] }
      blocks.push(current)
      continue
    }
    if (/^\S/.test(line)) break
    current?.lines.push(line)
  }
  return blocks.map(({ name, lines: body }) => ({ name, text: body.join("\n") }))
}

for (const file of files) {
  const text = readFileSync(file, "utf8")
  const display = file.slice(root.length + 1)
  for (const [index, line] of text.split("\n").entries()) {
    const match = line.match(/uses:\s*([^\s#]+)@([^\s#]+)(?:\s+#\s*(.*))?$/)
    if (!match || match[1].startsWith("./")) continue
    if (!thirdPartyAction.test(match[1])) {
      errors.push(`${display}:${index + 1}: malformed third-party action reference ${match[1]}`)
    }
    if (!/^[0-9a-f]{40}$/.test(match[2])) {
      errors.push(`${display}:${index + 1}: non-immutable uses ref ${match[1]}@${match[2]}`)
    }
  }
  if (/^\s*pull_request_target\s*:/m.test(text)) {
    errors.push(`${display}: pull_request_target is prohibited`)
  }
  if (/npx\s+wrangler\b/.test(text)) {
    errors.push(`${display}: unbounded npx wrangler is prohibited`)
  }
  const images = [...text.matchAll(/^\s*image:\s+(\S+)\s*$/gm)]
  for (const [, image] of images) {
    if (!/^\S+@sha256:[0-9a-f]{64}$/.test(image)) {
      errors.push(`${display}: workflow container image must be pinned by digest`)
    }
  }
  // The self-hosted pool runs the runner agent itself inside a container, so a
  // job container's externals mount (/__e) resolves to a path that does not
  // exist on the container host and no JavaScript action can start. Job
  // containers must therefore run on hosted runners.
  for (const job of jobBlocks(text)) {
    if (!/^ {4}container:/m.test(job.text)) continue
    const jobRunners = runnerValues(job.text)
    if (jobRunners.length !== 1 || jobRunners[0] !== hostedRunner) {
      errors.push(
        `${display}: job '${job.name}' declares a job container and must set runs-on: ${hostedRunner} (self-hosted runners cannot mount runner externals into a job container)`,
      )
    }
  }
}

const required = readFileSync(join(root, ".github", "workflows", "ci-required.yml"), "utf8")
if (!/^\s*pull_request:\s*$/m.test(required) || !/^\s*push:\s*$/m.test(required)) {
  errors.push("ci-required.yml: must trigger on pull_request and push")
}
if (!/name:\s*CI \/ required/.test(required) || !/if:\s*always\(\)/.test(required)) {
  errors.push("ci-required.yml: stable always-reporting aggregate is missing")
}
const requiredRunners = runnerValues(required)
if (
  requiredRunners.length === 0 ||
  requiredRunners.some((runner) => runner !== hostedRunner && runner !== trustedPullRequestRunner)
) {
  errors.push(
    "ci-required.yml: jobs must be hosted or keep pull requests hosted and use self-hosted only for trusted pushes",
  )
}

for (const file of workflowFiles) {
  const display = file.slice(root.length + 1)
  const text = readFileSync(file, "utf8").replace(/^\s*#.*$/gm, "")
  if (!/^\s*pull_request\s*:/m.test(text)) continue

  const hasUnsafeSelfHostedRunner = runnerValues(text).some(
    (runner) => selfHostedLabel.test(runner) && runner !== trustedPullRequestRunner,
  )
  if (!hasUnsafeSelfHostedRunner) continue

  const isTrustedPostMergeTag =
    display === ".github/workflows/tag-on-version-merge.yml" &&
    /^\s*types:\s*\[closed\]\s*$/m.test(text) &&
    /^\s*branches:\s*\[main\]\s*$/m.test(text) &&
    /github\.event\.pull_request\.merged == true/.test(text) &&
    /startsWith\(github\.event\.pull_request\.head\.ref, 'release\/version-'\)/.test(text) &&
    /ref:\s*\$\{\{ github\.event\.pull_request\.merge_commit_sha \}\}/.test(text)

  if (!isTrustedPostMergeTag) {
    errors.push(`${display}: pull_request workflow exposes an untrusted job to self-hosted runners`)
  }
}

if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log(
  `Validated ${files.length} workflow/action files: immutable refs, runner, container, and required-job policy passed.`,
)
