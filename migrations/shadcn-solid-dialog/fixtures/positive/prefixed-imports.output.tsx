import { Root, Trigger, Content, Backdrop, Title, Description, Close, Portal } from "@solidiom/dialog"

export function ConfirmDialog() {
  return (
    <Root>
      <Trigger>Delete</Trigger>
      <Portal>
        <Backdrop />
        <Content>
          <Title>Are you sure?</Title>
          <Description>This action cannot be undone.</Description>
          <Close>Cancel</Close>
        </Content>
      </Portal>
    </Root>
  )
}
