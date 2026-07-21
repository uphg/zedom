// 事件类型定义
export interface EventOptions extends AddEventListenerOptions { }

export type EventHandler = (event: Event) => void
export type Unsubscribe = () => void
export type EventElement = Element | Window | Document | HTMLElement | SVGElement

// 事件数据存储
interface EventData {
  handler: EventHandler
  rawHandler?: EventHandler // 用于 once 包装
  options?: EventOptions
}

export class EventManager {
  private events: WeakMap<EventElement, Map<string, EventData[]>> = new WeakMap()
  private delegateEvents: WeakMap<EventElement, Map<string, EventData[]>> = new WeakMap()

  constructor() {
    this.on = this.on.bind(this)
    this.once = this.once.bind(this)
    this.off = this.off.bind(this)
    this.delegate = this.delegate.bind(this)
    this.emit = this.emit.bind(this)
    this.clear = this.clear.bind(this)
  }

  /**
   * 绑定事件监听器
   * @param element 目标元素
   * @param event 事件类型
   * @param handler 事件处理函数
   * @returns 取消监听的函数
   */
  on(el: EventElement, eventName: string, handler: EventHandler, options?: EventOptions): Unsubscribe {
    if (!el || !eventName || typeof handler !== 'function') return () => {}
    const { events } = this
    // 存储事件数据
    if (!events.has(el as Element)) {
      events.set(el as Element, new Map())
    }

    const elEvents = this.events.get(el as Element)!
    if (!elEvents.has(eventName)) {
      elEvents.set(eventName, [])
    }

    const eventData: EventData = { handler, options }
    elEvents.get(eventName)!.push(eventData)

    el.addEventListener(eventName, handler, options)

    // 返回取消函数
    return () => {
      this.off(el, eventName, handler)
    }
  }

  /**
   * 绑定一次性事件监听器
   * @param element 目标元素
   * @param event 事件类型
   * @param handler 事件处理函数
   * @returns 取消监听的函数
   */
  once(el: EventElement, eventName: string, handler: EventHandler, options?: EventOptions): Unsubscribe {
    if (!el || !eventName || typeof handler !== 'function') return () => {}
    const { events } = this
    const onceHandler: EventHandler = (event) => {
      handler(event)
      this.off(el, event.type, onceHandler)
    }

    // 存储原始 handler 用于后续清理
    const eventData: EventData = {
      handler: onceHandler,
      rawHandler: handler,
      options
    }

    if (!events.has(el)) {
      events.set(el, new Map())
    }

    const elEvents = this.events.get(el as Element)!
    if (!elEvents.has(eventName)) {
      elEvents.set(eventName, [])
    }

    elEvents.get(eventName)!.push(eventData)
    el.addEventListener(eventName, onceHandler, options)

    return () => {
      this.off(el, eventName, onceHandler)
    }
  }

  /**
   * 事件委托
   * @param container 容器元素
   * @param event 事件类型
   * @param selector 目标元素选择器
   * @param handler 事件处理函数
   * @returns 取消监听的函数
   */
  delegate(container: EventElement, eventName: string, selector: string, handler: EventHandler, options?: EventOptions): Unsubscribe {
    if (!container || !eventName || !selector || typeof handler !== 'function') return () => {}
    const delegateHandler: EventHandler = (e) => {
      let target: Element | null = e.target as Element
      while (target && target !== container) {
        if (target.matches(selector)) {
          handler.call(target, e)
          return
        }
        target = target.parentNode as Element
      }
    }
    const dgEvents = this.delegateEvents
    // 存储委托事件数据
    if (!dgEvents.has(container)) {
      dgEvents.set(container, new Map())
    }

    const ctrEvents = dgEvents.get(container)!
    if (!ctrEvents.has(eventName)) {
      ctrEvents.set(eventName, [])
    }

    const eventData: EventData = {
      handler: delegateHandler,
      rawHandler: handler,
      options
    }
    ctrEvents.get(eventName)!.push(eventData)

    // 绑定委托事件
    container.addEventListener(eventName, delegateHandler, options)

    return () => {
      this.off(container, eventName, delegateHandler)
    }
  }

  /**
   * 移除事件监听器
   * @param el 目标元素
   * @param event 事件类型
   * @param handler 事件处理函数（可选）
   */
  off(el: EventElement, eventName: string, handler?: EventHandler, options?: EventListenerOptions): void {
    if (!el) return
    const removeFromMap = (eventMap: WeakMap<EventElement, Map<string, EventData[]>>) => {
      const elEvents = eventMap.get(el)
      if (elEvents && elEvents.has(eventName)) {
        const handlers = elEvents.get(eventName)!

        if (handler) {
          const index = handlers.findIndex(item => item.handler === handler || item.rawHandler === handler)
          if (index > -1) {
            const removed = handlers.splice(index, 1)[0]
            el.removeEventListener(eventName, removed.handler, options)
          }
        } else {
          handlers.forEach((data) => {
            el.removeEventListener(eventName, data.handler, options)
          })
          elEvents.delete(eventName)
        }
      }
    }
    removeFromMap(this.events)
    removeFromMap(this.delegateEvents)
  }

  /**
   * 触发自定义事件
   * @param element 目标元素
   * @param event 事件类型
   * @param detail 事件数据
   */
  emit<T = any>(el: Element | Window | Document, eventName: string, detail?: T, options?: Omit<CustomEventInit, 'detail'>): void {
    const customEvent = new CustomEvent(eventName, { detail, bubbles: true, cancelable: true, ...options })
    el.dispatchEvent(customEvent)
  }

  /**
   * 移除元素的所有事件监听器
   * @param el 目标元素
   */
  clear(el: EventElement): void {
    // 清理普通事件
    const evts = this.events
    const elEvts = evts.get(el)
    if (elEvts) {
      elEvts.forEach((handlers, eventKey) => {
        const [event] = eventKey.split('.')
        handlers.forEach((data) => {
          el.removeEventListener(event, data.handler, data.options)
        })
      })
      evts.delete(el)
    }

    // 清理委托事件
    const dgEvents = this.delegateEvents
    const dgEvt = dgEvents.get(el)
    if (dgEvt) {
      dgEvt.forEach((handlers, eventKey) => {
        const [event] = eventKey.split('.')
        handlers.forEach((data) => {
          el.removeEventListener(event, data.handler, data.options)
        })
      })
      dgEvents.delete(el)
    }
  }
}
