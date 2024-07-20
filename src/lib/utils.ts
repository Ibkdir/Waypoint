import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRandomIndexes = (arrayLength: number, count: number): number[] => {
  const indexes = new Set<number>();
  while (indexes.size < count) {
      const randomIndex = Math.floor(Math.random() * arrayLength);
      indexes.add(randomIndex);
  }
  return Array.from(indexes);
};
