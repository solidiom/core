/**
 * @solidiom/avatar — Headless avatar primitive with image and fallback support.
 *
 * Parts: Root, Image, Fallback.
 */
import { type JSX } from "@solidjs/web";
export interface AvatarRootProps {
    class?: string;
    children: JSX.Element;
}
export declare function Root(props: AvatarRootProps): JSX.Element;
export interface AvatarImageProps {
    src: string;
    alt?: string;
    class?: string;
}
export declare function Image(props: AvatarImageProps): JSX.Element;
export interface AvatarFallbackProps {
    class?: string;
    children: JSX.Element;
}
export declare function Fallback(props: AvatarFallbackProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map