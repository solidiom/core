/**
 * @solidiom/empty-state — Placeholder for empty content areas.
 *
 * Parts: Root, Icon, Title, Description, Action.
 */
import { type JSX } from "@solidjs/web";
export interface EmptyStateRootProps {
    class?: string;
    style?: JSX.CSSProperties | string;
    children: JSX.Element;
}
export declare function Root(props: EmptyStateRootProps): JSX.Element;
export interface EmptyStateIconProps {
    class?: string;
    children: JSX.Element;
}
export declare function Icon(props: EmptyStateIconProps): JSX.Element;
export interface EmptyStateTitleProps {
    class?: string;
    children: JSX.Element;
}
export declare function Title(props: EmptyStateTitleProps): JSX.Element;
export interface EmptyStateDescriptionProps {
    class?: string;
    children: JSX.Element;
}
export declare function Description(props: EmptyStateDescriptionProps): JSX.Element;
export interface EmptyStateActionProps {
    class?: string;
    children: JSX.Element;
}
export declare function Action(props: EmptyStateActionProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map