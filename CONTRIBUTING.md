# 贡献指南

感谢你对 Componenta 项目的关注！本文档将帮助你快速上手贡献。

## 开发环境搭建

### 1. 安装工具

```bash
# 启用 pnpm（Node 24 内置 corepack）
corepack enable pnpm

# 确认版本
node -v      # >= 20
pnpm -v      # >= 9
java -v      # >= 17（后端开发需要）
```

### 2. 拉取代码 & 安装依赖

```bash
git clone <repo>
cd componenta
pnpm install

# 后端依赖（Gradle 会自动下载）
cd servers && ./gradlew build
```

### 3. 启动开发

```bash
# 前端
pnpm dev

# 后端
cd servers && ./gradlew :componenta-server:bootRun
```

## 开发规范

### 提交信息

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**type 取值**：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响逻辑）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建/依赖
- `ci`: CI 配置
- `chore`: 杂项
- `revert`: 回滚

**scope 规范**（kebab-case）：`core` / `components` / `themes` / `admin-shell` / `web-admin` / `server` / `docs`

示例：

```
feat(core): add component registry with variant resolution
fix(themes): fix token cascade on dark theme switch
docs(schema-spec): update BlockSchema v0.1
```

### 代码风格

- 前端：ESLint 9 flat config + Prettier，提交时自动 lint-staged
- 后端：Spotless + Checkstyle，提交前 `./gradlew spotlessCheck`
- 所有代码使用 2 空格缩进（Java/Kotlin 4 空格）

### 测试

- 前端：Vitest，新组件/核心模块必须有单元测试
- 后端：JUnit 5 + Mockito，API/Service 层测试覆盖

### 组件开发规范

- 所有组件必须在 `@componenta/core` 中注册，遵循 `ComponentContract` props 契约
- 组件变体必须实现相同的 props interface
- 每个主题包必须通过 `ThemePackValidator` 校验

## PR 流程

1. 从 `main` 创建 feature 分支：`git checkout -b feat/xxx`
2. 开发、提交（husky + commitlint 会自动校验）
3. 推送前本地测试：`pnpm lint && pnpm test && pnpm build`
4. 发起 PR，填写变更说明
5. CI 通过后，由 maintainer review

## 目录结构说明

见 [架构设计文档](./docs/architecture.md)。
