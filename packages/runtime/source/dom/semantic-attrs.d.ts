/**
 * Semantic attributes — stable data-* attribute helpers for primitives.
 *
 * Per §14.2: semantic attributes provide stable selectors for styling.
 * Only primitives may call applySemanticAttrs(). Adapters must never set them.
 */
/** Boolean flags that can be set on a semantic element. */
export interface SemanticFlags {
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  invalid?: boolean
  placeholder?: boolean
  highlighted?: boolean
  selected?: boolean
}
/** Options for applySemanticAttrs. */
export interface SemanticAttrsOptions extends SemanticFlags {
  /** The primitive scope (e.g. "dialog", "select"). */
  scope: string
  /** The part name (e.g. "trigger", "content"). */
  part: string
  /** Current state value (e.g. "open", "closed", "checked"). */
  state?: string
  /** Orientation value. */
  orientation?: "horizontal" | "vertical"
}
/** The returned attribute record to spread on a JSX element. */
export type SemanticAttrsResult = Record<string, string | undefined>
/**
 * Generates semantic data-* attributes for a primitive element.
 *
 * Returns a plain object suitable for spreading:
 * ```tsx
 * <div {...applySemanticAttrs({ scope: "dialog", part: "content", state: "open" })} />
 * ```
 *
 * Boolean flags use empty string for presence (truthy in attribute checks).
 * Undefined values are omitted from the result.
 */
export declare function applySemanticAttrs(options: SemanticAttrsOptions): SemanticAttrsResult
//# sourceMappingURL=semantic-attrs.d.ts.map
