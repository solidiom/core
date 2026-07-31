// src/meta.ts
var recipeProfile = "unocss";
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
var buttonVariants = cva("solidiom-btn", {
  variants: {
    variant: {
      default: "solidiom-btn--default",
      destructive: "solidiom-btn--destructive",
      outline: "solidiom-btn--outline",
      secondary: "solidiom-btn--secondary",
      ghost: "solidiom-btn--ghost",
      link: "solidiom-btn--link"
    },
    size: {
      sm: "solidiom-btn--sm",
      md: "solidiom-btn--md",
      lg: "solidiom-btn--lg",
      icon: "solidiom-btn--icon"
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
      class: "solidiom-btn--ghost-icon"
    },
    {
      variant: "link",
      size: "md",
      class: "solidiom-btn--link-md"
    }
  ]
});

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
var badgeVariants = cva2("solidiom-badge", {
  variants: {
    variant: {
      default: "solidiom-badge--default",
      secondary: "solidiom-badge--secondary",
      destructive: "solidiom-badge--destructive",
      outline: "solidiom-badge--outline"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

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

// src/index.ts
var implementedRecipes = supportedPrimitives;
export {
  Alert,
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
  implementedRecipes,
  recipeProfile,
  supportedPrimitives
};
//# sourceMappingURL=index.js.map