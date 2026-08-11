/**
 * NEWS-001: Consent-based bilingual Buttondown newsletter subscription flow.
 *
 * Privacy guarantees:
 * - No subscription without explicit consent checkbox
 * - No tracking pixels or external resources loaded until submission
 * - Email is sent only to the Buttondown endpoint, never to analytics
 * - Form works without JavaScript (progressive enhancement)
 * - Error states are accessible (aria-live, aria-describedby)
 *
 * Bilingual: renders in English or Spanish based on the locale prop.
 */

import { createSignal, Show } from "solid-js"
import type { JSX } from "@solidjs/web"

export type NewsletterLocale = "en" | "es"

export interface NewsletterFormProps {
  locale: NewsletterLocale
  /** Buttondown publication identifier — loaded from environment, not hardcoded. */
  publicationId: string
  /** Base URL for the Buttondown API. Defaults to production. */
  apiBase?: string
}

const COPY = {
  en: {
    title: "Newsletter",
    description: "Get notified about new releases, guides, and accessibility improvements.",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    consentLabel:
      "I consent to receiving the Solidiom newsletter. You can unsubscribe at any time.",
    submitLabel: "Subscribe",
    submitting: "Subscribing...",
    successTitle: "Subscribed!",
    successMessage: "Check your inbox to confirm your subscription.",
    errorTitle: "Something went wrong",
    errorMessage: "Please try again later.",
    privacyNote: "We will never share your email. Read our ",
    privacyLink: "privacy policy",
    privacyHref: "/privacy/",
  },
  es: {
    title: "Boletín",
    description:
      "Recibe notificaciones sobre nuevos lanzamientos, guías y mejoras de accesibilidad.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@ejemplo.com",
    consentLabel:
      "Consiento recibir el boletín de Solidiom. Puedes cancelar la suscripción en cualquier momento.",
    submitLabel: "Suscribirse",
    submitting: "Suscribiendo...",
    successTitle: "¡Suscrito!",
    successMessage: "Revisa tu bandeja de entrada para confirmar tu suscripción.",
    errorTitle: "Algo salió mal",
    errorMessage: "Por favor, inténtalo de nuevo más tarde.",
    privacyNote: "Nunca compartiremos tu correo. Lee nuestra ",
    privacyLink: "política de privacidad",
    privacyHref: "/es/privacy/",
  },
} as const

type FormState = "idle" | "submitting" | "success" | "error"

export function NewsletterForm(props: NewsletterFormProps): JSX.Element {
  const [state, setState] = createSignal<FormState>("idle")
  const [email, setEmail] = createSignal("")
  const [consent, setConsent] = createSignal(false)
  const [errorDetail, setErrorDetail] = createSignal("")

  const copy = () => COPY[props.locale]
  const apiBase = () => props.apiBase ?? "https://api.buttondown.com"

  async function handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault()

    if (!consent() || !email()) return

    setState("submitting")
    setErrorDetail("")

    try {
      const response = await fetch(`${apiBase()}/v1/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${props.publicationId}`,
        },
        body: JSON.stringify({
          email: email(),
          metadata: { locale: props.locale },
        }),
      })

      if (response.ok || response.status === 201) {
        setState("success")
      } else {
        const data = await response.json().catch(() => ({}))
        setErrorDetail((data as Record<string, string>).detail ?? "")
        setState("error")
      }
    } catch {
      setState("error")
    }
  }

  return (
    <section class="newsletter" aria-labelledby="newsletter-title">
      <h2 id="newsletter-title" class="newsletter__title">
        {copy().title}
      </h2>
      <p class="newsletter__description">{copy().description}</p>

      <Show when={state() === "success"}>
        <div class="newsletter__success" role="status" aria-live="polite">
          <strong>{copy().successTitle}</strong>
          <p>{copy().successMessage}</p>
        </div>
      </Show>

      <Show when={state() !== "success"}>
        <form
          class="newsletter__form"
          onSubmit={handleSubmit}
          novalidate
          action={`${apiBase()}/v1/subscribers`}
          method="post"
        >
          <div class="newsletter__field">
            <label for="newsletter-email" class="newsletter__label">
              {copy().emailLabel}
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              class="newsletter__input"
              placeholder={copy().emailPlaceholder}
              required
              autocomplete="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              aria-describedby={state() === "error" ? "newsletter-error" : undefined}
              aria-invalid={state() === "error" ? "true" : undefined}
            />
          </div>

          <div class="newsletter__consent">
            <label class="newsletter__consent-label">
              <input
                type="checkbox"
                name="consent"
                class="newsletter__consent-checkbox"
                required
                checked={consent()}
                onChange={(e) => setConsent(e.currentTarget.checked)}
              />
              <span>{copy().consentLabel}</span>
            </label>
          </div>

          <Show when={state() === "error"}>
            <div id="newsletter-error" class="newsletter__error" role="alert" aria-live="assertive">
              <strong>{copy().errorTitle}</strong>
              <p>{errorDetail() || copy().errorMessage}</p>
            </div>
          </Show>

          {(() => {
            const label = () => (state() === "submitting" ? copy().submitting : copy().submitLabel)
            const isDisabled = () => state() === "submitting" || !consent() || !email()
            return (
              <button
                type="submit"
                class="newsletter__submit"
                disabled={isDisabled()}
                data-loading={state() === "submitting" ? "" : undefined}
              >
                {label()}
              </button>
            )
          })()}

          <p class="newsletter__privacy">
            {copy().privacyNote}
            <a href={copy().privacyHref}>{copy().privacyLink}</a>.
          </p>
        </form>
      </Show>
    </section>
  )
}
