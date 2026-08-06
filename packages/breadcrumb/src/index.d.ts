/**
 * @solidiom/breadcrumb — Hierarchical navigation breadcrumb.
 *
 * Parts: Root, List, Item, Link, Separator, Ellipsis.
 */
import { type JSX } from "@solidjs/web";
export interface RootProps {
    children: JSX.Element;
    class?: string;
}
export interface ListProps {
    children: JSX.Element;
    class?: string;
}
export interface ItemProps {
    children: JSX.Element;
    class?: string;
}
export interface LinkProps {
    children: JSX.Element;
    href: string;
    current?: boolean;
    class?: string;
}
export interface SeparatorProps {
    children?: JSX.Element;
    class?: string;
}
export interface EllipsisProps {
    children?: JSX.Element;
    class?: string;
}
export declare function Root(props: RootProps): JSX.Element;
export declare function List(props: ListProps): JSX.Element;
export declare function Item(props: ItemProps): JSX.Element;
export declare function Link(props: LinkProps): JSX.Element;
export declare function Separator(props: SeparatorProps): JSX.Element;
export declare function Ellipsis(props: EllipsisProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map