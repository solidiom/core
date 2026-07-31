// src/meta.ts
var recipeProfile = "tailwind";
var supportedPrimitives = [
  "dialog",
  "select",
  "button",
  "checkbox",
  "switch",
  "tabs",
  "accordion",
  "popover",
  "tooltip",
  "menu",
  "toast",
  "badge",
  "alert"
];

// src/recipes/dialog.tsx
import * as Dialog from "@solidiom/dialog";
function StyledDialog(props) {
  return <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Trigger>{props.trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Content>
          <Dialog.Title>{props.title}</Dialog.Title>
          {props.description && <Dialog.Description>{props.description}</Dialog.Description>}
          {props.children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>;
}

// src/recipes/button.tsx
import * as Button from "@solidiom/button";

// src/recipes/button.variants.ts
import { cva } from "class-variance-authority";
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border-none font-medium cursor-pointer rounded-radius transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "bg-transparent text-foreground border-solid border-border",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "bg-transparent text-foreground",
        link: "bg-transparent text-primary underline underline-offset-4"
      },
      size: {
        sm: "h-9 py-0 px-3 text-sm",
        md: "h-10 py-2 px-4 text-sm",
        lg: "h-11 py-0 px-8 text-base",
        icon: "h-10 w-10 py-0 px-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    },
    compoundVariants: [
      {
        variant: "ghost",
        size: "icon",
        class: "rounded-radius-full"
      },
      {
        variant: "link",
        size: "md",
        class: "h-auto py-0 px-0"
      }
    ]
  }
);

// src/recipes/button.tsx
function StyledButton(props) {
  const className = () => [buttonVariants({ variant: props.variant, size: props.size }), props.class].filter(Boolean).join(" ");
  return <Button.Root
    disabled={props.disabled}
    loading={props.loading}
    onClick={props.onClick}
    type={props.type}
    class={className()}
  >
      {props.children}
    </Button.Root>;
}

// src/recipes/checkbox.tsx
import * as Checkbox from "@solidiom/checkbox";
function StyledCheckbox(props) {
  return <Checkbox.Root
    checked={props.checked}
    defaultChecked={props.defaultChecked}
    onCheckedChange={props.onCheckedChange}
    disabled={props.disabled}
  >
      <Checkbox.Indicator>{props.children ?? <CheckIcon />}</Checkbox.Indicator>
    </Checkbox.Root>;
}
function CheckIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
    width="12"
    height="12"
  >
      <path d="M20 6 9 17l-5-5" />
    </svg>;
}

// src/recipes/switch.tsx
import * as Switch from "@solidiom/switch";
function StyledSwitch(props) {
  return <Switch.Root
    checked={props.checked}
    defaultChecked={props.defaultChecked}
    onCheckedChange={props.onCheckedChange}
    disabled={props.disabled}
  >
      <Switch.Thumb />
    </Switch.Root>;
}

// src/recipes/tabs.tsx
import * as Tabs from "@solidiom/tabs";
function StyledTabs(props) {
  return <Tabs.Root defaultValue={props.defaultValue} orientation={props.orientation}>
      {props.children}
    </Tabs.Root>;
}

// src/recipes/accordion.tsx
import * as Accordion from "@solidiom/accordion";
function StyledAccordion(props) {
  return <Accordion.Root type={props.type}>{props.children}</Accordion.Root>;
}

// src/recipes/popover.tsx
import * as Popover from "@solidiom/popover";
function StyledPopover(props) {
  return <Popover.Root>
      <Popover.Trigger>{props.trigger}</Popover.Trigger>
      <Popover.Content>{props.children}</Popover.Content>
    </Popover.Root>;
}

// src/recipes/tooltip.tsx
import * as Tooltip from "@solidiom/tooltip";
function StyledTooltip(props) {
  return <Tooltip.Root>
      <Tooltip.Trigger>{props.trigger}</Tooltip.Trigger>
      <Tooltip.Content>{props.content}</Tooltip.Content>
    </Tooltip.Root>;
}

// src/recipes/menu.tsx
import * as Menu from "@solidiom/menu";
function StyledMenu(props) {
  return <Menu.Root>
      <Menu.Trigger>{props.trigger}</Menu.Trigger>
      <Menu.Content>{props.children}</Menu.Content>
    </Menu.Root>;
}

// src/recipes/toast.tsx
import * as Toast from "@solidiom/toast";
function StyledToast(props) {
  return <Toast.Root toastId={props.toastId}>{props.children}</Toast.Root>;
}

// src/recipes/select.tsx
import * as Select from "@solidiom/select";
function StyledSelect(props) {
  return <Select.Root value={props.value} onValueChange={props.onValueChange}>
      <Select.Trigger>{props.trigger}</Select.Trigger>
      <Select.Content>{props.children}</Select.Content>
    </Select.Root>;
}

// src/recipes/badge.tsx
import * as Badge from "@solidiom/badge";

// src/recipes/badge.variants.ts
import { cva as cva2 } from "class-variance-authority";
var badgeVariants = cva2(
  "inline-flex items-center py-0.5 px-2.5 border-solid border-transparent rounded-radius text-xs leading-4 font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive-hover",
        outline: "text-foreground border-border bg-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

// src/recipes/badge.tsx
function StyledBadge(props) {
  return <Badge.Root class={badgeVariants({ variant: props.variant })}>{props.children}</Badge.Root>;
}

// src/recipes/alert.tsx
import * as Alert from "@solidiom/alert";
function StyledAlert(props) {
  return <Alert.Root type={props.variant ?? "info"} assertiveness={props.assertiveness}>
      {props.children}
    </Alert.Root>;
}

// src/recipes/typeset.tsx
var typeset = {
  heading1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  heading2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight",
  heading3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  heading4: "scroll-m-20 text-xl font-semibold tracking-tight",
  paragraph: "leading-7 [&:not(:first-child)]:mt-6",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
};
export {
  StyledAccordion,
  StyledAlert,
  StyledBadge,
  StyledButton,
  StyledCheckbox,
  StyledDialog,
  StyledMenu,
  StyledPopover,
  StyledSelect,
  StyledSwitch,
  StyledTabs,
  StyledToast,
  StyledTooltip,
  buttonVariants,
  recipeProfile,
  supportedPrimitives,
  typeset
};
//# sourceMappingURL=index.js.map