export function camelize(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}
