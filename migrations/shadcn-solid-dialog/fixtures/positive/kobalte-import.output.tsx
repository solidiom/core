import { Root, Trigger, Portal, Backdrop, Content, Title, Description, Close } from "@solidiom/dialog"

export function KobalteDialog() {
  return (
    <Root>
      <Trigger>Open</Trigger>
      <Portal>
        <Backdrop />
        <Content>
          <Title>From Kobalte</Title>
          <Close>X</Close>
        </Content>
      </Portal>
    </Root>
  )
}
