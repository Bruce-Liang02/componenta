<div align="center">

# 🧩 Componenta（组件塔）

**Schema 驱动的 B 端组件化业务管理平台**

[![pnpm](https://img.shields.io/badge/pnpm-9.15%2B-blue)](https://pnpm.io)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6db33f)](https://spring.io/projects/spring-boot)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5-1677ff)](https://ant.design)

</div>

---

Componenta（组件塔）是一套面向复杂 B 端业务场景的组件化平台，核心理念是 **"组件可插拔、主题可切换、引擎可独立"**。

## ✨ 核心特性

- 🎨 **主题包系统**：Token（配色/字号） + 组件变体 + 布局模板，三层一体的主题切换
- 🔌 **Schema 驱动渲染**：页面由 JSON Schema 描述，支持运行时动态切换组件实现
- 🧩 **组件注册表**：同一位置（如列表、表单）可注册多种实现，按场景替换
- ⚙️ **引擎解耦**：流程、表单、权限、AI 等服务引擎独立演进，通过 API 协同
- 🚀 **模块化单体 → 渐进微服务**：单体起步，按边界逐步拆分

## 📦 仓库结构

```
componenta/
├── packages/        # 前端共享包
│   ├── core/        # @componenta/core - Schema 引擎 + 组件注册表 + 主题加载器
│   ├── components/  # @componenta/components - 基础业务组件（List/Form/Chart/Card）
│   ├── themes/      # @componenta/themes - 主题包集合
│   ├── shared/      # @componenta/shared - 工具函数、hooks、常量
│   └── admin-shell/ # @componenta/admin-shell - 系统管理端外壳（Layout/路由/菜单）
├── apps/            # 可独立运行的应用
│   ├── web-admin/   # 管理后台（核心应用）
│   └── portal/      # 门户端（预留）
├── servers/         # 后端 Spring Boot 多模块
│   ├── componenta-server/          # 启动模块
│   ├── componenta-common/          # 通用工具
│   ├── componenta-auth/            # 认证授权
│   ├── componenta-system/          # 系统管理
│   ├── componenta-admin/           # 配置管理
│   └── componenta-engine-starter/  # 引擎接入
├── docs/            # 架构与规范文档
└── examples/        # Demo 示例
```

## 🏗️ 技术栈

| 层       | 选型                                         |
| -------- | -------------------------------------------- |
| 前端框架 | React 18 + TypeScript 5.7                    |
| UI 基线  | Ant Design 5（Design Token）                 |
| 前端构建 | Vite 7                                       |
| Monorepo | pnpm 9 workspace + Turborepo                 |
| 后端框架 | Java 17 + Spring Boot 3.2                    |
| 后端构建 | Gradle (Kotlin DSL) 多模块                   |
| 认证     | Sa-Token                                     |
| 代码规范 | ESLint 9 + Prettier + Stylelint + commitlint |

## 🚀 快速开始

### 前置条件

- Node.js >= 20.0.0
- pnpm >= 9.0.0（可通过 `corepack enable pnpm` 启用）
- JDK 17+（后端开发需要）

### 安装与启动

```bash
# 1. 启用 pnpm（如未启用）
corepack enable pnpm

# 2. 安装依赖
pnpm install

# 3. 启动前端开发服务
pnpm dev

# 4. 启动后端（需先安装 JDK 17）
cd servers && ./gradlew :componenta-server:bootRun

# 5. 访问
#    Web Admin: http://localhost:5173
#    Backend:   http://localhost:8080
#    Swagger:   http://localhost:8080/swagger-ui.html
```

### 构建

```bash
# 全量构建（前端 + 后端）
pnpm build
cd servers && ./gradlew build

# 仅前端
pnpm build

# 仅后端
cd servers && ./gradlew build
```

## 📚 文档

- [架构设计](./docs/architecture.md)
- [PageSchema v0.1 规范](./docs/schema-spec.md)
- [主题包规范](./docs/theme-pack-spec.md)
- [贡献指南](./CONTRIBUTING.md)

## 🗺️ 路线图

| 阶段           | 内容                                     |
| -------------- | ---------------------------------------- |
| **Phase 0** ✅ | 脚手架 + 组件库 + 主题包 + Schema 渲染器 |
| **Phase 1**    | 表单引擎 + 权限底座 + 系统管理           |
| **Phase 2**    | 流程引擎 + 报表引擎 + 规则引擎           |
| **Phase 3**    | 多端协同（APP/小程序）+ AI 服务集成      |
| **Phase 4**    | 生态扩展 + 第三方对接 + 数据中台         |

## 📄 许可证

MIT

---

**Componenta** — 让复杂 B 端系统的演进像搭积木一样可控。
