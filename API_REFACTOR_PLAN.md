# zedom API 重构计划

> 基于 `API_REVIEW.md` 的评估结论，按 Removals → Improvements → Additions 顺序执行。
> `- [ ]` 未完成 &nbsp;|&nbsp; `- [x]` 已完成

---

## R0：移除 C 类函数

删除必要性低的 6 个函数。这些函数都是一行封装的"牛皮癣"式 API。

### R0.1 移除 `all.ts`

- [ ] 删除 `src/all.ts`
- [ ] 检查 `src/` 是否有其他文件引用 `$all`（grep `all.ts` / `$all`）
- [ ] 删除 `test/` 中对应的测试文件（如有）

### R0.2 移除 `env.ts`

- [ ] 删除 `src/env.ts`
- [ ] 检查 `src/getScrollbarWidth.ts` 中 `import { isClient } from './env'`，将其内联为 `typeof window !== 'undefined'`
- [ ] 删除 `test/env.spec.ts`

### R0.3 移除 `types.ts`

- [ ] 删除 `src/types.ts`
- [ ] 检查 `src/` 是否有其他文件引用 `isNode` / `isElement` / `isHTMLElement` / `isSVGElement`

### R0.4 移除 `getSiblings.ts`

- [ ] 删除 `src/getSiblings.ts`
- [ ] 从 `src/zedom.ts` 移除 `export * from './getSiblings'`
- [ ] 删除 `test/getSiblings.spec.ts`

### R0.5 移除 `withPure.ts`

- [ ] 删除 `src/withPure.ts`
- [ ] 检查 `src/` 是否有其他文件引用 `withPure`（可能是 setStyle？setStyle 有自己的 `forEachEntry` 实现）

### R0.6 更新 barrel（`zedom.ts`）

- [ ] 最终清理 `src/zedom.ts` 中的 `export *`，只保留 A 类和 B 类函数

### R0.7 清理内部残留

- [ ] 检查 `src/internal/types.ts` 中未使用的类型（`MaybeArrayLike`、`RecursiveArrayLike`、`StyleElement`），清理或简化

### 依赖影响

| 删除函数 | 引用方 | 处理方式 |
|---------|--------|---------|
| `isClient` | `getScrollbarWidth.ts` | 内联为 `typeof window !== 'undefined'` |
| `$all` | 无 | 直接删除 |
| `isServer` / `isClient` | 无 | `env.ts` 删除后自动清除 |
| `isNode` / `isElement` 等 | 无 | 直接删除 |

---

## R1：改进 B 类函数

### R1.1 `getStyle` — 增加 computed 模式支持

- [ ] 增加 `computed` 参数：`getStyle(el, styleName, computed?: boolean)`
- [ ] `computed: true` 时走 `getComputedStyle(el).getPropertyValue(camelized)`
- [ ] 增加 CSS 自定义属性自动检测：以 `--` 开头的属性走 `getPropertyValue`
- [ ] 明确行为：`computed: true` 会返回计算后值（如 `100px`），而不是 inline style 的空字符串
- [ ] 编写测试覆盖：
  - `computed: true` 与 inline style 的一致性
  - CSS 自定义属性（`--x`）
  - 未设置样式时 computed 的默认值（`margin: 0px` 而非 `''`）
  - 继承样式值（`color: inherit` 最终为父级颜色）

```ts
// 新签名
export function getStyle(
  el: HTMLElement,
  styleName: string,
  options?: { computed?: boolean }
): string | null
```

### R1.2 `setStyle` — 增加 CSS 变量和删除支持

- [ ] CSS 变量自动检测：`setStyle(el, '--custom', 'red')` 自动走 `el.style.setProperty('--custom', 'red')`
- [ ] 值 `null` 时自动调用 `removeProperty`
- [ ] 编写测试覆盖：
  - CSS 自定义属性设置
  - `null` 值删除样式
  - CSS 变量通过对象批量设置

### R1.3 `toElement` — 安全改进

