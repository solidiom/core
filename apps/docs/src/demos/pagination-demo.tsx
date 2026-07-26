import * as Pagination from "@solidiom/pagination"

export function PaginationDemo() {
  return (
    <Pagination.Root class="flex justify-center">
      <Pagination.Content class="flex items-center gap-1 list-none">
        <Pagination.Item>
          <Pagination.PreviousButton class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[hsl(var(--input))] bg-transparent text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] disabled:opacity-50">
            &lt;
          </Pagination.PreviousButton>
        </Pagination.Item>
        <Pagination.Item>
          <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--primary))] text-sm text-[hsl(var(--primary-foreground))]">
            1
          </button>
        </Pagination.Item>
        <Pagination.Item>
          <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[hsl(var(--input))] bg-transparent text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">
            2
          </button>
        </Pagination.Item>
        <Pagination.Item>
          <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[hsl(var(--input))] bg-transparent text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">
            3
          </button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Ellipsis class="inline-flex h-9 w-9 items-center justify-center text-sm text-[hsl(var(--muted-foreground))]" />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.NextButton class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[hsl(var(--input))] bg-transparent text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] disabled:opacity-50">
            &gt;
          </Pagination.NextButton>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination.Root>
  )
}

export const paginationDemoCode = `import * as Pagination from "@solidiom/pagination"

function PaginationExample() {
  return (
    <Pagination.Root>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.PreviousButton>&lt;</Pagination.PreviousButton>
        </Pagination.Item>
        <Pagination.Item><button>1</button></Pagination.Item>
        <Pagination.Item><button>2</button></Pagination.Item>
        <Pagination.Item><button>3</button></Pagination.Item>
        <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
        <Pagination.Item>
          <Pagination.NextButton>&gt;</Pagination.NextButton>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination.Root>
  )
}`
