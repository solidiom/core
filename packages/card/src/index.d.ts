/**
 * @solidiom/card — Content container primitive.
 *
 * Parts: Root, Header, Title, Description, Content, Footer.
 */
import { type JSX } from "@solidjs/web";
export interface CardRootProps {
    class?: string;
    style?: JSX.CSSProperties | string;
    children: JSX.Element;
}
export declare function Root(props: CardRootProps): JSX.Element;
export interface CardHeaderProps {
    class?: string;
    style?: JSX.CSSProperties | string;
    children: JSX.Element;
}
export declare function Header(props: CardHeaderProps): JSX.Element;
export interface CardTitleProps {
    class?: string;
    children: JSX.Element;
}
export declare function Title(props: CardTitleProps): JSX.Element;
export interface CardDescriptionProps {
    class?: string;
    children: JSX.Element;
}
export declare function Description(props: CardDescriptionProps): JSX.Element;
export interface CardContentProps {
    class?: string;
    style?: JSX.CSSProperties | string;
    children: JSX.Element;
}
export declare function Content(props: CardContentProps): JSX.Element;
export interface CardFooterProps {
    class?: string;
    style?: JSX.CSSProperties | string;
    children: JSX.Element;
}
export declare function Footer(props: CardFooterProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map