import * as React from "react"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldPage() {
  return (
    <FieldGroup className="max-w-md gap-4">
      <Field>
        <FieldLabel htmlFor="fld-email">Email</FieldLabel>
        <FieldContent>
          <Input id="fld-email" placeholder="you@example.com" />
          <FieldDescription>We'll never share your email.</FieldDescription>
        </FieldContent>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="fld-user">Username</FieldLabel>
        <FieldContent>
          <Input id="fld-user" aria-invalid defaultValue="taken-name" />
          <FieldError>
            <span>That username is already taken.</span>
          </FieldError>
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
