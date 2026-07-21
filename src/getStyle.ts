import { camelize } from './internal/camelize'

export function getStyle(el: HTMLElement, styleName: string) {
  if (!el || !styleName) return null
  styleName = camelize(styleName)
  return (el.style as unknown as Record<string, string>)[styleName]
}
