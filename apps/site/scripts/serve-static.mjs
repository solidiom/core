import { createReadStream } from "node:fs"
import { stat } from "node:fs/promises"
import { createServer } from "node:http"
import { extname, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const host = process.env.HOST ?? "127.0.0.1"
const port = Number(process.env.PORT ?? "4322")
const siteRoot = resolve(fileURLToPath(new URL("../dist/", import.meta.url)))
const rootPrefix = `${siteRoot}${sep}`

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".wasm", "application/wasm"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
])

async function resolveRequestPath(pathname) {
  let decoded
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    return undefined
  }

  const requested = resolve(siteRoot, decoded.replace(/^\/+/, ""))
  if (requested !== siteRoot && !requested.startsWith(rootPrefix)) return undefined

  try {
    const metadata = await stat(requested)
    if (metadata.isDirectory()) return resolve(requested, "index.html")
    if (metadata.isFile()) return requested
  } catch {
    // Missing routes fall through to Astro's generated 404 page.
  }
  return undefined
}

function sendFile(request, response, filePath, statusCode) {
  response.writeHead(statusCode, {
    "cache-control": "no-store",
    "content-type": contentTypes.get(extname(filePath).toLowerCase()) ?? "application/octet-stream",
  })
  if (request.method === "HEAD") {
    response.end()
    return
  }
  createReadStream(filePath)
    .on("error", () => response.destroy())
    .pipe(response)
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", `http://${host}:${port}`).pathname
  const filePath = await resolveRequestPath(pathname)
  if (filePath) {
    sendFile(request, response, filePath, 200)
    return
  }
  sendFile(request, response, resolve(siteRoot, "404.html"), 404)
})

server.listen(port, host, () => {
  console.log(`Serving ${siteRoot} at http://${host}:${port}`)
})

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)))
}
