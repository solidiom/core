// src/meta.ts
var recipeProfile = "css";
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
  "alert",
  "avatar",
  "spinner",
  "card",
  "breadcrumb",
  "pagination",
  "meter",
  "progress"
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

// src/recipes/avatar.tsx
import * as Avatar from "@solidiom/avatar";
function StyledAvatar(props) {
  return <Avatar.Root>
      {props.src && <Avatar.Image src={props.src} alt={props.alt} />}
      {(props.fallback || props.children) && <Avatar.Fallback>{props.fallback || props.children}</Avatar.Fallback>}
    </Avatar.Root>;
}

// src/recipes/spinner.tsx
import * as Spinner from "@solidiom/spinner";
function StyledSpinner(props) {
  return <Spinner.Root label={props.label}>
      {props.children}
    </Spinner.Root>;
}

// src/recipes/card.tsx
import * as Card from "@solidiom/card";
var BASE_CLASS = "solidiom-card";
function StyledCard(props) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ");
  return <Card.Root {...props} class={className()} />;
}

// src/recipes/breadcrumb.tsx
import * as Breadcrumb from "@solidiom/breadcrumb";
var BASE_CLASS2 = "solidiom-breadcrumb";
function StyledBreadcrumb(props) {
  const className = () => [BASE_CLASS2, props.class].filter(Boolean).join(" ");
  return <Breadcrumb.Root {...props} class={className()} />;
}

// src/recipes/pagination.tsx
import * as Pagination from "@solidiom/pagination";
var BASE_CLASS3 = "solidiom-pagination";
function StyledPagination(props) {
  const className = () => [BASE_CLASS3, props.class].filter(Boolean).join(" ");
  return <Pagination.Root {...props} class={className()} />;
}

// src/recipes/data-table.tsx
import * as DataTable from "@solidiom/data-table";
var BASE_CLASS4 = "solidiom-data-table";
function StyledDataTable(props) {
  const className = () => [BASE_CLASS4, props.class].filter(Boolean).join(" ");
  return <DataTable.Root {...props} class={className()} />;
}

// src/recipes/progress.tsx
import * as Progress from "@solidiom/progress";
var BASE_CLASS5 = "solidiom-progress";
function StyledProgress(props) {
  const className = () => [BASE_CLASS5, props.class].filter(Boolean).join(" ");
  return <Progress.Root {...props} class={className()} />;
}
export {
  StyledAccordion,
  StyledAlert,
  StyledAvatar,
  StyledBadge,
  StyledBreadcrumb,
  StyledButton,
  StyledCard,
  StyledCheckbox,
  StyledDataTable,
  StyledDialog,
  StyledMenu,
  StyledPagination,
  StyledPopover,
  StyledProgress,
  StyledSelect,
  StyledSpinner,
  StyledSwitch,
  StyledTabs,
  StyledToast,
  StyledTooltip,
  buttonVariants,
  recipeProfile,
  supportedPrimitives
};
//# sourceMappingURL=index.js.map