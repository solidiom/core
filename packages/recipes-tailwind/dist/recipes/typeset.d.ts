/**
 * Typeset — Tailwind recipe: frozen class-string map for granular typography scale.
 * No cva() — these entries have no variants, so a function call adds nothing.
 *
 * Import stylesheet (for data-attribute usage):
 *   `import "@solidiom/recipes-tailwind/styles/typeset.css"`
 */
export declare const typeset: {
    readonly heading1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl";
    readonly heading2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight";
    readonly heading3: "scroll-m-20 text-2xl font-semibold tracking-tight";
    readonly heading4: "scroll-m-20 text-xl font-semibold tracking-tight";
    readonly paragraph: "leading-7 [&:not(:first-child)]:mt-6";
    readonly lead: "text-xl text-muted-foreground";
    readonly large: "text-lg font-semibold";
    readonly small: "text-sm font-medium leading-none";
    readonly muted: "text-sm text-muted-foreground";
    readonly blockquote: "mt-6 border-l-2 pl-6 italic";
    readonly inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold";
};
export type TypesetKey = keyof typeof typeset;
//# sourceMappingURL=typeset.d.ts.map