import * as Carousel from "@solidiom/carousel"
import { For } from "solid-js"

const slides = [
  { title: "Slide 1", color: "hsl(var(--primary))" },
  { title: "Slide 2", color: "hsl(var(--accent))" },
  { title: "Slide 3", color: "hsl(var(--muted))" },
  { title: "Slide 4", color: "hsl(var(--primary))" },
  { title: "Slide 5", color: "hsl(var(--accent))" },
]

export function CarouselDemo() {
  return (
    <div class="w-full max-w-[600px]">
      <Carousel.Root
        geometry={{ slideCount: 5, slideWidth: 280, gap: 16, containerWidth: 600 }}
        loop
      >
        <div class="relative">
          <Carousel.Viewport>
            <div class="flex gap-4 overflow-hidden">
              <For each={slides}>
                {(slide, i) => (
                  <Carousel.Slide index={i()}>
                    <div
                      class="flex h-48 w-[280px] shrink-0 items-center justify-center rounded-lg border border-[hsl(var(--border))]"
                      style={{ "background-color": slide.color }}
                    >
                      <span class="text-lg font-semibold text-[hsl(var(--foreground))]">
                        {slide.title}
                      </span>
                    </div>
                  </Carousel.Slide>
                )}
              </For>
            </div>
          </Carousel.Viewport>
          <div class="mt-4 flex justify-center gap-2">
            <Carousel.PrevButton>
              <span class="inline-flex size-9 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
                <ChevronLeftIcon />
              </span>
            </Carousel.PrevButton>
            <Carousel.NextButton>
              <span class="inline-flex size-9 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
                <ChevronRightIcon />
              </span>
            </Carousel.NextButton>
          </div>
        </div>
      </Carousel.Root>
    </div>
  )
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-4"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-4"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export const carouselDemoCode = `import * as Carousel from "@solidiom/carousel"
import { For } from "solid-js"

function CarouselExample() {
  const slides = ["Slide 1", "Slide 2", "Slide 3", "Slide 4", "Slide 5"]

  return (
    <Carousel.Root
      geometry={{ slideCount: 5, slideWidth: 280, gap: 16, containerWidth: 600 }}
      loop
    >
      <Carousel.Viewport>
        <For each={slides}>
          {(slide, i) => (
            <Carousel.Slide index={i()}>{slide}</Carousel.Slide>
          )}
        </For>
      </Carousel.Viewport>
      <Carousel.PrevButton>←</Carousel.PrevButton>
      <Carousel.NextButton>→</Carousel.NextButton>
    </Carousel.Root>
  )
}`
