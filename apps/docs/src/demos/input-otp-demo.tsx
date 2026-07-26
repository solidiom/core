import { createSignal } from "solid-js"
import { For } from "@solidjs/web"
import * as InputOTP from "@solidiom/input-otp"

export function InputOTPDemo() {
  const [value, setValue] = createSignal("")

  return (
    <div class="flex flex-col items-start gap-3">
      <InputOTP.Root
        maxLength={6}
        value={value}
        onValueChange={setValue}
        onComplete={(v) => alert(`OTP complete: ${v}`)}
        class="relative inline-flex"
      >
        <InputOTP.Group class="flex gap-1.5">
          <For each={[0, 1, 2]}>
            {(i) => (
              <InputOTP.Slot
                index={i}
                class="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-300 text-sm font-medium data-[state=active]:border-zinc-900 data-[state=active]:ring-1 data-[state=active]:ring-zinc-900"
              />
            )}
          </For>
        </InputOTP.Group>
        <span class="mx-2 text-zinc-300">-</span>
        <InputOTP.Group class="flex gap-1.5">
          <For each={[3, 4, 5]}>
            {(i) => (
              <InputOTP.Slot
                index={i}
                class="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-300 text-sm font-medium data-[state=active]:border-zinc-900 data-[state=active]:ring-1 data-[state=active]:ring-zinc-900"
              />
            )}
          </For>
        </InputOTP.Group>
      </InputOTP.Root>
      <p class="text-xs text-zinc-500">Value: {value()}</p>
    </div>
  )
}

export const inputOTPDemoCode = `import * as InputOTP from "@solidiom/input-otp"

function OTPInput() {
  const [value, setValue] = createSignal("")

  return (
    <InputOTP.Root maxLength={6} value={value} onValueChange={setValue} onComplete={handleVerify}>
      <InputOTP.Group>
        <InputOTP.Slot index={0} />
        <InputOTP.Slot index={1} />
        <InputOTP.Slot index={2} />
      </InputOTP.Group>
      <InputOTP.Group>
        <InputOTP.Slot index={3} />
        <InputOTP.Slot index={4} />
        <InputOTP.Slot index={5} />
      </InputOTP.Group>
    </InputOTP.Root>
  )
}
`
