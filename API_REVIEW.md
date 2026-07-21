# zedom API 评估报告

> 评估日期：2026-07-21
> 评估背景：2026 年的浏览器原生 API 已高度成熟，ES2025 已将大量过去需要库辅助的能力标准化。
> 评估原则：不以"代码行数"判断价值，而以**"解决原生 API 力所不及的问题"**为标准。

---

## 目录

- [完整 API 一览](#完整-api-一览)
- [A 类：保留（必要性高）](#a-类保留必要性高)
- [B 类：保留但需改进](#b-类保留但需改进)
- [C 类：建议删除（必要性低）](#c-类建议删除必要性低)
- [内部函数评估](#内部函数评估)
- [缺失功能建议](#缺失功能建议)
- [总结](#总结)

---

## 完整 API 一览

| 公开函数 | 文件 | 状态 | 分类 |
|---------|------|------|------|
| `EventManager` (on/off/once/delegate/emit/clear) | `EventManager.ts` | ✅ A 类 | 事件管理 |
| `getScrollParent` | `getScrollParent.ts` | ✅ A 类 | 滚动 |
| `getScrollbarWidth` | `getScrollbarWidth.ts` | ✅ A 类 | 滚动 |
| `getParentNode` | `getParentNode.ts` | ✅ A 类 | DOM 遍历 |
| `getStyle` | `getStyle.ts` | 🟡 B 类 | 样式操作 |
| `setStyle` | `setStyle.ts` | 🟡 B 类 | 样式操作 |
| `toElement` | `toElement.ts` | 🟡 B 类 | 元素创建 |
| `getIndex` | `getIndex.ts` | 🟡 B 类 | DOM 遍历 |
| `$all` | `all.ts` | 🔴 C 类 | 查询封装 |
| `isServer` / `isClient` | `env.ts` | 🔴 C 类 | 环境检测 |
| `isNode` / `isElement` / `isHTMLElement` / `isSVGElement` | `types.ts` | 🔴 C 类 | 类型守卫 |
| `getSiblings` | `getSiblings.ts` | 🔴 C 类 | DOM 遍历 |
| `withPure` | `withPure.ts` | 🔴 C 类 | 对象工具 |

---

## A 类：保留（必要性高）

### EventManager

**必要性：**
原生 `addEventListener` 仍缺乏批量管理、事件委托和全局清理能力。`delegate` 是核心价值——UI 组件库（下拉菜单、虚拟列表、弹出层）天然依赖事件委托。`emit` 的 `CustomEvent` 封装提供了 type-safe 的自定义事件分发。

**2026 年的考量：**
- `AbortSignal` 作为取消监听的标准方案已非常成熟，但 zedom 仍返回 `() => void` 的 Unsubscribe 模式，略显过时
- 缺少 `{ passive: true }` 等常用选项的快捷键封装
- 事件命名空间（如 `click.myPlugin`）的支持不完整
- `WeakMap` 存储实现是好的设计选择

### getScrollParent

**必要性：**
无原生等价 API。递归查找最近的可滚动父级，用于：
- 浮动定位元素的容器边界计算
- Infinite scroll / 虚拟滚动初始化
- 模态框 body 锁定时的滚动上下文检测

**2026 年的考量：**
实现正确，`overflow: overlay` 和 `overflow: clip` 的边界处理也到位。

### getScrollbarWidth

**必要性：**
`scrollbar-gutter: stable` CSS 属性已覆盖大部分场景，但仍有一些情况（自定义滚动条覆盖、iframe 内嵌页面、Chrome DevTools 侧边栏）需要测量实际滚动条宽度。

**2026 年的考量：**
- `devicePixelRatio` 变化的监听是好的设计（缩放导致 scrollbar width 变化）
- 缓存实现合理

### getParentNode

**必要性：**
`Element.closest(selector)` 是原生等价方案，但 `getParentNode` 额外支持传 `Element` 引用作为目标，这是原生 API 没有的：

```ts
// 原生只能传 CSS 选择器
el.closest('.container')

// zedom 额外支持传元素引用
getParentNode(el, targetElement)
```

**2026 年的考量：**
对于程序化 UI 场景（不知道 CSS 选择器、只知道某个元素引用）非常实用。

---

## B 类：保留但需改进

### getStyle / setStyle

**问题：**
- `getStyle` 只读 **inline style** (`el.style`)，不读 `getComputedStyle`。这与用户直觉不符。
- 不支持 CSS 自定义属性（`--custom-color`）——测试虽用 `try/catch` 跳过，但实际上是功能缺失
- `setStyle` 无法删除一个已设置的样式（设为 `null`/`''` 行为不明确）

**改进方向：**
| 项目 | 当前 | 改进后 |
|------|------|--------|
| 读计算后样式 | 不支持 | 增加 `computed?: boolean` 参数或独立 `getComputedStyle` 函数 |
| CSS 变量 | `getStyle(el, '--x')` 报错 | 自动检测 CSS 变量，走 `getPropertyValue` |
| 删除样式 | 只能 `setStyle(el, 'color', '')` | 增加 `removeStyle(el, name)` 或设为 null 时自动 `removeProperty` |
| overflow 配置 | `Color` 0px 不可读 | 读 computedStyle 应返回 `0px` 而非空字符串 |

### toElement

**问题：**
- 内部 HTML 存在 XSS 风险，无任何警告或 sanitize
- `isNil(innerHTML)` 返 `document.createElement('div')` 语义不明确——为什么是 `div`？
- 有 `children` 参数但只通过 `append` 添加，不支持 pre-append 或 replace 模式

**改进方向：**
| 项目 | 当前 | 改进后 |
|------|------|--------|
| 安全声明 | 无 | 在 JSDoc 中明确标注 XSS 风险 |
| null 处理 | 返回 `div` | 返回 `document.createDocumentFragment()` 更恰当 |
| children 追加模式 | 仅 append | 考虑 `{ prepend?: boolean }` 选项 |

### getIndex

**问题：**
功能正确但过于 niche。应与 `getSiblings` 合并为"节点关系查询"组。

**改进方向：**
保持实现，但定位为 `getSiblings` + `getIndex` 组合的一部分。

---

## C 类：建议删除（必要性低）

### $all

```
Array.from(parent.querySelectorAll(selector))
```

**删除理由：**
这就是一行 `Array.from()`，在 2026 年的 TypeScript/ES2025 中，`el.querySelectorAll` 返回 `NodeList`，配合 `...` 扩展符或 `for...of` 已非常自然。不值得作为库的公开 API。

### isServer / isClient

```
typeof window === 'undefined'
```

**删除理由：**
- 一行判断，不值得库导出
- 2026 年框架提供了更好的方案：
  - Vite：`import.meta.env.SSR`
  - Nuxt：`import.meta.server`
  - Next.js：`typeof window === 'undefined'` 本身已经是惯用写法
- 作为模块级常量（`export const`），无法在运行时重新赋值，灵活性为 0

### isNode / isElement / isHTMLElement / isSVGElement

```
value instanceof Node
value instanceof Element
value instanceof HTMLElement
value instanceof SVGElement
```

**删除理由：**
- 四个函数都是 `instanceof` 的一行封装
- TypeScript 开发者写 `val instanceof HTMLElement` 比 `isHTMLElement(val)` 更直观
- TS 的类型收窄（type narrowing）对 `instanceof` 有原生的第一等支持，对自定义 type guard 反而有更严格的要求

### getSiblings

```
[...el.parentNode.children].filter(e => e !== el)
```

**删除理由：**
- 一行惯用代码
- 与 `getIndex` 同属"关系查询"，但 `getIndex` 保留因其场景更具体（拖拽排序、虚拟列表下标检测）
- 如果开发者需要，可以从 `getIndex` 配合父节点取 `children` 获得

### withPure

```
Object.create(null)
```

**删除理由：**
- `Object.create(null)` 的目的曾是避免 `__proto__` 属性污染。2026 年此场景已极少
- 类型重载复杂（`T extends undefined ? {} : ...`）但实际价值几乎为零
- 无明显 use case 支撑

---

## 内部函数评估

| 内部函数 | 文件 | 状态 |
|---------|------|------|
| `mergeClass` | `internal/mergeClass.ts` | ⏸️ 已实现但未导出。2026 年 classList API (`add`/`remove`/`toggle`/`contains`) 已足够完备，无需导出。 |
| `splitClass` | `internal/splitClass.ts` | ⏸️ 同上。 |
| `camelize` | `internal/camelize.ts` | ✅ 内部使用（getStyle/setStyle），无需公开。 |
| `isNil` | `internal/isNil.ts` | ✅ 内部使用，无需公开。 |
| `isObject` | `internal/isObject.ts` | ✅ 内部使用，无需公开。 |
| `forEachEntry` | `internal/forEachEntry.ts` | ✅ 内部使用，无需公开。 |
| `Key` / `MaybeArrayLike` / `RecursiveArrayLike` | `internal/types.ts` | ⏸️ 部分已注释掉（`MaybeArrayLike`）。考虑清理未使用类型。 |
| `StyleElement` | `internal/types.ts` | ⏸️ `{ style: any }` 过度设计，`HTMLElement.style` 本身就是 `CSSStyleDeclaration`。 |

---

## 缺失功能建议

### P0 — 高优先级

#### 1. Element creation with props

2026 年函数式 UI / Web Components 场景需要程序化构建元素。

```ts
createElement('div', { className: 'box', onClick: fn }, 'Child text')
createElement('button', { disabled: true }, createElement('span', {}, 'Click'))
```

对比 `toElement`：
- `toElement` 只接受 HTML 字符串（有 XSS 风险）
- `createElement` 纯 API 构造，无 XSS、类型安全

#### 2. Dimension / Position helpers

`getBoundingClientRect` + `getComputedStyle` 组合计算尺寸是原生 API 真正的痛点。

```ts
getOuterWidth(el)       // el.offsetWidth 但有滚动条修正
getInnerWidth(el)       // el.clientWidth
getOffset(el)           // { top, left } 递归累加 offsetParent
getViewportSize()       // window.innerWidth / innerHeight
getDocumentSize()       // 全文档尺寸
```

#### 3. Focus management

2026 年 WCAG 无障碍是硬性需求。Focus trap 和 focusable 元素查询是高频痛点。

```ts
getFocusable(el: Element): HTMLElement[]    // 查询可聚焦元素
trapFocus(el: Element): () => void          // 焦点陷阱，返回释放函数
restoreFocus(el: Element, previous?: Element): void
```

### P1 — 中优先级

#### 4. AbortSignal 集成

2026 年 `AbortSignal` 事实标准。EventManager 应同时接受 `signal` 选项。

```ts
const ctrl = new AbortController()
em.on(el, 'click', fn, { signal: ctrl.signal })
em.on(el, 'mouseover', fn, { signal: ctrl.signal })
// 一次性清除所有
ctrl.abort()
```

可以原生 `addEventListener` 的 `signal` 直接透传，保持兼容。

#### 5. Transition/Animation end Promise

```ts
afterTransition(el): Promise<void>
afterAnimation(el): Promise<void>
```

#### 6. DOMContentLoaded wrapper

```ts
onReady(fn: () => void): void
whenReady(): Promise<void>
```

### P2 — 需评估 scope

#### 7. elementMatches — `el.matches(selector)` 的简写封装

单行封装，价值有限。如果做是为了与 `delegate` 配合。

#### 8. CSS class 批量操作

```ts
addClass(el, 'a', 'b', 'c')           // 多 class 单元素
addClass([el1, el2], 'class')          // 单 class 多元素
toggleClass(el, cond ? 'on' : 'off')   // 条件 class
```

但 2026 年 `classList` 已支持多参数，增值空间有限。

---

## 总结

| 类别 | 函数数 | 占比 | 行动 |
|------|--------|------|------|
| ✅ A 类 保留 | 4 | 29% | 保持，EventManager 增加 AbortSignal 支持 |
| 🟡 B 类 改进 | 4 | 29% | getStyle 增加 computed 模式、CSS 变量支持；toElement 补充安全声明 |
| 🔴 C 类 删除 | 6 | 43% | `$all`、`isServer/Client`、4 个 instanceof guards、`getSiblings`、`withPure` 移除 |
| ➕ 新增 P0 | 3 | — | `createElement`、Dimension helpers、Focus management |
| ➕ 新增 P1 | 3 | — | AbortSignal 集成、Transition end、DOMContentLoaded |
| ➕ 新增 P2 | 2 | — | CSS class 批量操作、elementMatches |

**清理后 API 预计：**
- 保留+改进：8 个
- 新增 P0：3 个
- 合计：约 11 个核心函数
- 删除：6 个（减少 40%）
