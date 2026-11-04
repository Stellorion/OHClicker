// Small shared helpers.
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Joins class names and resolves Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Converts `v` out of `total` to a CSS percentage string. */
export const pct = (v: number, total: number) => `${(v / total) * 100}%`;