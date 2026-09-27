import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function CarouselPage() {
  return (
    <div className="w-full max-w-2xl px-12 py-4">
      <Carousel>
        <CarouselContent>
          {Array.from({ length: 4 }, (_, i) => (
            <CarouselItem key={i} className="pl-4">
              <div className="flex h-64 items-center justify-center rounded-md border bg-muted text-xl">
                Slide {i + 1}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
