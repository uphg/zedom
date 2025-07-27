import camelize from "./internal/camelize";

function getStyle(el: HTMLElement, styleName: string) {
  if (!el || !styleName) return null
  styleName = camelize(styleName)
  return el['style'][styleName as unknown as number]
}

export default getStyle
