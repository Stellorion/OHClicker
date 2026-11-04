// Tailwind class strings that are used in several components.

/** Rounded card used by every settings section. */
export const CARD = "bg-app-surface border border-app-border rounded-xl p-4 pb-3 space-y-3 shadow-sm";

/** Separator that stretches over the card padding. */
export const SEPARATOR = "w-[calc(100%+2rem)] -mx-4";

/** Small outlined button (Import, Export, Pick, ...). */
export const OUTLINE_BUTTON =
  "flex items-center gap-1.5 px-3 py-1.5 bg-app-bg hover:bg-app-border/40 border border-app-border rounded-lg text-xs font-bold text-app-text-primary transition-all disabled:opacity-50";

/** Number input without the browser spin buttons. */
export const NUMBER_INPUT =
  "text-sm font-bold border border-app-border bg-app-bg text-app-text-primary focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-lg py-1.5";
