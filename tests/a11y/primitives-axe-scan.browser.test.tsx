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
import * as AppShell from "@solidiom/app-shell"
import * as AspectRatio from "@solidiom/aspect-ratio"
import * as Attachment from "@solidiom/attachment"
import * as AvatarGroup from "@solidiom/avatar-group"
import * as Banner from "@solidiom/banner"
import * as Chart from "@solidiom/chart"
import * as ChatComposer from "@solidiom/chat-composer"
import * as ChatLayout from "@solidiom/chat-layout"
import * as ChatMessage from "@solidiom/chat-message"
import * as ChatMessageMetadata from "@solidiom/chat-message-metadata"
import * as ChatSystemMessage from "@solidiom/chat-system-message"
import * as ChatToolCalls from "@solidiom/chat-tool-calls"
import * as CodeBlock from "@solidiom/code-block"
import * as DateRangeInput from "@solidiom/date-range-input"
import * as Direction from "@solidiom/direction"
import * as FileInput from "@solidiom/file-input"
import * as Grid from "@solidiom/grid"
import * as InputGroup from "@solidiom/input-group"
import * as Lightbox from "@solidiom/lightbox"
import * as Link from "@solidiom/link"
import * as MegaMenu from "@solidiom/mega-menu"
import * as Menubar from "@solidiom/menubar"
import * as MessageScroller from "@solidiom/message-scroller"
import * as MultiSelector from "@solidiom/multi-selector"
import * as NumberInput from "@solidiom/number-input"
import * as Questionnaire from "@solidiom/questionnaire"
import * as SegmentedControl from "@solidiom/segmented-control"
import * as Sidebar from "@solidiom/sidebar"
import * as Stack from "@solidiom/stack"
import * as StatusDot from "@solidiom/status-dot"
import * as Table from "@solidiom/table"
import * as TimeInput from "@solidiom/time-input"
import * as Tokenizer from "@solidiom/tokenizer"
import * as Typography from "@solidiom/typography"
import {
  AXE_RESULT_PREFIX,
  createAxeScanResult,
  PUBLIC_PRIMITIVES,
  type PublicPrimitive,
} from "../../tools/axe-results"
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
    <div>
      <button type="button">Open</button>
      <CommandPalette.Root aria-label="Command palette">
        <CommandPalette.Input placeholder="Type a command..." />
        <CommandPalette.List>
          <CommandPalette.Item value="action">Action</CommandPalette.Item>
        </CommandPalette.List>
      </CommandPalette.Root>
    </div>
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
  "date-picker": () => (
    <div>
      <label for="dp">Date</label>
      <DatePicker.Root aria-label="Select a date" />
    </div>
  ),
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
  "visually-hidden": () => (
    <button type="button">
      <VisuallyHidden.Root>Close dialog</VisuallyHidden.Root>
      <span aria-hidden="true">×</span>
    </button>
  ),
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
  "app-shell": () => (
    <AppShell.Root>
      <AppShell.Header>
        <h1>My Application</h1>
      </AppShell.Header>
      <AppShell.Sidebar>
        <nav aria-label="Sections">
          <a href="/home">Home</a>
        </nav>
      </AppShell.Sidebar>
      <AppShell.Main>
        <h2>Dashboard</h2>
        <p>Main content region.</p>
      </AppShell.Main>
      <AppShell.Footer>
        <p>© 2026 Example Inc.</p>
      </AppShell.Footer>
    </AppShell.Root>
  ),
  "aspect-ratio": () => (
    <AspectRatio.Root ratio={16 / 9}>
      <img src="https://example.com/photo.png" alt="Scenic landscape" />
    </AspectRatio.Root>
  ),
  attachment: () => (
    <Attachment.Root file={{ name: "report.pdf", size: 20480, type: "application/pdf" }}>
      <Attachment.Icon>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <rect width="16" height="16" />
        </svg>
      </Attachment.Icon>
      <Attachment.Name />
      <Attachment.Size />
      <Attachment.Remove />
    </Attachment.Root>
  ),
  "avatar-group": () => (
    <AvatarGroup.Root max={2}>
      <img src="https://example.com/a.png" alt="Alice Chen" width="32" height="32" />
      <img src="https://example.com/b.png" alt="Bob Diaz" width="32" height="32" />
      <img src="https://example.com/c.png" alt="Carla Wu" width="32" height="32" />
    </AvatarGroup.Root>
  ),
  banner: () => (
    <Banner.Root variant="info" dismissible defaultOpen>
      <Banner.Content>Your trial ends in 3 days.</Banner.Content>
      <Banner.Close />
    </Banner.Root>
  ),
  chart: () => (
    <Chart.Root
      type="bar"
      data={[
        { label: "Jan", value: 30 },
        { label: "Feb", value: 45 },
      ]}
    >
      <Chart.Title>Monthly revenue</Chart.Title>
      <Chart.Description>Revenue by month in thousands of dollars.</Chart.Description>
      <Chart.Canvas />
      <Chart.FallbackTable />
    </Chart.Root>
  ),
  "chat-composer": () => (
    <ChatComposer.Root placeholder="Type a message">
      <ChatComposer.Input />
      <ChatComposer.AttachButton>Attach file</ChatComposer.AttachButton>
      <ChatComposer.SendButton>Send</ChatComposer.SendButton>
    </ChatComposer.Root>
  ),
  "chat-layout": () => (
    <ChatLayout.Root>
      <ChatLayout.Header>
        <h2>Support chat</h2>
      </ChatLayout.Header>
      <ChatLayout.MessageList>
        <div role="listitem">Hello, how can I help?</div>
      </ChatLayout.MessageList>
      <ChatLayout.Composer>
        <label for="cl-input">Message</label>
        <input id="cl-input" type="text" />
      </ChatLayout.Composer>
    </ChatLayout.Root>
  ),
  "chat-message": () => (
    <div role="list">
      <ChatMessage.Root variant="received">
        <ChatMessage.Avatar>
          <img src="https://example.com/agent.png" alt="Support agent" width="32" height="32" />
        </ChatMessage.Avatar>
        <ChatMessage.Content>Thanks for reaching out!</ChatMessage.Content>
        <ChatMessage.Actions>
          <button type="button" aria-label="Copy message">
            Copy
          </button>
        </ChatMessage.Actions>
      </ChatMessage.Root>
    </div>
  ),
  "chat-message-metadata": () => (
    <ChatMessageMetadata.Root>
      <ChatMessageMetadata.Sender sender="Alice" />
      <ChatMessageMetadata.Timestamp timestamp="2026-09-04T10:15:00Z" />
      <ChatMessageMetadata.Status status="delivered" />
    </ChatMessageMetadata.Root>
  ),
  "chat-system-message": () => (
    <ChatSystemMessage.Root type="info">
      <ChatSystemMessage.Icon>
        <span aria-hidden="true">ℹ️</span>
      </ChatSystemMessage.Icon>
      <ChatSystemMessage.Content>Alice joined the channel</ChatSystemMessage.Content>
      <ChatSystemMessage.Timestamp timestamp="2026-09-04T10:15:00Z" />
    </ChatSystemMessage.Root>
  ),
  "chat-tool-calls": () => (
    <ChatToolCalls.Root>
      <ChatToolCalls.ToolCall name="search" status="success" input="{}" output="ok">
        <ChatToolCalls.ToolName />
        <ChatToolCalls.ToolStatus />
        <ChatToolCalls.ToolInput content="{}" />
        <ChatToolCalls.ToolOutput content="ok" />
      </ChatToolCalls.ToolCall>
    </ChatToolCalls.Root>
  ),
  "code-block": () => (
    <CodeBlock.Root code="const x = 1" language="ts">
      <CodeBlock.Header>
        <CodeBlock.Language language="ts" />
        <CodeBlock.CopyButton code="const x = 1" />
      </CodeBlock.Header>
      <CodeBlock.Pre>
        <CodeBlock.LineNumbers code="const x = 1" />
        <CodeBlock.Code language="ts">const x = 1</CodeBlock.Code>
      </CodeBlock.Pre>
    </CodeBlock.Root>
  ),
  "date-range-input": () => (
    <DateRangeInput.Root defaultStartDate="2026-09-01" defaultEndDate="2026-09-30">
      <DateRangeInput.StartInput />
      <DateRangeInput.Separator />
      <DateRangeInput.EndInput />
      <DateRangeInput.Trigger aria-label="Open calendar">📅</DateRangeInput.Trigger>
    </DateRangeInput.Root>
  ),
  direction: () => (
    <Direction.Root direction="rtl">
      <p>مرحبا</p>
    </Direction.Root>
  ),
  "file-input": () => (
    <FileInput.Root name="attachments" accept={["image/*"]} multiple>
      <FileInput.Trigger>Upload files</FileInput.Trigger>
      <FileInput.HiddenInput />
      <FileInput.FileList />
    </FileInput.Root>
  ),
  grid: () => (
    <Grid.Root columns={2} gap={8}>
      <Grid.Item>Cell 1</Grid.Item>
      <Grid.Item>Cell 2</Grid.Item>
    </Grid.Root>
  ),
  "input-group": () => (
    <>
      <label for="ig-amount">Amount</label>
      <InputGroup.Root>
        <InputGroup.Prefix>$</InputGroup.Prefix>
        <InputGroup.Input id="ig-amount" type="number" placeholder="0.00" />
        <InputGroup.Suffix>USD</InputGroup.Suffix>
      </InputGroup.Root>
    </>
  ),
  lightbox: () => (
    <Lightbox.Root defaultOpen items={[{ src: "https://example.com/a.png", alt: "First image" }]}>
      <Lightbox.Backdrop />
      <Lightbox.Content>
        <Lightbox.CloseButton />
        <Lightbox.PrevButton />
        <Lightbox.Image />
        <Lightbox.NextButton />
        <Lightbox.Counter />
      </Lightbox.Content>
    </Lightbox.Root>
  ),
  link: () => <Link.Root href="https://example.com">Visit example</Link.Root>,
  "mega-menu": () => (
    <nav aria-label="Main navigation">
      <MegaMenu.Root defaultValue="products">
        <MegaMenu.List>
          <MegaMenu.Item value="products">
            <MegaMenu.Trigger>Products</MegaMenu.Trigger>
            <MegaMenu.Content>
              <MegaMenu.Group>
                <MegaMenu.GroupLabel>Catalog</MegaMenu.GroupLabel>
                <MegaMenu.Link href="/products/all">All products</MegaMenu.Link>
              </MegaMenu.Group>
            </MegaMenu.Content>
          </MegaMenu.Item>
        </MegaMenu.List>
      </MegaMenu.Root>
    </nav>
  ),
  menubar: () => (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>New</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item>Open</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  ),
  "message-scroller": () => (
    <MessageScroller.Root>
      <MessageScroller.ScrollArea>
        <p>Message one</p>
        <p>Message two</p>
      </MessageScroller.ScrollArea>
      <MessageScroller.NewContentIndicator />
    </MessageScroller.Root>
  ),
  "multi-selector": () => (
    <MultiSelector.Root defaultOpen defaultValue={["apple"]} placeholder="Select fruits">
      <MultiSelector.Trigger aria-label="Fruits">Fruits</MultiSelector.Trigger>
      <MultiSelector.TagList>
        <MultiSelector.Tag value="apple">
          Apple
          <MultiSelector.TagRemove>×</MultiSelector.TagRemove>
        </MultiSelector.Tag>
      </MultiSelector.TagList>
      <MultiSelector.Content>
        <MultiSelector.Item value="apple">
          Apple
          <MultiSelector.ItemIndicator>✓</MultiSelector.ItemIndicator>
        </MultiSelector.Item>
        <MultiSelector.Item value="banana">
          Banana
          <MultiSelector.ItemIndicator>✓</MultiSelector.ItemIndicator>
        </MultiSelector.Item>
      </MultiSelector.Content>
    </MultiSelector.Root>
  ),
  "number-input": () => (
    <>
      <label for="qty">Quantity</label>
      <NumberInput.Root id="qty" defaultValue={1} min={0} max={10} step={1}>
        <NumberInput.DecrementButton>−</NumberInput.DecrementButton>
        <NumberInput.Input />
        <NumberInput.IncrementButton>+</NumberInput.IncrementButton>
      </NumberInput.Root>
    </>
  ),
  questionnaire: () => (
    <Questionnaire.Root steps={2} defaultStep={0}>
      <Questionnaire.Progress />
      <Questionnaire.Step index={0}>
        <Questionnaire.StepTitle>Your details</Questionnaire.StepTitle>
        <Questionnaire.StepContent>
          <label for="q-name">Name</label>
          <input id="q-name" type="text" />
        </Questionnaire.StepContent>
      </Questionnaire.Step>
      <Questionnaire.Step index={1}>
        <Questionnaire.StepTitle>Confirm</Questionnaire.StepTitle>
        <Questionnaire.StepContent>Review and submit.</Questionnaire.StepContent>
      </Questionnaire.Step>
      <Questionnaire.Navigation>
        <Questionnaire.PrevButton />
        <Questionnaire.NextButton />
        <Questionnaire.Submit />
      </Questionnaire.Navigation>
    </Questionnaire.Root>
  ),
  "segmented-control": () => (
    <SegmentedControl.Root defaultValue="list" aria-label="View mode">
      <SegmentedControl.Item value="list">List</SegmentedControl.Item>
      <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
      <SegmentedControl.Indicator />
    </SegmentedControl.Root>
  ),
  sidebar: () => (
    <Sidebar.Root defaultOpen>
      <Sidebar.Trigger>Toggle sidebar</Sidebar.Trigger>
      <Sidebar.Panel aria-label="Main navigation">
        <Sidebar.Header>App</Sidebar.Header>
        <Sidebar.Content>
          <a href="/home">Home</a>
        </Sidebar.Content>
        <Sidebar.Footer>Footer</Sidebar.Footer>
      </Sidebar.Panel>
    </Sidebar.Root>
  ),
  stack: () => (
    <Stack.Root gap="1rem">
      <div>First</div>
      <div>Second</div>
    </Stack.Root>
  ),
  "status-dot": () => <StatusDot.Root label="Online" status="online" />,
  table: () => (
    <Table.Root>
      <Table.Caption>Team members</Table.Caption>
      <Table.Header>
        <Table.HeaderRow>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Role</Table.HeaderCell>
        </Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Ada</Table.Cell>
          <Table.Cell>Engineer</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
  "time-input": () => (
    <div>
      <span id="ti-label">Appointment time</span>
      <TimeInput.Root aria-labelledby="ti-label" hourCycle="12">
        <TimeInput.Segment type="hour" />
        <TimeInput.Separator />
        <TimeInput.Segment type="minute" />
        <TimeInput.Segment type="period" />
      </TimeInput.Root>
    </div>
  ),
  tokenizer: () => (
    <div>
      <label id="tk-label">Tags</label>
      <Tokenizer.Root aria-labelledby="tk-label" defaultValue={["design"]}>
        <Tokenizer.Token value="design" index={0}>
          design
          <Tokenizer.TokenRemove />
        </Tokenizer.Token>
        <label>
          Add a tag
          <Tokenizer.Input placeholder="Add a tag" />
        </label>
      </Tokenizer.Root>
    </div>
  ),
  typography: () => (
    <>
      <Typography.Heading level={2}>Heading</Typography.Heading>
      <Typography.Lead>Lead paragraph.</Typography.Lead>
      <Typography.Text>
        Body text with <Typography.InlineCode>code</Typography.InlineCode>.
      </Typography.Text>
      <Typography.Blockquote>Quote</Typography.Blockquote>
      <Typography.Small>Small</Typography.Small>
      <Typography.Muted>Muted</Typography.Muted>
    </>
  ),
}

describe("Primitive axe-core accessibility scans", () => {
  const primitiveNames = Object.keys(PRIMITIVE_FIXTURES).sort()

  it("covers exactly the authoritative 86-entry public surface", () => {
    expect(primitiveNames).toEqual([...PUBLIC_PRIMITIVES].sort())
  })

  for (const name of PUBLIC_PRIMITIVES) {
    it(`@solidiom/${name} has zero axe violations`, async () => {
      const result = await runAxeScan(PRIMITIVE_FIXTURES[name])
      console.info(
        `${AXE_RESULT_PREFIX}${JSON.stringify(
          createAxeScanResult({
            primitive: name,
            violations: result.violations.length,
            incomplete: result.incomplete.length,
            passes: result.passes,
          }),
        )}`,
      )
      expect(result.violations, formatViolations(result.violations)).toHaveLength(0)
    })
  }
})
