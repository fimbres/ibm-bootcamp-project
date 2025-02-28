import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(fullName?: string): string | undefined {
  return !fullName
    ? undefined
    : fullName
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0]!.toUpperCase())
        .join("");
}