- [ ] 在 JSDoc 中增加 XSS 安全警告说明
- [ ] `isNil` 分支改为返回 `document.createDocumentFragment()` 而非 `document.createElement('div')`
- [ ] 考虑增加 `{ childrenPosition?: 'append' | 'prepend' }` 选项

---

## R2：新增 P0 函数

### R2.1 `createElement` — 元素创建工厂

纯程序化构造，无 HTML 字符串，无 XSS 风险。

```ts
// 提案签名
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: ElementProps | null,
  ...children: (string | Node)[]
): HTMLElementTagNameMap[K]
```

`ElementProps` 应覆盖：

- `className` / `class` — class 设置
- `style` — 支持对象 `{ color: 'red' }` 和字符串
- `on{Event}` — 事件绑定（`onClick`, `onChange` 等），内部调用 `em.on(el, 'click', fn)`
- `dataset` — `data-*` 属性
- HTML attributes — `id`, `href`, `src`, `disabled`, `type` 等

**设计参考：**
```ts
const btn = createElement('button', {
  className: 'btn primary',
  disabled: false,
  onClick: () => console.log('clicked'),
  dataset: { id: 'btn-1' }
}, 'Click me')
```

**任务：**
- [ ] 新建 `src/createElement.ts`
- [ ] 定义 `ElementProps` 类型
- [ ] 事件属性处理（`onClick` → `addEventListener('click', ...)`）
- [ ] 样式对象处理（复用 setStyle 或内联）
- [ ] className 支持（字符串和对象/数组？）
- [ ] 编写测试：
  - 基本元素创建
  - 属性设置
  - 事件绑定
  - 嵌套子元素
  - children 为文本、元素、DocumentFragment
- [ ] 导出到 `src/zedom.ts`

### R2.2 `getOuterWidth` / `getInnerWidth` / `getOffset` 等尺寸工具

**提案函数：**

```ts
getOuterWidth(el: Element): number
getOuterHeight(el: Element): number
getInnerWidth(el: Element): number
getInnerHeight(el: Element): number
getOffset(el: Element): { top: number; left: number }
getViewportSize(): { width: number; height: number }
getDocumentSize(): { width: number; height: number }
```

**任务：**
- [ ] 新建 `src/dimension.ts`
- [ ] 实现 `getOuterWidth` / `getOuterHeight`（参考 `offsetWidth` / `offsetHeight`）
- [ ] 实现 `getInnerWidth` / `getInnerHeight`（参考 `clientWidth` / `clientHeight`）
- [ ] 实现 `getOffset`（递归累加 `offsetTop` / `offsetLeft`，修正 `offsetParent` 边框）
- [ ] 实现 `getViewportSize`（`window.innerWidth` / `innerHeight`）
- [ ] 实现 `getDocumentSize`（`document.documentElement.scrollWidth` / `scrollHeight`）
- [ ] 编写测试
- [ ] 导出到 `src/zedom.ts`

### R2.3 Focus management

**提案函数：**

```ts
getFocusable(el: Element): HTMLElement[]
trapFocus(el: Element): () => void
```

**任务：**
- [ ] 新建 `src/focus.ts`
- [ ] `getFocusable` — 查询所有可聚焦元素（a[href], button, input, textarea, select, [tabindex], contenteditable），过滤不可见元素
- [ ] `trapFocus` — 监听 Tab/Shift+Tab，循环聚焦。返回清除函数
- [ ] 编写测试
- [ ] 导出到 `src/zedom.ts`

---

## R3：新增 P1 函数

### R3.1 EventManager AbortSignal 集成

- [ ] `on` 方法增加 `signal` 选项透传——`options.signal` 直接传给 `addEventListener`，原生支持
- [ ] 保持现有 `Unsubscribe` 返回值不变，保持向后兼容
- [ ] 测试：创建 `AbortController`，调用 `abort()`，确认 listener 被移除

### R3.2 `afterTransition` / `afterAnimation`

```ts
afterTransition(el: Element): Promise<void>
afterAnimation(el: Element): Promise<void>
```

