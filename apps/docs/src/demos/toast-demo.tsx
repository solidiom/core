import * as Toast from "@solidiom/toast"
import { createToaster } from "@solidiom/toast"
import { For } from "solid-js"

const toaster = createToaster()

export function ToastDemo() {
  function showToast() {
    toaster.toast({
      title: "Event created",
      description: "Your event has been scheduled successfully.",
    })
  }

  return (
    <div>
      <button
        onClick={showToast}
        class="inline-flex items-center rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity"
      >
        Show Toast
      </button>

      <Toast.Region toaster={toaster}>
        {(toasts) => (
          <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <For each={toasts()}>
              {(t) => (
                <Toast.Root toastId={t.id}>
                  <div class="flex w-80 items-start gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 shadow-lg">
                    <div class="flex-1">
                      <Toast.Title>
                        <span class="text-sm font-semibold text-[hsl(var(--foreground))]">
                          {t.title}
                        </span>
                      </Toast.Title>
                      <Toast.Description>
                        <span class="mt-1 block text-sm text-[hsl(var(--muted-foreground))]">
                          {t.description}
                        </span>
                      </Toast.Description>
                    </div>
                    <Toast.Close>
                      <span class="inline-flex size-6 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
                        ✕
                      </span>
                    </Toast.Close>
                  </div>
                </Toast.Root>
              )}
            </For>
          </div>
        )}
      </Toast.Region>
    </div>
  )
}

export const toastDemoCode = `import * as Toast from "@solidiom/toast"
import { createToaster } from "@solidiom/toast"
import { For } from "solid-js"

const toaster = createToaster()

function ToastExample() {
  return (
    <div>
      <button onClick={() => toaster.toast({
        title: "Event created",
        description: "Scheduled successfully.",
      })}>
        Show Toast
      </button>

      <Toast.Region toaster={toaster}>
        {(toasts) => (
          <For each={toasts()}>
            {(t) => (
              <Toast.Root toastId={t.id}>
                <Toast.Title>{t.title}</Toast.Title>
                <Toast.Description>{t.description}</Toast.Description>
                <Toast.Close>×</Toast.Close>
              </Toast.Root>
            )}
          </For>
        )}
      </Toast.Region>
    </div>
  )
}`
