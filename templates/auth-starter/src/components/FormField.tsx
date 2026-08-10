import type { JSX } from "solid-js"
import * as Input from "@solidiom/input"
import * as Field from "@solidiom/field"

export function FormField(props: { label: string; type?: string; placeholder?: string; error?: string; children?: JSX.Element }): JSX.Element {
  return (
    <Field.Root>
      <Field.Label class="block text-sm font-medium text-gray-700">{props.label}</Field.Label>
      {props.children ? (
        props.children
      ) : (
        <Input.Root
          type={props.type || "text"}
          placeholder={props.placeholder}
          class={`mt-1 block w-full rounded-md border ${
            props.error ? "border-red-300" : "border-gray-300"
          } bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
        />
      )}
      {props.error && <Field.Error class="mt-1 text-xs text-red-600">{props.error}</Field.Error>}
    </Field.Root>
  )
}
