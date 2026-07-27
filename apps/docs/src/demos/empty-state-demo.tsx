import * as EmptyState from "@solidiom/empty-state"

export function EmptyStateDemo() {
  return (
    <EmptyState.Root>
      <EmptyState.Title>No items found</EmptyState.Title>
      <EmptyState.Description>Try adjusting your search or filters.</EmptyState.Description>
      <EmptyState.Action>Create new item</EmptyState.Action>
    </EmptyState.Root>
  )
}

export const emptyStateDemoCode = `import * as EmptyState from "@solidiom/empty-state"

function EmptyStateExample() {
  return (
    <EmptyState.Root>
      <EmptyState.Title>No items found</EmptyState.Title>
      <EmptyState.Description>Try adjusting your search or filters.</EmptyState.Description>
      <EmptyState.Action>Create new item</EmptyState.Action>
    </EmptyState.Root>
  )
}`
