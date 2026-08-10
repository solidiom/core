import * as Breadcrumb from "@solidiom/breadcrumb"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    items: Array<{ label: string; href: string; current?: boolean }>
  }
> = {
  en: {
    items: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Widget", href: "/products/widget", current: true },
    ],
  },
  es: {
    items: [
      { label: "Inicio", href: "/" },
      { label: "Productos", href: "/productos" },
      { label: "Widget", href: "/productos/widget", current: true },
    ],
  },
}

export interface BreadcrumbExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Breadcrumb documentation example.
 * Shows hierarchical navigation with separators and a current-page indicator.
 */
export function BreadcrumbExample(props: BreadcrumbExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="breadcrumb-example"
      data-breadcrumb-example
    >
      <Breadcrumb.Root>
        <Breadcrumb.List>
          {copy().items.map((item, index) => (
            <>
              <Breadcrumb.Item>
                <Breadcrumb.Link href={item.href} current={item.current}>
                  {item.label}
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              {index < copy().items.length - 1 && <Breadcrumb.Separator />}
            </>
          ))}
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </div>
  )
}
