/**
 * @solidiom/input-otp — A one-time password input with individual character slots.
 *
 * Parts: Root, Group, Slot.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
export interface InputOTPRootProps {
    /** Total number of characters. */
    maxLength: number;
    /** Controlled value. */
    value?: Accessor<string | undefined>;
    /** Default value (uncontrolled). */
    defaultValue?: string;
    /** Called when value changes. */
    onValueChange?: (value: string) => void;
    /** Called when all slots are filled. */
    onComplete?: (value: string) => void;
    /** Whether the input is disabled. */
    disabled?: boolean;
    /** Regex pattern for allowed characters (e.g. "^[0-9]*$"). */
    pattern?: string;
    class?: string;
    style?: JSX.CSSProperties | string;
    children?: JSX.Element;
}
/**
 * InputOTP root — manages a hidden input and exposes slot-level reactivity.
 *
 * Emits `data-scope="input-otp"`, `data-part="root"`.
 */
export declare function Root(props: InputOTPRootProps): JSX.Element;
export interface InputOTPGroupProps {
    class?: string;
    style?: JSX.CSSProperties | string;
    children?: JSX.Element;
}
/**
 * InputOTP group — visual grouping of slots (e.g. 3-3 grouping for 6 digits).
 *
 * Emits `data-scope="input-otp"`, `data-part="group"`.
 */
export declare function Group(props: InputOTPGroupProps): JSX.Element;
export interface InputOTPSlotProps {
    /** Zero-based index of this slot. */
    index: number;
    class?: string;
    style?: JSX.CSSProperties | string;
}
/**
 * InputOTP slot — displays a single character from the OTP value.
 *
 * Emits `data-scope="input-otp"`, `data-part="slot"`, `data-state="active"|"inactive"`,
 * `data-filled` when the slot has a character.
 */
export declare function Slot(props: InputOTPSlotProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map