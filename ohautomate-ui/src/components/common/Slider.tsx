import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "../../lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max];

  return (
    <SliderPrimitive.Root
      className={cn(
        "data-horizontal:w-full data-vertical:h-full cursor-pointer",
        className,
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col py-2">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow h-1.5 w-full overflow-hidden rounded-full bg-app-border select-none"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="absolute left-0 top-0 h-full bg-app-red select-none"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="relative block size-4 shrink-0 rounded-full border-2 border-app-red bg-app-text-primary shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-red select-none after:absolute after:-inset-2"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
