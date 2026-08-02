import type { ThemeDefinition } from "../../../../../tools/theme-contract-schema"
import { validateThemeDefinition } from "../../../../../tools/theme-contract-validate"

export const SHARE_VERSION = 1
export const SHARE_MAX_SIZE = 50 * 1024 // 50KB
export const SHARE_HASH_PREFIX = "t="

export interface SharePayload {
  v: number
  t: ThemeDefinition
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ""
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(base64: string): Uint8Array {
  const binary = atob(
    base64.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(base64.length % 4 || 4),
  )
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function encodeTheme(theme: ThemeDefinition): string {
  const payload: SharePayload = { v: SHARE_VERSION, t: theme }
  const json = JSON.stringify(payload)
  const encoded = toBase64Url(new TextEncoder().encode(json))
  return encoded
}

export function decodeTheme(encoded: string): { theme?: ThemeDefinition; error?: string } {
  let raw: Uint8Array
  try {
    raw = fromBase64Url(encoded)
  } catch {
    return { error: "The share URL contains invalid encoding." }
  }

  const size = raw.byteLength
  if (size > SHARE_MAX_SIZE) {
    return { error: "The share URL exceeds the maximum allowed size." }
  }

  let json: string
  try {
    json = new TextDecoder().decode(raw)
  } catch {
    return { error: "The share URL contains corrupted data." }
  }

  let payload: SharePayload
  try {
    payload = JSON.parse(json)
  } catch {
    return { error: "The share URL contains invalid data." }
  }

  if (!payload || typeof payload.v !== "number" || !payload.t) {
    return { error: "The share URL has an unrecognized format." }
  }

  if (payload.v !== SHARE_VERSION) {
    return { error: "The share URL uses an unsupported version." }
  }

  const theme = payload.t as ThemeDefinition
  const violations = validateThemeDefinition(theme)
  if (violations.length > 0) {
    return { error: "The shared theme is invalid: " + violations[0].message }
  }

  return { theme }
}

export function themeToHash(theme: ThemeDefinition): string {
  const encoded = encodeTheme(theme)
  return `#${SHARE_HASH_PREFIX}${encoded}`
}

export function hashToTheme(hash: string): { theme?: ThemeDefinition; error?: string } {
  const hashStr = hash.replace(/^#/, "")
  if (!hashStr.startsWith(SHARE_HASH_PREFIX)) {
    return {}
  }
  const encoded = hashStr.slice(SHARE_HASH_PREFIX.length)
  if (!encoded) {
    return {}
  }
  return decodeTheme(encoded)
}

export function getShareUrl(theme: ThemeDefinition): string {
  const hash = themeToHash(theme)
  const base =
    typeof window !== "undefined" ? window.location.origin + window.location.pathname : "/"
  return base + hash
}

export function getShareSize(theme: ThemeDefinition): number {
  const encoded = encodeTheme(theme)
  return Math.ceil(encoded.length * 0.75)
}
