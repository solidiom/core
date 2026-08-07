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
  "alert",
  "avatar",
  "spinner",
  "card",
  "breadcrumb",
  "pagination",
  "progress",
  "meter",
  "radio-group",
  "combobox",
  "sheet",
  "navigation-menu",
  "command-palette",
  "kbd",
  "resizable-panels",
  "scroll-area",
  "toolbar",
  "data-table",
  "field",
  "input"
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
import { twMerge } from "tailwind-merge";
var buttonVariantsCva = cva(
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
        sm: "h-9 py-0 px-3 text-[0.875rem]",
        md: "h-10 py-2 px-4 text-[0.875rem]",
        lg: "h-11 py-0 px-8 text-[1rem]",
        icon: "h-10 w-10 p-0"
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
        class: "h-auto p-0"
      }
    ]
  }
);
function buttonVariants(props) {
  return twMerge(buttonVariantsCva(props));
}

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
import { twMerge as twMerge2 } from "tailwind-merge";
var badgeVariantsCva = cva2(
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
function badgeVariants(props) {
  return twMerge2(badgeVariantsCva(props));
}

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

// src/recipes/prose.tsx
var PROSE_SIZES = ["sm", "base", "lg"];

// src/recipes/spinner.tsx
import * as Spinner from "@solidiom/spinner";
function StyledSpinner(props) {
  return <Spinner.Root label={props.label}>
      {props.children}
    </Spinner.Root>;
}

// src/recipes/card.tsx
import { twMerge as twMerge3 } from "tailwind-merge";
import * as Card from "@solidiom/card";
var ROOT_CLASSES = "border border-solid border-border rounded-radius bg-popover p-4";
function StyledCard(props) {
  const className = () => twMerge3(ROOT_CLASSES, props.class);
  return <Card.Root {...props} class={className()} />;
}

// src/recipes/breadcrumb.tsx
import { twMerge as twMerge4 } from "tailwind-merge";
import * as Breadcrumb from "@solidiom/breadcrumb";
var ROOT_CLASSES2 = "flex items-center gap-2 text-sm";
function StyledBreadcrumb(props) {
  const className = () => twMerge4(ROOT_CLASSES2, props.class);
  return <Breadcrumb.Root {...props} class={className()} />;
}

// src/recipes/pagination.tsx
import * as Pagination from "@solidiom/pagination";
var BASE_CLASS = "solidiom-pagination";
function StyledPagination(props) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ");
  return <Pagination.Root {...props} class={className()} />;
}

// src/recipes/data-table.tsx
import * as DataTable from "@solidiom/data-table";
var BASE_CLASS2 = "solidiom-data-table";
function StyledDataTable(props) {
  const className = () => [BASE_CLASS2, props.class].filter(Boolean).join(" ");
  return <DataTable.Root {...props} class={className()} />;
}

// src/recipes/progress.tsx
import { twMerge as twMerge5 } from "tailwind-merge";
import * as Progress from "@solidiom/progress";
var ROOT_CLASSES3 = "relative flex w-full h-2 overflow-hidden rounded-full bg-secondary";
function StyledProgress(props) {
  const className = () => twMerge5(ROOT_CLASSES3, props.class);
  return <Progress.Root {...props} class={className()} />;
}

// src/recipes/radio-group.tsx
import * as RadioGroup from "@solidiom/radio-group";
var BASE_CLASS3 = "solidiom-radio-group";
function StyledRadioGroup(props) {
  const className = () => [BASE_CLASS3, props.class].filter(Boolean).join(" ");
  return <RadioGroup.Root {...props} class={className()} />;
}

// src/recipes/combobox.tsx
import * as Combobox from "@solidiom/combobox";
var BASE_CLASS4 = "solidiom-combobox";
function StyledCombobox(props) {
  const className = () => [BASE_CLASS4, props.class].filter(Boolean).join(" ");
  return <Combobox.Root {...props} class={className()} />;
}

// src/recipes/sheet.tsx
import * as Sheet from "@solidiom/sheet";
var BASE_CLASS5 = "solidiom-sheet";
function StyledSheet(props) {
  const className = () => [BASE_CLASS5, props.class].filter(Boolean).join(" ");
  return <Sheet.Root {...props} class={className()} />;
}

// src/recipes/navigation-menu.tsx
import * as NavigationMenu from "@solidiom/navigation-menu";
var BASE_CLASS6 = "solidiom-navigation-menu";
function StyledNavigationMenu(props) {
  const className = () => [BASE_CLASS6, props.class].filter(Boolean).join(" ");
  return <NavigationMenu.Root {...props} class={className()} />;
}

