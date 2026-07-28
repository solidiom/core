import { describe, expect, it } from "vitest"
import type { JSX } from "@solidjs/web"
import * as Accordion from "@solidiom/accordion"
import * as Alert from "@solidiom/alert"
import * as AlertDialog from "@solidiom/alert-dialog"
import * as Avatar from "@solidiom/avatar"
import * as Badge from "@solidiom/badge"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Calendar from "@solidiom/calendar"
import * as Card from "@solidiom/card"
import * as Carousel from "@solidiom/carousel"
import * as Checkbox from "@solidiom/checkbox"
import * as Collapsible from "@solidiom/collapsible"
import * as Combobox from "@solidiom/combobox"
import * as CommandPalette from "@solidiom/command-palette"
import * as ContextMenu from "@solidiom/context-menu"
import * as DataTable from "@solidiom/data-table"
import * as DatePicker from "@solidiom/date-picker"
import * as Dialog from "@solidiom/dialog"
import * as Drawer from "@solidiom/drawer"
import * as EmptyState from "@solidiom/empty-state"
import * as Field from "@solidiom/field"
import * as HoverCard from "@solidiom/hover-card"
import * as Input from "@solidiom/input"
import * as InputOTP from "@solidiom/input-otp"
import * as Kbd from "@solidiom/kbd"
import * as Label from "@solidiom/label"
import * as Listbox from "@solidiom/listbox"
import * as Menu from "@solidiom/menu"
import * as Meter from "@solidiom/meter"
import * as NavigationMenu from "@solidiom/navigation-menu"
import * as Pagination from "@solidiom/pagination"
import * as Popover from "@solidiom/popover"
import * as Progress from "@solidiom/progress"
import * as RadioGroup from "@solidiom/radio-group"
import * as ResizablePanels from "@solidiom/resizable-panels"
import * as ScrollArea from "@solidiom/scroll-area"
import * as Select from "@solidiom/select"
import * as Separator from "@solidiom/separator"
import * as Sheet from "@solidiom/sheet"
import * as Skeleton from "@solidiom/skeleton"
import * as Slider from "@solidiom/slider"
import * as Spinner from "@solidiom/spinner"
import * as Switch from "@solidiom/switch"
import * as Tabs from "@solidiom/tabs"
import * as Toast from "@solidiom/toast"
import * as Toggle from "@solidiom/toggle"
import * as ToggleGroup from "@solidiom/toggle-group"
import * as Toolbar from "@solidiom/toolbar"
import * as Tooltip from "@solidiom/tooltip"
import * as Tree from "@solidiom/tree"
import * as VirtualList from "@solidiom/virtual-list"
import * as VisuallyHidden from "@solidiom/visually-hidden"
import { AXE_RESULT_PREFIX, PUBLIC_PRIMITIVES, type PublicPrimitive } from "../../tools/axe-results"
import { formatViolations, runAxeScan } from "./axe-helper"

