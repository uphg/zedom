export function forEachEntry<T extends object>(
  obj: T,
  fn: (key: keyof T, value: T[keyof T]) => void
): void {
  for (const key of Object.keys(obj)) {
    fn(key as keyof T, obj[key as keyof T])
  }
}
