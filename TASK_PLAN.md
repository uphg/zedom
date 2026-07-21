# zedom 开源化改进计划

> 基于项目评估，按 P0（阻塞/基础设施）→ P1（代码质量/依赖）→ P2（工程化/社区）顺序执行。
> `- [ ]` 未完成 &nbsp;|&nbsp; `- [x]` 已完成

---

## P0：阻塞缺陷与基础设施

### P0.1 修复代码逻辑缺陷

- [x] `src/toElement.ts:5` — `isNil(innerHTML)` 为 true 时错误调用 `document.createElement(null)`，应返回空文档片段
- [x] `src/EventManager.ts:96-107` — `delegate` 事件委托的 `while(target?.matches(selector))` 条件反了，应改为从 target 向上遍历直到匹配 selector 或到达 container
- [x] `src/getStyle.ts:6` — `el['style'][styleName as unknown as number]` 使用类型 hack，应正确声明 style 索引类型

### P0.2 补充缺失的 `getSiblings` 源码

测试文件已存在但源码缺失，导致构建失败。

- [x] 新建 `src/getSiblings.ts` — 返回元素的同级兄弟节点（排除自身）
- [x] `src/zedom.ts` — 添加 `export * from './getSiblings'`
- [x] `test/getSiblings.spec.ts` — 验证测试通过

### P0.3 修复测试与实现不匹配

- [x] `test/events.spec.ts:88-89` — `on()` 返回 `Unsubscribe` 函数，测试断言 `expect(result).toBe(button)` 错误，应改为 `expect(typeof result).toBe('function')`
- [x] `test/events.spec.ts:166-167` — `off()` 返回 `void`，测试断言 `expect(result).toBe(button)` 错误，应改为 `expect(result).toBeUndefined()`
- [x] 修复 6 个测试文件的默认导入 → 具名导入（`getStyle`, `getIndex`, `setStyle`, `toElement`, `getScrollParent`, `getSiblings`）

### P0.4 修复 vitest 环境配置

- [x] `pnpm add -D jsdom`
- [x] `vitest.config.ts` — `environment: 'node'` → `environment: 'jsdom'`
- [x] `pnpm test:run` 确认全部测试通过

### P0.5 开源基础设施

- [x] 创建 `LICENSE` — MIT 协议
- [x] `package.json` — 替换占位符：`homepage`、`repository`、`bugs` → `xypur/zedom`
- [x] `.github/workflows/ci.yml:20` — `github.repository == 'your-username/fun-demo'` → `'xypur/zedom'`
- [x] `package.json` — `keywords` 移除 `math`，添加 `dom`、`events`

### P0.6 README 文档

- [x] 修正 typo: `"A DOM librar."` → `"A lightweight JavaScript DOM library."`
- [x] 补充安装方式：`pnpm add zedom-creator` / `npm install zedom-creator`
- [x] 补充 API 速览表（函数列表 + 分类 + 简短说明）
- [x] 补充代码示例（EventManager + DOM 操作）
- [x] 补充 License 信息

---

## P1：代码质量与依赖治理

### P1.1 依赖治理

- [x] 内联 `unfunt` 工具函数到 `src/internal/` — `camelize`、`isObject`、`forEachEntry`、`isNil` 四个函数
- [x] `src/getStyle.ts` — import 替换为本地 `src/internal/`
- [x] `src/setStyle.ts` — import 替换为本地 `src/internal/`
- [x] `src/toElement.ts` — import 替换为本地 `src/internal/`
- [x] `src/withPure.ts` — import 替换为本地 `src/internal/`
- [x] `package.json` — 移除 `dependencies.unfunt`

### P1.2 清理 fun-demo 模板残留

- [x] `scripts/helpers/create-packages.js:57` — `@fun-demo/` → `@zedom/`
- [x] `scripts/helpers/create-packages.js:62` — `"一个轻量级的 JavaScript 数学运算库"` → `"A lightweight JavaScript DOM library"`
- [x] `scripts/helpers/create-packages.js:73-76` — 替换占位符 homepage/repository/bugs/author
- [x] `tsdown.config.ts:28` — `name: 'funDemo'` → `name: 'zedom'`
- [x] `scripts/build-package.js` — 替换 `@fun-demo/` → `@zedom/`
- [x] `scripts/publish-packages.js` — 替换 `@fun-demo/` → `@zedom/`

### P1.3 类型加固

