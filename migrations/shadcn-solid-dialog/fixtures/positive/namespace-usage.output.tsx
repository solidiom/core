import { Root, Trigger, Portal, Backdrop, Content, Title, Description, Close } from "@solidiom/dialog"

export function MyDialog() {
  return (
    <Root>
      <Trigger>Open</Trigger>
      <Portal>
        <Backdrop class="backdrop" />
        <Content>
          <Title>Hello</Title>
          <Description>World</Description>
          <Close>X</Close>
        </Content>
      </Portal>
    </Root>
  )
}
