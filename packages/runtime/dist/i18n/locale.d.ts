/**
 * Locale — locale context for internationalization.
 *
 * Per §9.5: provides the current locale for number formatting,
 * date formatting, and collation. Primitives that need locale-aware
 * behavior (e.g. NumberField, Calendar) read from this.
 */
import { type Accessor } from "solid-js";
/** A BCP 47 locale string (e.g. "en-US", "ja-JP"). */
export type Locale = string;
/** Options for resolving locale. */
export interface LocaleOptions {
    /** Explicit locale override. */
    locale?: Accessor<Locale | undefined>;
}
/**
 * Resolves the current locale.
 *
 * Priority: explicit prop > navigator.language > "en".
 */
export declare function resolveLocale(options?: LocaleOptions): Accessor<Locale>;
//# sourceMappingURL=locale.d.ts.map