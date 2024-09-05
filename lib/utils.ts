export const tryParseJSON = (jsonString: string | null) => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
