import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const components = [
  {
    title: "Alert Dialog",
    href: "#",
    description: "Accessible alert dialogs that match your design system.",
  },
  {
    title: "Button",
    href: "#",
    description: "Styling for <button> elements.",
  },
]

function ListItemLink({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a"> & {
  title: string
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}

export default function NavigationMenuPage() {
  return (
    <div className="w-full max-w-4xl">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 md:w-[400px] lg:w-[500px]">
                {components.map((component) => (
                  <ListItemLink key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItemLink>
                ))}
              </ul>
            </NavigationMenuContent>
            <NavigationMenuIndicator>
              <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
            </NavigationMenuIndicator>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <a href="#">Get Started</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    </div>
  )
}
