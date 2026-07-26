import * as Field from "@solidiom/field"

export function FieldDemo() {
  return (
    <div class="flex flex-col gap-4 max-w-xs">
      <Field.Root required>
        <Field.Label class="text-sm font-medium text-[hsl(var(--foreground))]">
          Username
        </Field.Label>
        <Field.Control>
          {(controlProps) => (
            <input
              {...controlProps()}
              type="text"
              placeholder="Enter username"
              class="mt-1 h-10 w-full rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            />
          )}
        </Field.Control>
        <Field.Description class="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
          Choose a unique username.
        </Field.Description>
      </Field.Root>
      <Field.Root invalid>
        <Field.Label class="text-sm font-medium text-[hsl(var(--foreground))]">Email</Field.Label>
        <Field.Control>
          {(controlProps) => (
            <input
              {...controlProps()}
              type="email"
              value="invalid-email"
              class="mt-1 h-10 w-full rounded-md border border-red-500 bg-transparent px-3 py-2 text-sm text-[hsl(var(--foreground))]"
            />
          )}
        </Field.Control>
        <Field.Error class="mt-1 text-xs text-red-500">
          Please enter a valid email address.
        </Field.Error>
      </Field.Root>
    </div>
  )
}

export const fieldDemoCode = `import * as Field from "@solidiom/field"

function FieldExample() {
  return (
    <Field.Root required>
      <Field.Label>Username</Field.Label>
      <Field.Control>
        {(controlProps) => (
          <input {...controlProps()} type="text" placeholder="Enter username" />
        )}
      </Field.Control>
      <Field.Description>Choose a unique username.</Field.Description>
    </Field.Root>
  )
}`
