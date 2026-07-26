import * as Slider from "@solidiom/slider"

export function SliderDemo() {
  return (
    <div class="w-64 py-4">
      <Slider.Root defaultValue={[50]} min={0} max={100} step={1}>
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb index={0} aria-label="Volume">
            <span class="block size-5 rounded-full border-2 border-[hsl(var(--primary))] bg-[hsl(var(--background))] shadow" />
          </Slider.Thumb>
        </Slider.Track>
      </Slider.Root>
    </div>
  )
}

export const sliderDemoCode = `import * as Slider from "@solidiom/slider"

function SliderExample() {
  return (
    <Slider.Root defaultValue={[50]} min={0} max={100} step={1}>
      <Slider.Track>
        <Slider.Range />
        <Slider.Thumb index={0} aria-label="Volume" />
      </Slider.Track>
    </Slider.Root>
  )
}`
