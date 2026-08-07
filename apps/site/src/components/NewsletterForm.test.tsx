/**
 * NEWS-002: Newsletter keyboard, error, localization, privacy, and endpoint tests.
 */

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { render, fireEvent, screen, cleanup } from "@solidjs/testing-library"
import { NewsletterForm } from "./NewsletterForm"

describe("NewsletterForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  // ─── Localization ───────────────────────────────────────────────────────────

  describe("localization", () => {
    it("renders English copy when locale is en", () => {
      render(() => <NewsletterForm locale="en" publicationId="test-id" />)
      expect(screen.getByText("Newsletter")).toBeTruthy()
      expect(screen.getByLabelText("Email address")).toBeTruthy()
      expect(screen.getByText(/I consent/)).toBeTruthy()
      expect(screen.getByRole("button", { name: "Subscribe" })).toBeTruthy()
    })

    it("renders Spanish copy when locale is es", () => {
      render(() => <NewsletterForm locale="es" publicationId="test-id" />)
      expect(screen.getByText("Boletín")).toBeTruthy()
      expect(screen.getByLabelText("Correo electrónico")).toBeTruthy()
      expect(screen.getByText(/Consiento/)).toBeTruthy()
      expect(screen.getByRole("button", { name: "Suscribirse" })).toBeTruthy()
    })

    it("links to locale-appropriate privacy policy", () => {
      const { unmount } = render(() => <NewsletterForm locale="en" publicationId="test-id" />)
      expect(screen.getByText("privacy policy").closest("a")).toHaveAttribute("href", "/privacy/")
      unmount()

      render(() => <NewsletterForm locale="es" publicationId="test-id" />)
      expect(screen.getByText("política de privacidad").closest("a")).toHaveAttribute(
        "href",
        "/es/privacy/",
      )
    })
  })

  // ─── Keyboard and a11y ──────────────────────────────────────────────────────

  describe("keyboard and accessibility", () => {
    it("has accessible email input with label", () => {
      render(() => <NewsletterForm locale="en" publicationId="test-id" />)
      const input = screen.getByLabelText("Email address")
      expect(input).toHaveAttribute("type", "email")
      expect(input).toHaveAttribute("autocomplete", "email")
      expect(input).toHaveAttribute("required")
    })

    it("consent checkbox is required", () => {
      render(() => <NewsletterForm locale="en" publicationId="test-id" />)
      const checkbox = screen.getByRole("checkbox")
      expect(checkbox).toHaveAttribute("required")
    })

    it("submit button is disabled without consent", () => {
      render(() => <NewsletterForm locale="en" publicationId="test-id" />)
      const button = screen.getByRole("button", { name: "Subscribe" })
      expect(button).toBeDisabled()
    })

    it("submit button enables when email + consent provided", async () => {
      render(() => <NewsletterForm locale="en" publicationId="test-id" />)
      const input = screen.getByLabelText("Email address")
      const checkbox = screen.getByRole("checkbox")
      const button = screen.getByRole("button", { name: "Subscribe" })

      await fireEvent.input(input, { target: { value: "test@example.com" } })
      await fireEvent.click(checkbox)

      expect(button).not.toBeDisabled()
    })

    it("error state uses aria-live and aria-invalid", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ detail: "Invalid email" }),
      })

      render(() => <NewsletterForm locale="en" publicationId="test-id" />)
      const input = screen.getByLabelText("Email address")
      const checkbox = screen.getByRole("checkbox")

      await fireEvent.input(input, { target: { value: "bad" } })
      await fireEvent.click(checkbox)
      await fireEvent.click(screen.getByRole("button", { name: "Subscribe" }))

      // Wait for async state update
      await vi.waitFor(() => {
        expect(screen.getByRole("alert")).toBeTruthy()
      })

      expect(input).toHaveAttribute("aria-invalid", "true")
    })

    it("success state uses role=status for screen readers", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve({}),
      })

      render(() => <NewsletterForm locale="en" publicationId="test-id" />)
      const input = screen.getByLabelText("Email address")
      const checkbox = screen.getByRole("checkbox")

      await fireEvent.input(input, { target: { value: "test@example.com" } })
      await fireEvent.click(checkbox)
      await fireEvent.click(screen.getByRole("button", { name: "Subscribe" }))

      await vi.waitFor(() => {
        expect(screen.getByRole("status")).toBeTruthy()
      })
      expect(screen.getByText("Subscribed!")).toBeTruthy()
    })
  })

  // ─── Privacy ────────────────────────────────────────────────────────────────

  describe("privacy", () => {
    it("does not submit without explicit consent", async () => {
      global.fetch = vi.fn()
      render(() => <NewsletterForm locale="en" publicationId="test-id" />)
      const input = screen.getByLabelText("Email address")
      await fireEvent.input(input, { target: { value: "test@example.com" } })

      // Try submit without checking consent
      const form = screen.getByRole("button", { name: "Subscribe" }).closest("form")!
      await fireEvent.submit(form)

      expect(global.fetch).not.toHaveBeenCalled()
    })

    it("sends only email and locale metadata to endpoint", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve({}),
      })

      render(() => <NewsletterForm locale="es" publicationId="test-key" />)
      const input = screen.getByLabelText("Correo electrónico")
      const checkbox = screen.getByRole("checkbox")

      await fireEvent.input(input, { target: { value: "user@example.com" } })
      await fireEvent.click(checkbox)
      await fireEvent.click(screen.getByRole("button", { name: "Suscribirse" }))

      await vi.waitFor(() => expect(global.fetch).toHaveBeenCalled())

      const [url, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
      expect(url).toBe("https://api.buttondown.com/v1/subscribers")

      const body = JSON.parse(options.body)
      expect(Object.keys(body).sort()).toEqual(["email", "metadata"])
      expect(body.email).toBe("user@example.com")
      expect(body.metadata).toEqual({ locale: "es" })
      // No name, IP, user agent, or other PII
    })

    it("does not include tracking headers or cookies in request", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve({}),
      })

      render(() => <NewsletterForm locale="en" publicationId="test-key" />)
      const input = screen.getByLabelText("Email address")
      const checkbox = screen.getByRole("checkbox")

      await fireEvent.input(input, { target: { value: "test@example.com" } })
      await fireEvent.click(checkbox)
      await fireEvent.click(screen.getByRole("button", { name: "Subscribe" }))

      await vi.waitFor(() => expect(global.fetch).toHaveBeenCalled())

      const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
      const headers = options.headers as Record<string, string>
      expect(headers["Content-Type"]).toBe("application/json")
      // No cookies, no tracking headers
      expect(headers).not.toHaveProperty("Cookie")
      expect(headers).not.toHaveProperty("X-Tracking-Id")
    })
  })

  // ─── Endpoint ───────────────────────────────────────────────────────────────

  describe("endpoint", () => {
    it("posts to Buttondown API v1 subscribers endpoint", async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 201, json: () => ({}) })
      render(() => <NewsletterForm locale="en" publicationId="my-pub" />)

      await fireEvent.input(screen.getByLabelText("Email address"), {
        target: { value: "a@b.com" },
      })
      await fireEvent.click(screen.getByRole("checkbox"))
      await fireEvent.click(screen.getByRole("button", { name: "Subscribe" }))

      await vi.waitFor(() => expect(global.fetch).toHaveBeenCalled())
      expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(
        "https://api.buttondown.com/v1/subscribers",
      )
    })

    it("uses custom apiBase when provided", async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 201, json: () => ({}) })
      render(() => (
        <NewsletterForm locale="en" publicationId="my-pub" apiBase="https://custom.api" />
      ))

      await fireEvent.input(screen.getByLabelText("Email address"), {
        target: { value: "a@b.com" },
      })
      await fireEvent.click(screen.getByRole("checkbox"))
      await fireEvent.click(screen.getByRole("button", { name: "Subscribe" }))

      await vi.waitFor(() => expect(global.fetch).toHaveBeenCalled())
      expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(
        "https://custom.api/v1/subscribers",
      )
    })

    it("handles network errors gracefully", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"))
      render(() => <NewsletterForm locale="en" publicationId="test-id" />)

      await fireEvent.input(screen.getByLabelText("Email address"), {
        target: { value: "a@b.com" },
      })
      await fireEvent.click(screen.getByRole("checkbox"))
      await fireEvent.click(screen.getByRole("button", { name: "Subscribe" }))

      await vi.waitFor(() => {
        expect(screen.getByRole("alert")).toBeTruthy()
      })
      expect(screen.getByText("Something went wrong")).toBeTruthy()
    })
  })
})
