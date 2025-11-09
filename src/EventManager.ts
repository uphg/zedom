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

  /**
   * 绑定事件监听器
   * @param element 目标元素
   * @param event 事件类型
   * @param handler 事件处理函数
   * @returns 取消监听的函数
   */
  on(el: EventElement, eventName: string, handler: EventHandler, options?: EventOptions): Unsubscribe {
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
    const delegateHandler: EventHandler = (e) => {
      let target: Element | null = e.target as Element
      // 检查是否匹配选择器
      while (target?.matches(selector)) {
        if (container === target) {
          target = null
          break
        }
        target = target?.parentNode as Element
      }
      target && handler.call(target, e)
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
    // 移除普通事件
    const elEvents = this.events.get(el)
    if (elEvents && elEvents.has(eventName)) {
      const handlers = elEvents.get(eventName)!

      if (handler) {
        // 移除特定 handler
        const index = handlers.findIndex(item => item.handler === handler || item.rawHandler === handler)
        if (index > -1) {
          const removed = handlers.splice(index, 1)[0]
          el.removeEventListener(eventName, removed.handler, options)
        }
      } else {
        // 移除所有该事件的 handler
        handlers.forEach((data) => {
          el.removeEventListener(eventName, data.handler, options)
        })
        elEvents.delete(eventName)
      }
    }
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