// src/recipes/command-palette.tsx
import * as CommandPalette from "@solidiom/command-palette";
var BASE_CLASS7 = "solidiom-command-palette";
function StyledCommandPalette(props) {
  const className = () => [BASE_CLASS7, props.class].filter(Boolean).join(" ");
  return <CommandPalette.Root {...props} class={className()} />;
}

// src/recipes/kbd.tsx
import * as Kbd from "@solidiom/kbd";
var BASE_CLASS8 = "solidiom-kbd";
function StyledKbd(props) {
  const className = () => [BASE_CLASS8, props.class].filter(Boolean).join(" ");
  return <Kbd.Root {...props} class={className()} />;
}

// src/recipes/resizable-panels.tsx
import { PanelGroup, Panel, Handle } from "@solidiom/resizable-panels";
var BASE_CLASS9 = "solidiom-resizable-panels";
function StyledResizablePanels(props) {
  const className = () => [BASE_CLASS9, props.class].filter(Boolean).join(" ");
  return <PanelGroup {...props} class={className()} />;
}

// src/recipes/scroll-area.tsx
import * as ScrollArea from "@solidiom/scroll-area";
var BASE_CLASS10 = "solidiom-scroll-area";
function StyledScrollArea(props) {
  const className = () => [BASE_CLASS10, props.class].filter(Boolean).join(" ");
  return <ScrollArea.Root {...props} class={className()} />;
}

// src/recipes/toolbar.tsx
import * as Toolbar from "@solidiom/toolbar";
var BASE_CLASS11 = "solidiom-toolbar";
function StyledToolbar(props) {
  const className = () => [BASE_CLASS11, props.class].filter(Boolean).join(" ");
  return <Toolbar.Root {...props} class={className()} />;
}

// src/recipes/field.tsx
import { twMerge as twMerge6 } from "tailwind-merge";
import * as Field from "@solidiom/field";
var ROOT_CLASSES4 = "flex flex-col gap-1 disabled:opacity-50";
function StyledField(props) {
  const className = () => twMerge6(ROOT_CLASSES4, props.class);
  return <Field.Root {...props} class={className()} />;
}

// src/recipes/input.tsx
import { twMerge as twMerge7 } from "tailwind-merge";
import * as Input from "@solidiom/input";
var BASE_CLASSES = "block w-full min-h-[2.25rem] px-3 py-1.5 text-sm leading-5 border border-solid rounded-md outline-none transition-colors bg-background text-foreground border-border";
var FOCUS_CLASSES = "focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2";
var INVALID_CLASSES = "invalid:border-destructive";
var DISABLED_CLASSES = "disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50";
var READONLY_CLASSES = "readonly:bg-muted readonly:cursor-not-allowed";
function StyledInput(props) {
  const className = () => twMerge7(
    `${BASE_CLASSES} ${FOCUS_CLASSES} ${INVALID_CLASSES} ${DISABLED_CLASSES} ${READONLY_CLASSES}`,
    props.class
  );
  return <Input.Root {...props} class={className()} />;
}

// src/recipes/meter.tsx
import * as Meter from "@solidiom/meter";
var BASE_CLASS12 = "solidiom-meter";
function StyledMeter(props) {
  const className = () => [BASE_CLASS12, props.class].filter(Boolean).join(" ");
  return <Meter.Root {...props} class={className()} />;
}
export {
  PROSE_SIZES,
  StyledAccordion,
  StyledAlert,
  StyledAvatar,
  StyledBadge,
  StyledBreadcrumb,
  StyledButton,
  StyledCard,
  StyledCheckbox,
  StyledCombobox,
  StyledCommandPalette,
  StyledDataTable,
  StyledDialog,
  StyledField,
  StyledInput,
  StyledKbd,
  StyledMenu,
  StyledMeter,
  StyledNavigationMenu,
  StyledPagination,
  StyledPopover,
  StyledProgress,
  StyledRadioGroup,
  StyledResizablePanels,
  StyledScrollArea,
  StyledSelect,
  StyledSheet,
  StyledSpinner,
  StyledSwitch,
  StyledTabs,
  StyledToast,
  StyledToolbar,
  StyledTooltip,
  buttonVariants,
  recipeProfile,
  supportedPrimitives,
  typeset
};
//# sourceMappingURL=index.js.map