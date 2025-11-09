/**
 * 查找匹配指定选择器或目标元素的父级元素
 * @param el 起始元素
 * @param selector CSS选择器字符串或目标元素
 * @returns 匹配的父级元素，未找到时返回 null
 */
export function getParentNode<T extends Element = Element>(
  el: Element,
  selector: string | Element
): T | null {
  if (!el || !el.parentElement) {
    return null
  }

  let parent: Element | null = el.parentElement

  if (selector instanceof Element) {
    // 当 selector 是元素时，查找直到找到该元素
    while (parent && parent !== selector) {
      parent = parent.parentElement
    }
  } else {
    // 当 selector 是选择器字符串时，使用 matches 方法匹配
    while (parent && !parent.matches(selector)) {
      parent = parent.parentElement
    }
  }

  return parent as T | null
}
