import type { Element } from "solid-js"

export interface DemoEntry {
  component: () => Element
  code: string
}

// Static imports (demos are small, no need for lazy loading complexity)
import { DialogDemo, dialogDemoCode } from "./dialog-demo"
import { AccordionDemo, accordionDemoCode } from "./accordion-demo"
import { TabsDemo, tabsDemoCode } from "./tabs-demo"
import { CheckboxDemo, checkboxDemoCode } from "./checkbox-demo"
import { SwitchDemo, switchDemoCode } from "./switch-demo"
import { CollapsibleDemo, collapsibleDemoCode } from "./collapsible-demo"
import { SelectDemo, selectDemoCode } from "./select-demo"
import { ComboboxDemo, comboboxDemoCode } from "./combobox-demo"
import { ListboxDemo, listboxDemoCode } from "./listbox-demo"
import { MenuDemo, menuDemoCode } from "./menu-demo"
import { NavigationMenuDemo, navigationMenuDemoCode } from "./navigation-menu-demo"
import { ButtonDemo, buttonDemoCode } from "./button-demo"
import { PopoverDemo, popoverDemoCode } from "./popover-demo"
import { TooltipDemo, tooltipDemoCode } from "./tooltip-demo"
import { SliderDemo, sliderDemoCode } from "./slider-demo"
import { CalendarDemo, calendarDemoCode } from "./calendar-demo"
import { RangeCalendarDemo, rangeCalendarDemoCode } from "./range-calendar-demo"
import { CarouselDemo, carouselDemoCode } from "./carousel-demo"
import { ToastDemo, toastDemoCode } from "./toast-demo"
import { DrawerDemo, drawerDemoCode } from "./drawer-demo"
import { DatePickerDemo, datePickerDemoCode } from "./date-picker-demo"
import { VirtualListDemo, virtualListDemoCode } from "./virtual-list-demo"
import { DataTableDemo, dataTableDemoCode } from "./data-table-demo"
import { TreeDemo, treeDemoCode } from "./tree-demo"
import { ResizablePanelsDemo, resizablePanelsDemoCode } from "./resizable-panels-demo"
import { CommandPaletteDemo, commandPaletteDemoCode } from "./command-palette-demo"
import { BadgeDemo, badgeDemoCode } from "./badge-demo"
import { AlertDemo, alertDemoCode } from "./alert-demo"
import { LabelDemo, labelDemoCode } from "./label-demo"
import { MeterDemo, meterDemoCode } from "./meter-demo"
import { ProgressDemo, progressDemoCode } from "./progress-demo"
import { SeparatorDemo, separatorDemoCode } from "./separator-demo"
import { ToggleGroupDemo, toggleGroupDemoCode } from "./toggle-group-demo"
import { ToggleDemo, toggleDemoCode } from "./toggle-demo"
import { VisuallyHiddenDemo, visuallyHiddenDemoCode } from "./visually-hidden-demo"
import { PaginationDemo, paginationDemoCode } from "./pagination-demo"
import { RadioGroupDemo, radioGroupDemoCode } from "./radio-group-demo"
import { FieldDemo, fieldDemoCode } from "./field-demo"
import { InputOTPDemo, inputOTPDemoCode } from "./input-otp-demo"
import { ScrollAreaDemo, scrollAreaDemoCode } from "./scroll-area-demo"

export const demos: Record<string, DemoEntry> = {
  dialog: { component: () => DialogDemo(), code: dialogDemoCode },
  accordion: { component: () => AccordionDemo(), code: accordionDemoCode },
  tabs: { component: () => TabsDemo(), code: tabsDemoCode },
  checkbox: { component: () => CheckboxDemo(), code: checkboxDemoCode },
  switch: { component: () => SwitchDemo(), code: switchDemoCode },
  collapsible: { component: () => CollapsibleDemo(), code: collapsibleDemoCode },
  select: { component: () => SelectDemo(), code: selectDemoCode },
  combobox: { component: () => ComboboxDemo(), code: comboboxDemoCode },
  listbox: { component: () => ListboxDemo(), code: listboxDemoCode },
  menu: { component: () => MenuDemo(), code: menuDemoCode },
  "navigation-menu": { component: () => NavigationMenuDemo(), code: navigationMenuDemoCode },
  calendar: { component: () => CalendarDemo(), code: calendarDemoCode },
  "range-calendar": { component: () => RangeCalendarDemo(), code: rangeCalendarDemoCode },
  carousel: { component: () => CarouselDemo(), code: carouselDemoCode },
  toast: { component: () => ToastDemo(), code: toastDemoCode },
  button: { component: () => ButtonDemo(), code: buttonDemoCode },
  popover: { component: () => PopoverDemo(), code: popoverDemoCode },
  tooltip: { component: () => TooltipDemo(), code: tooltipDemoCode },
  slider: { component: () => SliderDemo(), code: sliderDemoCode },
  drawer: { component: () => DrawerDemo(), code: drawerDemoCode },
  "date-picker": { component: () => DatePickerDemo(), code: datePickerDemoCode },
  "virtual-list": { component: () => VirtualListDemo(), code: virtualListDemoCode },
  "data-table": { component: () => DataTableDemo(), code: dataTableDemoCode },
  tree: { component: () => TreeDemo(), code: treeDemoCode },
  "resizable-panels": { component: () => ResizablePanelsDemo(), code: resizablePanelsDemoCode },
  "command-palette": { component: () => CommandPaletteDemo(), code: commandPaletteDemoCode },
  badge: { component: () => BadgeDemo(), code: badgeDemoCode },
  alert: { component: () => AlertDemo(), code: alertDemoCode },
  label: { component: () => LabelDemo(), code: labelDemoCode },
  meter: { component: () => MeterDemo(), code: meterDemoCode },
  progress: { component: () => ProgressDemo(), code: progressDemoCode },
  separator: { component: () => SeparatorDemo(), code: separatorDemoCode },
  "toggle-group": { component: () => ToggleGroupDemo(), code: toggleGroupDemoCode },
  toggle: { component: () => ToggleDemo(), code: toggleDemoCode },
  "visually-hidden": { component: () => VisuallyHiddenDemo(), code: visuallyHiddenDemoCode },
  pagination: { component: () => PaginationDemo(), code: paginationDemoCode },
  "radio-group": { component: () => RadioGroupDemo(), code: radioGroupDemoCode },
  field: { component: () => FieldDemo(), code: fieldDemoCode },
  "input-otp": { component: () => InputOTPDemo(), code: inputOTPDemoCode },
  "scroll-area": { component: () => ScrollAreaDemo(), code: scrollAreaDemoCode },
}
