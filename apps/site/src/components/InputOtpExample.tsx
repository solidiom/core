import * as InputOTP from "@solidiom/input-otp"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { label: string }> = {
  en: {
    label: "Enter your one-time password",
  },
  es: {
    label: "Ingrese su contraseña de un solo uso",
  },
}

export interface InputOtpExampleProps {
  locale: Locale
}

/** Canonical executable source for the Input OTP documentation example. */
export function InputOtpExample(props: InputOtpExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="input-otp-example"
      data-input-otp-example
    >
      <label class="input-otp-example__label">
        {copy().label}
      </label>
      <InputOTP.Root maxLength={6}>
        <InputOTP.Group>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTP.Slot index={index} />
          ))}
        </InputOTP.Group>
      </InputOTP.Root>
    </div>
  )
}
