/**
 * Hidden input — synchronizes primitive value to a hidden `<input>` for
 * native form participation.
 *
 * Per §9.5: form-capable primitives participate in native forms via
 * hidden inputs without requiring a form engine. Supports name, value,
 * required, disabled, and native reset handling.
 */
/** Options for a hidden input. */
export interface HiddenInputOptions {
    /** Form field name. */
    name: string;
    /** Current value to synchronize. */
    value: () => string | string[];
    /** Whether the field is required. */
    required?: () => boolean;
    /** Whether the field is disabled. */
    disabled?: () => boolean;
    /** Reference to the form element (for reset detection). */
    form?: () => HTMLFormElement | undefined;
}
/** Props to spread on a hidden `<input>` element. */
export interface HiddenInputProps {
    type: "hidden";
    name: string;
    value: string;
    required: boolean;
    disabled: boolean;
    "aria-hidden": "true";
    tabIndex: -1;
    style: string;
}
/**
 * Generates props for a hidden input that participates in native form submission.
 *
 * For multi-value fields (e.g. multi-select), returns an array of prop objects
 * (one hidden input per value).
 */
export declare function getHiddenInputProps(options: HiddenInputOptions): HiddenInputProps[];
//# sourceMappingURL=hidden-input.d.ts.map