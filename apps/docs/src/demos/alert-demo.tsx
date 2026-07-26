import * as Alert from "@solidiom/alert"

export function AlertDemo() {
  return (
    <div class="flex flex-col gap-3">
      <Alert.Root type="info" class="rounded-md border border-[hsl(var(--border))] p-4">
        <Alert.Title class="text-sm font-semibold text-[hsl(var(--foreground))]">
          Heads up!
        </Alert.Title>
        <Alert.Description class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          You can add components to your app using the CLI.
        </Alert.Description>
      </Alert.Root>
      <Alert.Root type="error" class="rounded-md border border-red-500/50 bg-red-500/10 p-4">
        <Alert.Title class="text-sm font-semibold text-red-600">Error</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-red-600/80">
          Something went wrong. Please try again.
        </Alert.Description>
      </Alert.Root>
    </div>
  )
}

export const alertDemoCode = `import * as Alert from "@solidiom/alert"

function AlertExample() {
  return (
    <Alert.Root type="info">
      <Alert.Title>Heads up!</Alert.Title>
      <Alert.Description>
        You can add components to your app using the CLI.
      </Alert.Description>
    </Alert.Root>
  )
}`