- [x] `src/all.ts` — 补充 `$all` 函数参数和返回值类型
- [x] `src/getScrollParent.ts` — 内联局部 `getParentNode`，消除与 `src/getParentNode.ts` 的名称冲突
- [x] `src/getScrollbarWidth.ts` — 全局 `resize` 监听改为懒初始化，消除模块级副作用

### P1.4 补充测试

- [x] `test/events.spec.ts` — 补充 `EventManager.once` 测试 (4 tests)
- [x] `test/events.spec.ts` — 补充 `EventManager.emit` 测试 (3 tests)
- [x] `test/events.spec.ts` — 补充 `EventManager.clear` 测试 (2 tests)

---

## P2：工程化与社区

### P2.1 CI/CD 完善

- [x] `package.json` scripts — 新增 `"typecheck": "tsc --noEmit"`
- [x] `.github/workflows/test.yml` — `lint-and-check` job 用 `pnpm typecheck` 替代 `pnpm build`
- [x] `.github/workflows/test.yml` — unit-test job 增加 `strategy.matrix.node: [18, 20, 22]`
- [x] `package.json` scripts — 新增 `"test:coverage": "vitest run --coverage"`
- [x] `vitest.config.ts` — coverage 追加 `thresholds: { lines: 60, functions: 60, branches: 50 }`
- [x] 新建 `.github/workflows/release.yml` — tag push 时自动 publish 到 npm
- [x] `package.json` — ESLint 依赖版本统一为 caret（`^`）
- [x] `.editorconfig` — 根目录添加，统一缩进/换行约定

### P2.2 社区治理文件

- [x] 新建 `CONTRIBUTING.md` — PR 流程、代码规范、本地开发指南
- [x] 新建 `CODE_OF_CONDUCT.md` — 采用 [Contributor Covenant](https://www.contributor-covenant.org/)
- [x] 新建 `SECURITY.md` — 安全漏洞报告流程
- [x] 新建 `CHANGELOG.md` — 记录 v0.1.0-alpha.2 变更
- [x] `.github/ISSUE_TEMPLATE/` — bug-report.yml / feature-request.yml / config.yml
- [x] `.github/PULL_REQUEST_TEMPLATE.md` — PR 描述模板含 checklist
- [x] `.github/dependabot.yml` — npm 周检 + GitHub Actions 周检
- [x] `.github/workflows/autofix.yml` — 为 pinned commit hash 添加注释

### P2.3 文档站点

- [x] 新建 `docs/` — VitePress 初始化，配置 nav/sidebar
- [x] `docs/guide/` — 入门指南（安装、快速开始、核心概念）
- [x] `docs/api/` — Events / DOM / Environment 三个 API 文档页
- [x] `package.json` scripts — 新增 `"docs:dev"` / `"docs:build"` / `"docs:preview"`
- [x] `.github/workflows/test.yml` — 追加 `pnpm docs:build` 校验文档可构建

### P2.4 可选增强

- [x] `package.json` — 追加 `"sideEffects": false`
- [x] `package.json` — 追加 `"engines": { "node": ">=18" }`
- [x] `.vscode/extensions.json` — 补充推荐的 VSCode 插件列表
- [x] `.gitignore` — 追加 VitePress cache/dist 排除

---

## 执行优先级总览

```
P0 ──┬── [x] P0.1 修复代码逻辑缺陷 (toElement / delegate / getStyle)
     ├── [x] P0.2 补充 getSiblings 源码
     ├── [x] P0.3 修复事件测试断言 + 具名导入
     ├── [x] P0.4 修复 vitest jsdom 环境
     ├── [x] P0.5 开源基础设施 (LICENSE / package.json 占位符)
     ├── [x] P0.6 README 文档
     └── [x] [验收] pnpm test:run (133/133) + pnpm lint:check + pnpm build 全绿

P1 ──┬── [x] P1.1 内联 unfunt 依赖
     ├── [x] P1.2 清理 fun-demo 模板残留
     ├── [x] P1.3 类型加固
     └── [x] P1.4 补充测试

P2 ──┬── [x] P2.1 CI/CD 完善
     ├── [x] P2.2 社区治理文件
     ├── [x] P2.3 文档站点
     └── [x] P2.4 可选增强
```

---

## 预计工作量

| 阶段 | 估计 PR 数 | 影响文件数 | 预计工时 |
|------|-----------|-----------|---------|
| P0 | 3–5 | 15+ | 4–6h |
| P1 | 2–3 | 10+ | 3–5h |
| P2 | 3–4 | 15+ | 4–8h |

总计约 **8–12 个 PR**，P0 优先合并后再推进 P1/P2。