const PRIMITIVE_FIXTURES: Record<PublicPrimitive, () => JSX.Element> = {
  accordion: () => (
    <Accordion.Root>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Section 1</Accordion.Trigger>
        <Accordion.Content>Content 1</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
  alert: () => <Alert.Root>This is an alert message</Alert.Root>,
  badge: () => <Badge.Root>New</Badge.Root>,
  button: () => <Button.Root>Click me</Button.Root>,
  calendar: () => (
    <>
      <Calendar.Root aria-label="Date picker" />
      <Calendar.RangeRoot aria-label="Range date picker">
        <Calendar.RangeHeader>
          <Calendar.RangePrevButton />
          <Calendar.RangeTitle />
          <Calendar.RangeNextButton />
        </Calendar.RangeHeader>
        <Calendar.RangeGrid>
          {(weeks) =>
            weeks.map((week) => (
              <tr>{week.map((day) => (day > 0 ? <Calendar.RangeCell day={day} /> : <td />))}</tr>
            ))
          }
        </Calendar.RangeGrid>
      </Calendar.RangeRoot>
    </>
  ),
  carousel: () => (
    <Carousel.Root geometry={{ slideCount: 1, slideWidth: 100, gap: 0 }}>
      <Carousel.Viewport>
        <Carousel.Slide index={0}>Slide 1</Carousel.Slide>
      </Carousel.Viewport>
    </Carousel.Root>
  ),
  checkbox: () => <Checkbox.Root aria-label="Accept terms">Accept terms</Checkbox.Root>,
  collapsible: () => (
    <Collapsible.Root>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>Hidden content</Collapsible.Content>
    </Collapsible.Root>
  ),
  combobox: () => (
    <Combobox.Root>
      <Combobox.Input placeholder="Search..." />
      <Combobox.Content>
        <Combobox.Item value="apple">Apple</Combobox.Item>
      </Combobox.Content>
    </Combobox.Root>
  ),
  "command-palette": () => (
    <CommandPalette.Root aria-label="Command palette">
      <CommandPalette.Input placeholder="Type a command..." />
      <CommandPalette.List>
        <CommandPalette.Item value="action">Action</CommandPalette.Item>
      </CommandPalette.List>
    </CommandPalette.Root>
  ),
  "data-table": () => (
    <DataTable.Root
      columns={[{ id: "name", accessorKey: "name" }]}
      data={[{ id: "row-1", name: "Row 1" }]}
    >
      <DataTable.Header>
        <DataTable.Row rowId="header">
          <DataTable.HeaderCell columnId="name">Name</DataTable.HeaderCell>
        </DataTable.Row>
      </DataTable.Header>
      <DataTable.Body>
        <DataTable.Row rowId="row-1">
          <DataTable.Cell>Row 1</DataTable.Cell>
        </DataTable.Row>
      </DataTable.Body>
    </DataTable.Root>
  ),
  "date-picker": () => <DatePicker.Root aria-label="Select a date" />,
  dialog: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Content aria-label="Example dialog">
        <Dialog.Title>Dialog Title</Dialog.Title>
        <Dialog.Description>Dialog description</Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  ),
  drawer: () => (
    <Drawer.Root defaultOpen>
      <Drawer.Content aria-label="Navigation drawer">
        <Drawer.Title>Drawer Title</Drawer.Title>Drawer content
      </Drawer.Content>
    </Drawer.Root>
  ),
  field: () => (
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <Field.Control>{(controlProps) => <input type="email" {...controlProps()} />}</Field.Control>
    </Field.Root>
  ),
  "input-otp": () => <InputOTP.Root aria-label="Enter verification code" length={6} />,
  label: () => <Label.Root>Username</Label.Root>,
  listbox: () => (
    <Listbox.Root aria-label="Select an option">
      <Listbox.Item value="opt1">Option 1</Listbox.Item>
      <Listbox.Item value="opt2">Option 2</Listbox.Item>
    </Listbox.Root>
  ),
  menu: () => (
    <Menu.Root>
      <Menu.Trigger>Open Menu</Menu.Trigger>
      <Menu.Content aria-label="Actions">
        <Menu.Item>Edit</Menu.Item>
        <Menu.Item>Delete</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
  meter: () => <Meter.Root value={75} min={0} max={100} aria-label="Disk usage" />,
  "navigation-menu": () => (
    <NavigationMenu.Root aria-label="Main navigation" defaultValue="products">
      <NavigationMenu.List>
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/products">Product list</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
  pagination: () => <Pagination.Root totalPages={10} currentPage={1} aria-label="Pagination" />,
  popover: () => (
    <Popover.Root>
      <Popover.Trigger>Info</Popover.Trigger>
      <Popover.Content>Popover content here</Popover.Content>
    </Popover.Root>
  ),
  progress: () => <Progress.Root value={50} aria-label="Loading progress" />,
  "radio-group": () => (
    <RadioGroup.Root aria-label="Favorite color">
      <RadioGroup.Item value="red">Red</RadioGroup.Item>
      <RadioGroup.Item value="blue">Blue</RadioGroup.Item>
    </RadioGroup.Root>
  ),
  "resizable-panels": () => (
    <ResizablePanels.PanelGroup defaultSizes={[50, 50]}>
      <ResizablePanels.Panel order={0}>Panel 1</ResizablePanels.Panel>
      <ResizablePanels.Handle index={0} />
      <ResizablePanels.Panel order={1}>Panel 2</ResizablePanels.Panel>
    </ResizablePanels.PanelGroup>
  ),
  "scroll-area": () => (
    <ScrollArea.Root>
      <ScrollArea.Viewport>Scrollable content</ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical" />
    </ScrollArea.Root>
  ),
  select: () => (
    <Select.Root>
      <Select.Trigger aria-label="Choose option">Select...</Select.Trigger>
      <Select.Content>
        <Select.Item value="a">Option A</Select.Item>
        <Select.Item value="b">Option B</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
  separator: () => <Separator.Root />,
  slider: () => <Slider.Root aria-label="Volume" min={0} max={100} defaultValue={50} />,
  switch: () => <Switch.Root>Enable notifications</Switch.Root>,
  tabs: () => (
    <Tabs.Root defaultValue="tab1">
      <Tabs.List aria-label="Settings">
        <Tabs.Trigger value="tab1">General</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Advanced</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">General settings</Tabs.Content>
      <Tabs.Content value="tab2">Advanced settings</Tabs.Content>
    </Tabs.Root>
  ),
  toast: () => (
    <Toast.Root aria-label="Notification">
      <Toast.Title>Success</Toast.Title>
      <Toast.Description>Your changes have been saved.</Toast.Description>
    </Toast.Root>
  ),
  toggle: () => <Toggle.Root aria-label="Bold">B</Toggle.Root>,
  "toggle-group": () => (
    <ToggleGroup.Root aria-label="Text alignment">
      <ToggleGroup.Item value="left" aria-label="Align left">
        L
      </ToggleGroup.Item>
      <ToggleGroup.Item value="center" aria-label="Align center">
        C
      </ToggleGroup.Item>
      <ToggleGroup.Item value="right" aria-label="Align right">
        R
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
  tooltip: () => (
    <Tooltip.Root>
      <Tooltip.Trigger>Hover me</Tooltip.Trigger>
      <Tooltip.Content>Tooltip text</Tooltip.Content>
    </Tooltip.Root>
  ),
  tree: () => (
    <Tree.Root>
      <Tree.Item id="file-1">File 1</Tree.Item>
      <Tree.Item id="file-2">File 2</Tree.Item>
    </Tree.Root>
  ),
  "virtual-list": () => (
    <VirtualList.Root totalCount={1} itemSize={40} height="40px">
      {(items) =>
        items().map((item) => <VirtualList.Item item={item}>Item {item.index}</VirtualList.Item>)
      }
    </VirtualList.Root>
  ),
  "visually-hidden": () => <VisuallyHidden.Root>Screen reader only text</VisuallyHidden.Root>,
  "alert-dialog": () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Confirm</AlertDialog.Title>
        <AlertDialog.Description>Are you sure?</AlertDialog.Description>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action>Confirm</AlertDialog.Action>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
  avatar: () => (
    <Avatar.Root>
      <Avatar.Image src="https://example.com/avatar.png" alt="User avatar" />
      <Avatar.Fallback>U</Avatar.Fallback>
    </Avatar.Root>
  ),
  breadcrumb: () => (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  ),
  card: () => (
    <Card.Root>
      <Card.Header>
        <Card.Title>Title</Card.Title>
        <Card.Description>Description</Card.Description>
      </Card.Header>
      <Card.Content>Content</Card.Content>
      <Card.Footer>Footer</Card.Footer>
    </Card.Root>
  ),
  "context-menu": () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>Right-click me</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Action</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
  "empty-state": () => (
    <EmptyState.Root>
      <EmptyState.Title>No items</EmptyState.Title>
      <EmptyState.Description>Create your first item.</EmptyState.Description>
    </EmptyState.Root>
  ),
  "hover-card": () => (
    <HoverCard.Root>
      <HoverCard.Trigger>Hover me</HoverCard.Trigger>
      <HoverCard.Content>Card content</HoverCard.Content>
    </HoverCard.Root>
  ),
  input: () => (
    <>
      <Label.Root htmlFor="test-input">Name</Label.Root>
      <Input.Root id="test-input" />
    </>
  ),
  kbd: () => <Kbd.Root>Ctrl+K</Kbd.Root>,
  sheet: () => (
    <Sheet.Root>
      <Sheet.Trigger>Open sheet</Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Title>Sheet title</Sheet.Title>
        <Sheet.Description>Sheet content</Sheet.Description>
        <Sheet.Close>Close</Sheet.Close>
      </Sheet.Content>
    </Sheet.Root>
  ),
  skeleton: () => <Skeleton.Root aria-label="Loading" />,
  spinner: () => <Spinner.Root aria-label="Loading" />,
  toolbar: () => (
    <Toolbar.Root aria-label="Formatting">
      <Toolbar.Button>Bold</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button>Italic</Toolbar.Button>
    </Toolbar.Root>
  ),
}

describe("Primitive axe-core accessibility scans", () => {
  const primitiveNames = Object.keys(PRIMITIVE_FIXTURES).sort()

  it("covers exactly the authoritative 52-entry public surface", () => {
    expect(primitiveNames).toEqual([...PUBLIC_PRIMITIVES].sort())
  })

  for (const name of PUBLIC_PRIMITIVES) {
    it(`@solidiom/${name} has zero axe violations`, async () => {
      const result = await runAxeScan(PRIMITIVE_FIXTURES[name])
      console.info(
        `${AXE_RESULT_PREFIX}${JSON.stringify({
          primitive: name,
          violations: result.violations.length,
          incomplete: result.incomplete.length,
          passes: result.passes,
        })}`,
      )
      expect(result.violations, formatViolations(result.violations)).toHaveLength(0)
    })
  }
})
