import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Field from "@solidiom/field"
import * as Card from "@solidiom/card"
import * as Alert from "@solidiom/alert"
import { A } from "@solidjs/router"

type ResourceType = "Service" | "Database" | "Compute" | "Storage" | "Network"

type FormStep = "type" | "details" | "configure" | "review"

const RESOURCE_TYPES: { value: ResourceType; label: string; description: string }[] = [
  {
    value: "Service",
    label: "Service",
    description: "API gateway, microservice, or load balancer",
  },
  { value: "Database", label: "Database", description: "Managed relational or NoSQL database" },
  {
    value: "Compute",
    label: "Compute",
    description: "Virtual machine, container, or serverless function",
  },
  {
    value: "Storage",
    label: "Storage",
    description: "Object storage, block storage, or file system",
  },
  { value: "Network", label: "Network", description: "VPC, subnet, or firewall rule" },
]

const REGIONS = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "eu-west-1",
  "eu-central-1",
  "ap-south-1",
  "ap-northeast-1",
]

const getConfigFields = (type: ResourceType) => {
  switch (type) {
    case "Service":
      return [
        { key: "replicas", label: "Replicas", placeholder: "3", required: true },
        { key: "port", label: "Port", placeholder: "8080", required: true },
        {
          key: "health_check_path",
          label: "Health Check Path",
          placeholder: "/health",
          required: false,
        },
        { key: "max_connections", label: "Max Connections", placeholder: "1000", required: false },
      ]
    case "Database":
      return [
        { key: "engine", label: "Engine", placeholder: "postgres", required: true },
        { key: "version", label: "Version", placeholder: "16.1", required: true },
        {
          key: "instance_class",
          label: "Instance Class",
          placeholder: "db.r5.large",
          required: true,
        },
        { key: "storage_gb", label: "Storage (GB)", placeholder: "100", required: true },
      ]
    case "Compute":
      return [
        { key: "instance_type", label: "Instance Type", placeholder: "m5.xlarge", required: true },
        { key: "ami", label: "AMI ID", placeholder: "ami-0abcdef1234567890", required: true },
        { key: "key_pair", label: "Key Pair", placeholder: "my-key-pair", required: false },
        { key: "auto_scale", label: "Auto Scale", placeholder: "true", required: false },
      ]
    case "Storage":
      return [
        { key: "storage_class", label: "Storage Class", placeholder: "standard", required: true },
        { key: "versioning", label: "Versioning", placeholder: "true", required: false },
        { key: "encryption", label: "Encryption", placeholder: "AES256", required: true },
        { key: "lifecycle_days", label: "Lifecycle Days", placeholder: "90", required: false },
      ]
    case "Network":
      return [
        { key: "cidr_block", label: "CIDR Block", placeholder: "10.0.0.0/16", required: true },
        { key: "dns_supported", label: "DNS Support", placeholder: "true", required: false },
        { key: "nat_gateway", label: "NAT Gateway", placeholder: "true", required: false },
        { key: "flow_logs", label: "Flow Logs", placeholder: "true", required: false },
      ]
  }
}

const stepLabels: Record<FormStep, string> = {
  type: "Select Type",
  details: "Details",
  configure: "Configuration",
  review: "Review",
}

