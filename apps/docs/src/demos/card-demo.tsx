import * as Card from "@solidiom/card"

export function CardDemo() {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
        <Card.Description>Card description goes here.</Card.Description>
      </Card.Header>
      <Card.Content>Card content</Card.Content>
      <Card.Footer>Card footer</Card.Footer>
    </Card.Root>
  )
}

export const cardDemoCode = `import * as Card from "@solidiom/card"

function CardExample() {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
        <Card.Description>Card description goes here.</Card.Description>
      </Card.Header>
      <Card.Content>Card content</Card.Content>
      <Card.Footer>Card footer</Card.Footer>
    </Card.Root>
  )
}`
