# 贡献指南

[English](./CONTRIBUTING.md) | 中文

感谢您对 Zedom 项目的关注！本指南将帮助您开始为这个轻量级 DOM 操作库做出贡献。

## 目录

- [开发环境设置](#开发环境设置)
- [项目结构](#项目结构)
- [代码规范](#代码规范)
- [测试](#测试)
- [文档](#文档)
- [提交更改](#提交更改)
- [发布流程](#发布流程)

## 开发环境设置

### 前置要求

- Node.js（推荐最新 LTS 版本）
- pnpm（包管理器）
- Git

### 开始使用

1. 在 GitHub 上 Fork 仓库
2. 本地克隆您的 Fork：
   ```bash
   git clone https://github.com/YOUR_USERNAME/zedom.git
   cd zedom
   ```

3. 安装依赖：
   ```bash
   pnpm install
   ```

4. 设置 git hooks：
   ```bash
   pnpm prepare
   ```

### 可用脚本

- `pnpm test` - 以监视模式运行测试
- `pnpm test:run` - 运行一次测试
- `pnpm build` - 构建库
- `pnpm lint` - 检查并修复代码
- `pnpm lint:check` - 检查代码规范（不修复）
- `pnpm docs:dev` - 启动文档开发服务器
- `pnpm docs:build` - 构建文档
- `pnpm release` - 创建发布（仅维护者）

## 项目结构

```
zedom/
├── src/                 # 源代码
│   ├── *.ts            # DOM 工具函数
│   └── internal/       # 内部共享工具
├── test/               # 测试文件（镜像 src 结构）
├── docs/               # 文档
│   └── docs/           # API 文档
├── dist/               # 构建输出（生成的）
└── scripts/            # 构建和发布脚本
```

## 代码规范

### 基本规则

- **语言**：所有代码和注释必须使用英文
- **行结束符**：使用 Linux 风格的行结束符（LF）
- **无分号**：除非语法要求，否则不添加分号
- **TypeScript 优先**：所有源代码应使用 TypeScript 编写
- **最小依赖**：保持库的轻量级，最小化依赖

### 代码风格

- 遵循现有的 ESLint 配置
- 使用有意义的变量和函数名
- 保持函数小而专注于单一职责
- 除非重复使用 ≥2 次，否则不要将单行代码（≤100 字符）提取为函数
- 除非明确需要，否则不要重新格式化现有代码

### 添加新的 DOM 工具

1. **文件命名**：使用驼峰命名法（例如：`myDomFunction.ts`）

2. **函数结构**：
   ```typescript
   /**
    * 函数功能的简要描述
    * 
    * @param param1 参数描述
    * @param param2 参数描述
    * @returns 返回值描述
    * 
    * @example
    * ```typescript
    * myDomFunction(element, 'value')
    * // => result
    * ```
    */
   function myDomFunction(param1: Element, param2?: string): ReturnType {
     // 实现
   }

   export default myDomFunction
   ```

3. **从 index 导出**：将您的函数添加到主 `src/index.ts` 文件

4. **浏览器兼容性**：确保与现代浏览器兼容，必要时为旧浏览器提供回退

## 测试

### 编写测试

- 所有新工具必须有全面的测试
- 测试文件应命名为：`test/functionName.spec.ts`
- 使用 Vitest 测试框架和 jsdom 环境
- 遵循现有的测试模式

### 测试结构

```typescript
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import myDomFunction from '../src/myDomFunction'

describe('myDomFunction', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
  })

  afterEach(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
  })

  it('should handle basic case', () => {
    expect(myDomFunction(element, 'value')).toBe('expected')
  })

  it('should handle null element', () => {
    expect(() => myDomFunction(null, 'value')).not.toThrow()
  })

  it('should handle edge cases', () => {
    expect(myDomFunction(element, '')).toBe('')
  })
})
```

### 运行测试

```bash
# 运行所有测试
pnpm test:run

# 以监视模式运行测试
pnpm test

# 运行特定文件的测试
pnpm test myDomFunction.spec.ts
```

## 文档

### API 文档

- 每个工具函数都应该有 JSDoc 注释，包括：
  - 清晰的描述
  - 带类型的参数描述
  - 返回值描述
  - 使用示例
  - 浏览器兼容性或特殊行为的注释

### Markdown 文档

- API 文档位于 `docs/docs/`
- 每个函数都应该有自己的 markdown 文件
- 包含实际示例和用例
- 添加新工具时更新主 README.md

### 文档格式

```markdown
## `functionName(param1, param2)`

函数的简要描述。

### 使用方法

```ts
import { functionName } from 'zedom'

const element = document.getElementById('target')
functionName(element, 'value')
```

### 参数

1. `param1` *(Type)*: 参数描述
2. `param2` *(Type)*: 参数描述

### 返回值

*(ReturnType)*: 返回值描述
```

## 提交更改

### 提交前

1. **运行完整测试套件**：`pnpm test:run`
2. **检查代码规范**：`pnpm lint:check`
3. **构建项目**：`pnpm build`
4. **更新文档**（如需要）

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 错误修复
- `docs:` 文档更改
- `test:` 测试更改
- `refactor:` 代码重构
- `perf:` 性能改进
- `chore:` 维护任务

示例：
```
feat: add toggleClass utility for CSS class management
fix: handle null elements in addClass function
docs: add examples for event delegation
test: add edge cases for getScrollParent utility
```

### Pull Request 流程

1. 从 `master` 创建功能分支：
   ```bash
   git checkout master
   git pull origin master
   git checkout -b feature/my-new-utility
   ```

2. 按照上述指南进行更改

3. 使用约定式提交消息提交更改

4. 推送到您的 Fork 并创建针对 `master` 分支的 pull request

5. 填写 pull request 模板，包括：
   - 更改的清晰描述
   - 测试信息
   - 破坏性更改（如有）
   - 相关问题

### Pull Request 要求

- [ ] 所有测试通过
- [ ] 代码遵循风格指南
- [ ] 文档已更新
- [ ] 提交消息遵循约定式提交
- [ ] 无破坏性更改（除非已讨论）
- [ ] 分支与 `master` 保持最新

## 发布流程

发布由维护者使用自动化脚本处理：

1. **版本升级**：使用语义化版本
2. **变更日志生成**：从提交消息自动生成
3. **构建和发布**：自动化构建和 npm 发布

### 版本控制

- **补丁** (`0.1.0` → `0.1.1`)：错误修复、文档更新
- **次要** (`0.1.0` → `0.2.0`)：新功能、非破坏性更改
- **主要** (`0.1.0` → `1.0.0`)：破坏性更改

## 浏览器支持

Zedom 旨在支持：
- Chrome（最新 2 个版本）
- Firefox（最新 2 个版本）
- Safari（最新 2 个版本）
- Edge（最新 2 个版本）

添加新功能时，请考虑：
- 现代 DOM API 的可用性
- 必要时为旧浏览器提供回退
- 性能影响

## 获取帮助

- **问题**：检查现有问题或创建新问题
- **讨论**：使用 GitHub Discussions 进行问题和想法讨论
- **代码审查**：维护者将审查所有 pull request

## 行为准则

- 保持尊重和包容
- 专注于建设性反馈
- 帮助他人学习和成长
- 遵循项目的技术标准

感谢您为 Zedom 做出贡献！🚀