export function ResourceCreate(): JSX.Element {
  const [step, setStep] = createSignal<FormStep>("type")
  const [resourceType, setResourceType] = createSignal<ResourceType | "">("")
  const [name, setName] = createSignal("")
  const [region, setRegion] = createSignal("")
  const [config, setConfig] = createSignal<Record<string, string>>({})
  const [submitted, setSubmitted] = createSignal(false)

  const configFields = () => {
    if (!resourceType()) return []
    return getConfigFields(resourceType() as ResourceType)
  }

  const updateConfig = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const canProceed = () => {
    switch (step()) {
      case "type":
        return resourceType() !== ""
      case "details":
        return name().trim() !== "" && region() !== ""
      case "configure": {
        const requiredFields = configFields().filter((f) => f.required)
        return requiredFields.every((f) => config()[f.key]?.trim() !== "")
      }
      case "review":
        return true
    }
  }

  const currentStepIndex = () => {
    const steps: FormStep[] = ["type", "details", "configure", "review"]
    return steps.indexOf(step())
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted()) {
    return (
      <div class="space-y-6">
        <div>
          <Breadcrumb.Root class="mb-2">
            <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" class="hover:text-gray-700">
                  Home
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/create" current class="text-gray-900 font-medium">
                  Create Resource
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Create Resource</h1>
          <p class="mt-1 text-sm text-gray-500">
            Guided resource creation with type, configuration, and validation.
          </p>
        </div>

        <Alert.Root type="success" class="rounded-lg border border-green-200 bg-green-50 p-4">
          <Alert.Title class="text-sm font-medium text-green-800">
            Resource created successfully!
          </Alert.Title>
          <Alert.Description class="mt-1 text-sm text-green-700">
            {name()} ({resourceType()}) is being provisioned in {region}.
          </Alert.Description>
        </Alert.Root>

        <div class="flex items-center gap-3">
          <A href="/">
            <Button.Root class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Back to Resources
            </Button.Root>
          </A>
          <Button.Root
            class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            onClick={() => {
              setSubmitted(false)
              setStep("type")
              setResourceType("")
              setName("")
              setRegion("")
              setConfig({})
            }}
          >
            Create Another
          </Button.Root>
        </div>
      </div>
    )
  }

  return (
    <div class="space-y-6">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/create" current class="text-gray-900 font-medium">
                Create Resource
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Create Resource</h1>
        <p class="mt-1 text-sm text-gray-500">
          Guided resource creation with type, configuration, and validation.
        </p>
      </div>

      <div class="flex items-center gap-4">
        {(["type", "details", "configure", "review"] as FormStep[]).map((s, i) => {
          const isActive = i <= currentStepIndex()
          const isCurrent = s === step()
          return (
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span
                  class={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    isCurrent
                      ? "bg-indigo-600 text-white"
                      : isActive
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  class={`text-sm font-medium ${
                    isCurrent ? "text-gray-900" : isActive ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {stepLabels[s]}
                </span>
              </div>
              {i < 3 && <div class={`h-px w-16 ${isActive ? "bg-indigo-300" : "bg-gray-200"}`} />}
            </div>
          )
        })}
      </div>

      <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div class="p-6">
          {step() === "type" && (
            <div class="space-y-4">
              <h2 class="text-lg font-semibold text-gray-900">Select Resource Type</h2>
              <p class="text-sm text-gray-500">Choose the type of resource you want to create.</p>
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {RESOURCE_TYPES.map((rt) => (
                  <button
                    type="button"
                    onClick={() => setResourceType(rt.value)}
                    class={`rounded-lg border-2 p-4 text-left transition-all ${
                      resourceType() === rt.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div class="flex items-center justify-between">
                      <span
                        class={`text-sm font-semibold ${
                          resourceType() === rt.value ? "text-indigo-700" : "text-gray-900"
                        }`}
                      >
                        {rt.label}
                      </span>
                      {resourceType() === rt.value && (
                        <span class="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                          &#10003;
                        </span>
                      )}
                    </div>
                    <p class="mt-1 text-xs text-gray-500">{rt.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step() === "details" && (
            <div class="space-y-6">
              <h2 class="text-lg font-semibold text-gray-900">Resource Details</h2>
              <p class="text-sm text-gray-500">
                Name your resource and select a deployment region.
              </p>

              <Field.Root>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <Input.Root
                  type="text"
                  placeholder="my-resource"
                  class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                />
                <Field.Description class="mt-1 text-xs text-gray-500">
                  A unique identifier for this resource.
                </Field.Description>
              </Field.Root>

              <Field.Root>
                <label class="block text-sm font-medium text-gray-700">Region</label>
                <select
                  class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={region()}
                  onChange={(e) => setRegion(e.currentTarget.value)}
                >
                  <option value="">Select a region...</option>
                  {REGIONS.map((r) => (
                    <option value={r}>{r}</option>
                  ))}
                </select>
                <Field.Description class="mt-1 text-xs text-gray-500">
                  The geographic region where the resource will be deployed.
                </Field.Description>
              </Field.Root>

              <div class="rounded-md bg-gray-50 p-4">
                <div class="flex items-center gap-2 text-sm">
                  <span class="font-medium text-gray-700">Selected type:</span>
                  <span class="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                    {resourceType()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {step() === "configure" && (
            <div class="space-y-6">
              <h2 class="text-lg font-semibold text-gray-900">Configuration</h2>
              <p class="text-sm text-gray-500">
                Configure settings for your {resourceType()} resource.
              </p>

              <div class="space-y-4">
                {configFields().map((field) => (
                  <Field.Root>
                    <label class="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && <span class="ml-1 text-red-500">*</span>}
                    </label>
                    <Input.Root
                      type="text"
                      placeholder={field.placeholder}
                      class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={config()[field.key] || ""}
                      onInput={(e) => updateConfig(field.key, e.currentTarget.value)}
                    />
                    {!field.required && (
                      <Field.Description class="mt-1 text-xs text-gray-400">
                        Optional
                      </Field.Description>
                    )}
                  </Field.Root>
                ))}
              </div>

              <div class="rounded-md border border-yellow-200 bg-yellow-50 p-4">
                <div class="flex items-start gap-2">
                  <span class="text-sm text-yellow-700">
                    Fields marked with <span class="text-red-500">*</span> are required before
                    proceeding.
                  </span>
                </div>
              </div>
            </div>
          )}

          {step() === "review" && (
            <div class="space-y-6">
              <h2 class="text-lg font-semibold text-gray-900">Review &amp; Create</h2>
              <p class="text-sm text-gray-500">
                Review your resource configuration before creating it.
              </p>

              <div class="rounded-lg border border-gray-200 divide-y divide-gray-200">
                <div class="px-4 py-3">
                  <span class="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </span>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{resourceType()}</p>
                </div>
                <div class="px-4 py-3">
                  <span class="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </span>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{name()}</p>
                </div>
                <div class="px-4 py-3">
                  <span class="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Region
                  </span>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{region()}</p>
                </div>
                <div class="px-4 py-3">
                  <span class="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Configuration
                  </span>
                  <div class="mt-2 grid gap-2 sm:grid-cols-2">
                    {configFields().map((field) => {
                      const val = config()[field.key]
                      if (!val) return null
                      return (
                        <div class="flex items-start gap-2">
                          <span class="text-sm text-gray-500">{field.label}:</span>
                          <span class="font-mono text-sm text-gray-900">{val}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <Alert.Root type="info" class="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <Alert.Title class="text-sm font-medium text-blue-800">
                  About to create resource
                </Alert.Title>
                <Alert.Description class="mt-1 text-sm text-blue-700">
                  This will create a new {resourceType()} named "{name()}" in the {region} region.
                  The resource will be in "pending" status until provisioning completes.
                </Alert.Description>
              </Alert.Root>
            </div>
          )}
        </div>

        <div class="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <Button.Root
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => {
              const steps: FormStep[] = ["type", "details", "configure", "review"]
              const idx = steps.indexOf(step())
              if (idx > 0) setStep(steps[idx - 1])
            }}
            disabled={step() === "type"}
          >
            {step() === "type" ? (
              <A href="/" class="text-sm font-medium text-gray-700">
                Cancel
              </A>
            ) : (
              "Previous"
            )}
          </Button.Root>

          {step() !== "review" ? (
            <Button.Root
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              onClick={() => {
                const steps: FormStep[] = ["type", "details", "configure", "review"]
                const idx = steps.indexOf(step())
                if (idx < 3) setStep(steps[idx + 1])
              }}
              disabled={!canProceed()}
            >
              Next
            </Button.Root>
          ) : (
            <Button.Root
              class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              onClick={handleSubmit}
            >
              Create Resource
            </Button.Root>
          )}
        </div>
      </Card.Root>
    </div>
  )
}
