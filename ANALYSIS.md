# zedom 开源项目分析报告

> 分析日期：2026-07-21

---

## 目录

1. [项目概览](#1-项目概览)
2. [开源基础设施缺失](#2-开源基础设施缺失)
3. [package.json 与配置问题](#3-packagejson-与配置问题)
4. [文档与 README 问题](#4-文档与-readme-问题)
5. [代码缺陷与质量问题](#5-代码缺陷与质量问题)
6. [工程化与构建问题](#6-工程化与构建问题)
7. [依赖问题](#7-依赖问题)
8. [安全与最佳实践](#8-安全与最佳实践)
9. [CI/CD 问题](#9-cicd-问题)
10. [项目模版残留问题](#10-项目模版残留问题)

---

## 1. 项目概览

`zedom` 定位为轻量级 DOM 操作库，类似于微型 jQuery。当前包含功能：

| 模块 | 功能 |
|------|------|
| `EventManager` | 事件绑定/解绑/委托/触发 |
| `getStyle` / `setStyle` | 样式读写 |
| `getIndex` | 获取元素在同级中的索引 |
| `toElement` | HTML 字符串转 DOM 元素 |
| `getScrollParent` / `getScrollbarWidth` | 滚动相关工具 |
| `env` | 客户端/服务端环境检测 |
| `all` | `querySelectorAll` 封装 |
| `getParentNode` | 向上查找匹配的父元素 |
| `withPure` | 创建纯净对象 |

项目目前处于 **pre-alpha 阶段**（v0.1.0-alpha.2），大量基础建设不完善，API 设计、测试覆盖、文档等均未达到开源发布标准。

---

## 2. 开源基础设施缺失

### 2.1 [P0] 缺少 LICENSE 文件

- `package.json` 声明 `"license": "MIT"`，但根目录下 **没有 LICENSE 文件**
- `files` 字段包含 `"LICENSE"`，构建脚本也会尝试拷贝，但文件实际不存在
- 发布到 npm 后用户无法得知授权条款

### 2.2 [P1] 缺少 CHANGELOG.md

- 项目依赖了 `conventional-changelog-cli`，也有 `changelog` 脚本
- 但不存在初始 CHANGELOG.md，版本历史不可追溯

### 2.3 [P2] 缺少 CONTRIBUTING.md

- 无贡献指南，外部贡献者不知如何提交 PR、代码规范、本地开发流程

### 2.4 [P2] 缺少 CODE_OF_CONDUCT.md

- 缺乏行为准则，不符合 GitHub 推荐的开源项目标准

---

## 3. package.json 与配置问题

### 3.1 [P0] 占位符未替换

| 字段 | 当前值 | 问题 |
|------|--------|------|
| `name` | `"zedom-creator"` | 与项目名 `zedom` 不一致 |
| `homepage` | `"https://github.com/your-username/fun-demo#readme"` | 占位符 |
| `repository` | `"your-username/fun-demo"` | 占位符 |
| `bugs` | `"https://github.com/your-username/fun-demo/issues"` | 占位符 |
| `author` | `"Your Name <your.email@example.com>"` | 占位符 |

### 3.2 [P2] ESLint 依赖版本策略不统一

- `@eslint/js: ^9.31.0`（caret）
- `eslint: "9.31.0"`（固定版本）
- `@typescript-eslint/eslint-plugin: "8.37.0"`（固定版本）
- 应统一为 caret 或固定版本

---

## 4. 文档与 README 问题

### 4.1 [P0] README 拼写错误

```diff
- A DOM librar.
+ A DOM library.
```

### 4.2 [P0] 无 API 文档

README 仅包含开发命令，无以下内容：
- 安装方式（`npm install` / `pnpm add` / CDN）
- 函数列表与分类
- 代码示例
- TypeScript 类型说明
- 浏览器兼容性说明

### 4.3 [P1] 声明的 VitePress 文档站点不存在

README 写道：
> 📚 **VitePress** - Documentation site

但项目中 **没有 `docs/` 目录**，也没有任何 VitePress 配置文件。

### 4.4 [P2] 缺乏公共徽章 (Badges)

缺少：
- CI 构建状态
- npm 版本
- License 类型
- Bundle size
- TypeScript 支持

---

## 5. 代码缺陷与质量问题

### 5.1 [P0] `src/toElement.ts` 逻辑错误

```typescript
export function toElement(innerHTML: string, children?: ArrayLike<Element>) {
  if (isNil(innerHTML)) return document.createElement(innerHTML)  // 传入 null/undefined 给 createElement 会抛错
  // ...
}
```

`isNil` 为 true 时（即 `innerHTML` 为 null/undefined），调用 `document.createElement(innerHTML)` 传入 null/undefined，会抛出 `INVALID_CHARACTER_ERR`。该条件判断的含义是反的——应该是在 `isNil` 时返回默认元素或空文档片段。

### 5.2 [P0] `EventManager.delegate` 事件委托逻辑错误

`src/EventManager.ts` 第 99 行：

```typescript
while (target?.matches(selector)) {
  if (container === target) {
    target = null
    break
  }
  target = target?.parentNode as Element
}
```

`while` 的条件是 `target.matches(selector)` 为 true 时才进入循环。但事件委托的语义是：从 `event.target` 开始向上遍历，**找到第一个匹配 selector 的元素**。当前实现会导致：
- 如果 `event.target` 不匹配 selector，循环体不会执行，handler 永远不会被调用
- 实际上应该用 `while (target && target !== container)` 并在循环内检查 `matches`

### 5.3 [P0] `src/getStyle.ts` 类型 hack

```typescript
return el['style'][styleName as unknown as number]
```

使用 `as unknown as number` 绕过类型检查，表明类型设计有缺陷。应正确定义 style 的索引类型。

### 5.4 [P0] 测试与实现不匹配——缺少 `getSiblings` 源码

`test/getSiblings.spec.ts` 测试了 `getSiblings` 函数，但 `src/` 下不存在同名的源文件，测试必然失败。

### 5.5 [P0] EventManager 测试与实现不匹配

`test/events.spec.ts` 中：
- 测试断言 `on(button, ...)` 返回元素本身（`expect(result).toBe(button)`），但实现中 `on` 返回 `Unsubscribe`（函数）
- 测试断言 `off(button, ...)` 返回元素本身，但实现中 `off` 返回 `void`

### 5.6 [P1] `EventManager.once` 无测试覆盖

`once` 方法定义了但没有任何测试覆盖。

### 5.7 [P2] `src/all.ts` 缺少类型注解

```typescript
export function $all(selector, parent = document) {
```

`selector` 和 `parent` 参数、返回值均无类型定义，降低 TypeScript 项目价值。

### 5.8 [P2] 两个 `getParentNode` 重复定义

`src/getScrollParent.ts` 中局部定义了 `getParentNode` 函数，但 `src/` 下已有独立的 `getParentNode.ts` 模块，功能重复且实现不同。

### 5.9 [P2] `env.ts` 模块级副作用

`getScrollbarWidth.ts` 在模块加载时注册了全局 `resize` 事件，不利于 tree-shaking 和 SSR 安全。

### 5.10 [P2] 测试环境需要 jsdom

`vitest.config.ts` 配置 `environment: 'node'`，但测试文件大量使用 DOM API（`document.createElement`、`MouseEvent`、`button.click()` 等），需要改为 `environment: 'jsdom'`。需要安装 `jsdom` 或 `happy-dom`。

---

## 6. 工程化与构建问题

### 6.1 [P1] 无独立的 typecheck 脚本

CI 中使用 `pnpm build` 来替代类型检查，但 build 包含了打包步骤，过于重量级。应提供 `pnpm typecheck` 只运行 `tsc --noEmit`。

### 6.2 [P2] 无代码覆盖率门槛

配置了 coverage reporter 但无 `thresholds`，CI 也不检查覆盖率。

### 6.3 [P2] 构建脚本是纯 JS 无类型

`scripts/` 下的 `build.js`、`release.js`、`publish-packages.js` 等用纯 JavaScript 编写，无类型检查，且被 ESLint 忽略。

### 6.4 [P2] dist 发布方式不够标准

构建后执行 `cd dist && npm publish`，与标准的 `"publishConfig"` + `npm publish` 模式不同，可能导致 CI 路径问题。

---

## 7. 依赖问题

### 7.1 [P1] 生产依赖 `unfunt` 是 alpha 版本

唯一运行时依赖 `unfunt: "0.2.0-alpha.4"`：
- alpha 版本 API 可能随时变更
- 仓库不可见，社区信任度低
- 功能简单（`camelize`, `isObject`, `forEachEntry`, `isNil`），建议内联以减少外部依赖

### 7.2 [P1] vitest 需要 jsdom 依赖

`environment: 'node'` 无法运行 DOM 测试，需要安装 `jsdom` 或兼容的环境包。

---

## 8. 安全与最佳实践

### 8.1 [P2] `toElement` 使用 innerHTML 存在 XSS 风险

直接通过 `innerHTML` 解析 HTML 字符串可能引入 XSS 漏洞，应在文档中明确说明或提供纯 DOM 构建 API。

### 8.2 [P2] 缺少 `.editorconfig`

虽然 ESLint stylistic 覆盖代码格式，但 `.editorconfig` 能确保所有编辑器的基本行为一致（缩进、换行等）。

---

## 9. CI/CD 问题

### 9.1 [P0] CI 中的仓库占位符

`ci.yml:21`：

```yaml
if: github.repository == 'your-username/fun-demo' && github.ref == 'refs/heads/dev'
```

永远不可能匹配实际仓库，导致持续发布（continuous-release）job 永远不会运行。

### 9.2 [P1] 无 GitHub Action 自动发布

`release.js` 是本地脚本，发布流程手工化。应自动化：
- 创建 GitHub Release
- 自动 publish 到 npm
- 自动打 tag

### 9.3 [P2] 测试矩阵单一

`test.yml` 仅在 `ubuntu-latest` + Node 20 上运行，未覆盖 LTS 范围的兼容性。

### 9.4 [P2] `autofix.yml` 缺少注释

`autofix-ci` action 使用 pinned commit hash，但无注释说明 pin 的原因。

---

## 10. 项目模版残留问题

项目明显是从名为 `fun-demo` 的模板/示例 fork 而来，多处残留证据：

### 10.1 [P1] `scripts/` 和构建配置中的 `fun-demo` 引用

| 文件 | 残留内容 |
|------|---------|
| `scripts/helpers/create-packages.js:57` | `name: \`@fun-demo/${hyphName}\`` |
| `scripts/helpers/create-packages.js:73-76` | 占位符 homepage/repository/bugs/author |
| `scripts/helpers/create-packages.js:62` | `"一个轻量级的 JavaScript 数学运算库"`（数学运算库，应描述为 DOM 库） |
| `tsdown.config.ts:28` | `name: 'funDemo'` |

### 10.2 [P2] `keywords` 不准确

```json
["javascript", "typescript", "math", "utils", "utility", "functions", "library", "tools"]
```

作为 DOM 库，包含 `math` 关键词且缺少 `dom` 关键词不合适。

---

## 总结：修复优先级矩阵

| 优先级 | 数量 | 典型问题 |
|--------|------|---------|
| 🔴 P0 必须修复 | 7 | LICENSE 缺失、toElement 逻辑反、delegate 逻辑错、getSiblings 缺源码、测试不匹配、package.json 占位符、CI 占位符 |
| 🟠 P1 重要 | 6 | CHANGELOG、README API 文档、unfunt alpha 依赖、jsdom 配置、VitePress 不存在、模板残留 |
| 🟡 P2 建议 | 12 | CONTRIBUTING、徽章、覆盖率门槛、矩阵测试、.editorconfig、类型注解等 |