- [ ] 新建 `src/transition.ts`
- [ ] 监听 `transitionend` / `animationend` 事件
- [ ] 处理 `cancel` / `multiple transitions` 的边界
- [ ] 超时兜底（fallback to requestAnimationFrame）
- [ ] 编写测试

### R3.3 `onReady` / `whenReady`

```ts
onReady(fn: () => void): void
whenReady(): Promise<void>
```

- [ ] 新建 `src/ready.ts`
- [ ] `document.readyState === 'complete'` 时同步调用，否则监听 `DOMContentLoaded`
- [ ] 编写测试

---

## R4：测试与清理

### R4.1 测试覆盖率补齐

- [ ] 运行 `pnpm test:coverage` 评估当前覆盖率
- [ ] 为所有新函数补充边界测试（null input、非 DOM 环境、边缘参数）
- [ ] 为所有 B 类改进的函数补充回归测试

### R4.2 文档更新

- [ ] `API_REVIEW.md` — 记录实际完成的变更
- [ ] `README.md` — 更新函数列表、移除已删函数、添加新函数文档
- [ ] `docs/.vitepress/config.ts` — 如果导出了新函数，更新 nav/sidebar
- [ ] `docs/api/` — 补充新函数的文档页

### R4.3 发布准备

- [ ] 更新 `CHANGELOG.md` 记录本次重构（breaking changes 需要用 `!` 标记）
- [ ] 版本 bump（major，因为删除公开 API 是 breaking change）
- [ ] `pnpm test:run + pnpm lint:check + pnpm typecheck + pnpm build` 全绿

---

## 执行优先级总览

```
R0 移除 ─── [ ] R0.1 移除 all.ts
             ├── [ ] R0.2 移除 env.ts
             ├── [ ] R0.3 移除 types.ts
             ├── [ ] R0.4 移除 getSiblings.ts
             ├── [ ] R0.5 移除 withPure.ts
             └── [ ] R0.6 更新 barrel

R1 改进 ─── [ ] R1.1 getStyle computed + CSS 变量
             ├── [ ] R1.2 setStyle CSS 变量 + 删除
             └── [ ] R1.3 toElement 安全改进

R2 新增 ─── [ ] R2.1 createElement
             ├── [ ] R2.2 Dimension helpers
             └── [ ] R2.3 Focus management

R3 新增 ─── [ ] R3.1 AbortSignal 集成
             ├── [ ] R3.2 Transition / Animation end
             └── [ ] R3.3 DOMContentLoaded

R4 清理 ─── [ ] R4.1 测试补齐
             ├── [ ] R4.2 文档更新
             └── [ ] R4.3 发布
```

R0 和 R1 可并行（API 删除与 API 改进不冲突）。
R2 和 R3 可并行。
R4 必须在所有变更后进行。

---

## 影响范围

| 阶段 | 文件操作 | Breaking? | 版本建议 |
|------|---------|-----------|---------|
| R0 移除 | 删除 6 个源文件 + 3 个测试文件 + barrel | ✅ Yes | major |
| R1 改进 | 修改 3 个源文件 + 测试 | ⚠️ 行为变更 | major (if breaking) or minor |
| R2 新增 | 新建 3 个源文件 + barrel | ❌ No | minor |
| R3 新增 | 新建 2 个源文件 + 修改 EventManager | ❌ No | minor |
| R4 清理 | 更新文档、changelog | ❌ No | — |

建议一次 major 版本发布（`0.2.0`→`1.0.0` 或 `0.2.0`），因为 R0 涉及公开 API 删除。

---

## 预计工作量

| 阶段 | 估计 PR 数 | 涉及文件 | 预计工时 |
|------|-----------|---------|---------|
| R0 移除 | 1 | 10+ | 0.5h |
| R1 改进 | 1–2 | 6+ | 1–2h |
| R2 新增 | 3 | 9+ | 3–5h |
| R3 新增 | 2 | 5+ | 1–2h |
| R4 清理 | 1 | 5+ | 1h |

总计约 **8 PR，5–10h**。
