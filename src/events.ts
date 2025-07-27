const delegateHandler = Symbol('delegateHandler')

type EventHandler<T, K extends keyof ElementEventMap> = (this: T, ev: ElementEventMap[K]) => unknown

type EventDelegOptions = boolean | EventListenerOptions | undefined

interface EventDelegHandler<T, K extends keyof ElementEventMap> {
  (this: T, ev: ElementEventMap[K]): unknown
  [delegateHandler]?: EventListenerOrEventListenerObject
}

export function on<T extends Element, K extends keyof ElementEventMap>(
  el: T | null,
  eventName: string,
  selector: string | EventHandler<T, K>,
  handler?: EventHandler<T, K> | EventDelegOptions,
  options?: EventDelegOptions
) {
  if (!el || !eventName || !selector) return

  if (isFunction(selector)) {
    el.addEventListener(eventName, selector, handler as EventDelegOptions)
  } else if (isFunction(handler)) {
    const listener = (event: Event) => {
      let { target } = event
      while (!(target as Element)?.matches(selector)) {
        if (el === target) {
          target = null
          break
        }
        target = (target as Element)?.parentNode
      }
      target && handler.call(target as T, event)
    }
    (handler as EventDelegHandler<T, K>)[delegateHandler] = listener
    el.addEventListener(eventName, listener, options)
  }

  return el
}

export function off<T extends Element, K extends keyof ElementEventMap>(
  el: T | null,
  eventName: string,
  handler: EventHandler<T, K>,
  options?: EventDelegOptions
) {
  if (!el || !eventName || !handler) return

  el.removeEventListener(eventName, handler, options)
  const deleg = (handler as EventDelegHandler<T, K>)?.[delegateHandler]
  deleg && el.removeEventListener(eventName, deleg, options)

  return el
}

function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}
