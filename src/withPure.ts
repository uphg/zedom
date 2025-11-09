import { forEachEntry } from 'unfunt'

export function withPure<T extends object>(data?: T): T extends undefined ? {} : { [K in keyof T]: T[K] } {
  const result = Object.create(null) as { [K in keyof T]: T[K] }

  if (data) {
    forEachEntry(data, (key, value) => {
      result[key as keyof T] = value as T[keyof T]
    })
  }

  return result as T extends undefined ? {} : { [K in keyof T]: T[K] }
}
