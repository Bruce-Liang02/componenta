# Componenta 组件形态数据 Schema

> 版本：v1.0
> 状态：已冻结（2026-09-13）

---

## 一、数据源结构

```
catalog/
├── PT.yaml      # 基础展示
├── IP.yaml      # 数据录入
├── VS.yaml      # 数据可视化
├── NV.yaml      # 导航与布局
├── WF.yaml      # 流程与业务编排
├── FB.yaml      # 状态与反馈
├── AU.yaml      # 权限与组织
├── AB.yaml      # 通用能力 / Hooks
└── IG.yaml      # 集成类
```

每个 YAML 文件包含一个类别的全部组件及其形态。

---

## 二、类别级 Schema

```yaml
# 类别文件顶层结构
category: string # 类别码，如 "PT"（必填）
categoryName: string # 类别中文名，如 "基础展示"（必填）
categoryNameEn: string # 类别英文名（选填，国际化预留）
description: string # 类别描述（选填）

components: # 该类别下的组件列表（必填）
  - component: ... # 见「组件级 Schema」
```

---

## 三、组件级 Schema

```yaml
# 组件结构
component: string # 组件标识，kebab-case，如 "pro-table"（必填）
name: string # 组件中文名，如 "高级表格"（必填）
nameEn: string # 组件英文名（选填）
description: string # 组件描述，1-2 句话（必填）
icon: string # 组件图标（选填，Ant Design icon 名）

variants: # 该组件的形态列表（必填，至少 1 个）
  - id: ... # 见「形态级 Schema」
```

---

## 四、形态级 Schema

### 4.1 完整字段定义

```yaml
# ===== 基础信息（必填） =====
id: string # 形态编号，如 "PT001"（必填，唯一）
name: string # 形态名称，如 "标准分页表格"（必填）
tagline: string # 一句话定位，最重要字段（必填）

# ===== 视觉信息（必填） =====
thumb: # 缩略图列表（必填，至少 1 张）
  - string # 路径，如 "/thumbs/PT001-1.png"

# ===== 选型信息（必填） =====
pros: # 优点列表（必填，3-5 条）
  - string
cons: # 缺点列表（必填，3-5 条，必须真实）
  - string
useCases: # 适用场景（必填，3-5 条）
  - string
antiCases: # 不适用场景（必填，2-4 条）
  - string

# ===== 关联信息（选填） =====
related: # 同组件其他形态编号（选填）
  - string # 如 ["PT002", "PT003"]

relatedComponents: # 跨组件关联（选填）
  - id: string # 关联形态编号
    name: string # 关联形态名称（便于显示）
    relation: string # 关系类型："常搭配使用" | "场景组合" | "替代方案"
    reason: string # 关联原因

# ===== 技术信息（选填） =====
tech: string # 技术实现参考，如 "Ant Design Table + useRequest"
dependencies: # 依赖列表
  - string # 如 ["antd ^5.0", "ahooks ^3.0"]
dimensions: # 形态维度标注
  layout: string # D1: standard-table / card-list / compact / grouped / tree
  interaction: string # D2: inline-edit / modal-edit / drawer-edit / batch-edit / readonly
  data: string # D3: frontend-page / backend-page / infinite-scroll / virtual-scroll / all-loaded
  visual: string # D4: traditional / modern / data-dense / card-based / minimal
  techGen: string # D5: antd / shadcn / tailwind-native / ag-grid / custom

# ===== 评级信息（选填） =====
complexity: number # 实现复杂度，1-5
rating: number # 推荐指数，1-5
performance: string # 性能指标："low" | "medium" | "high"
accessibility: string # 无障碍等级："basic" | "good" | "excellent"

# ===== 演示信息（选填） =====
demo: string # 交互演示路径，如 "/catalog/demo/PT001"
sourceCode: string # 源码链接
previewUrl: string # 在线预览链接

# ===== 状态与版本（必填） =====
status: string # 状态："active" | "deprecated"（必填）
versions: # 版本历史（选填）
  - version: string # 版本号，如 "1.0"
    date: string # 日期，YYYY-MM-DD
    changes: string # 变更说明

# ===== 废弃信息（仅 deprecated 时填写） =====
deprecatedNote: string # 废弃原因
replacedBy: string # 替代形态编号

# ===== 国际化（选填） =====
i18n: # 多语言
  en:
    name: string
    tagline: string
    pros: string[]
    cons: string[]
    useCases: string[]
    antiCases: string[]
  zh-TW:
    name: string
    tagline: string

# ===== 标签（选填） =====
tags: # 标签，用于搜索和筛选
  - string # 如 ["大数据量", "后端分页", "Ant Design"]
```

### 4.2 字段必填性汇总

| 字段                | 必填 | 类型     | 说明                        |
| ------------------- | ---- | -------- | --------------------------- |
| `id`                | ✅   | string   | 唯一编号                    |
| `name`              | ✅   | string   | 形态名称                    |
| `tagline`           | ✅   | string   | 一句话定位                  |
| `thumb`             | ✅   | string[] | 缩略图路径列表              |
| `pros`              | ✅   | string[] | 优点（3-5 条）              |
| `cons`              | ✅   | string[] | 缺点（3-5 条）              |
| `useCases`          | ✅   | string[] | 适用场景（3-5 条）          |
| `antiCases`         | ✅   | string[] | 不适用场景（2-4 条）        |
| `status`            | ✅   | string   | active / deprecated         |
| `related`           | ⭕   | string[] | 同组件其他形态              |
| `relatedComponents` | ⭕   | object[] | 跨组件关联                  |
| `tech`              | ⭕   | string   | 技术实现参考                |
| `dependencies`      | ⭕   | string[] | 依赖列表                    |
| `dimensions`        | ⭕   | object   | 形态维度                    |
| `complexity`        | ⭕   | number   | 复杂度 1-5                  |
| `rating`            | ⭕   | number   | 推荐指数 1-5                |
| `performance`       | ⭕   | string   | 性能 low/medium/high        |
| `accessibility`     | ⭕   | string   | 无障碍 basic/good/excellent |
| `demo`              | ⭕   | string   | 演示路径                    |
| `sourceCode`        | ⭕   | string   | 源码链接                    |
| `versions`          | ⭕   | object[] | 版本历史                    |
| `deprecatedNote`    | ⭕   | string   | 废弃原因                    |
| `replacedBy`        | ⭕   | string   | 替代编号                    |
| `i18n`              | ⭕   | object   | 多语言                      |
| `tags`              | ⭕   | string[] | 标签                        |

---

## 五、完整示例

```yaml
# catalog/PT.yaml
category: PT
categoryName: 基础展示
categoryNameEn: Presentation & Table
description: 数据展示、表格、列表、描述等基础展示类组件

components:
  - component: pro-table
    name: 高级表格
    description: 列表页数据展示与操作的核心组件，B 端最高频组件
    icon: TableOutlined

    variants:
      - id: PT001
        name: 标准分页表格
        tagline: 后端分页 + 工具栏 + 列设置，最通用的列表页形态
        thumb:
          - /thumbs/PT001-1.png
          - /thumbs/PT001-2.png
          - /thumbs/PT001-3.png
        pros:
          - 交互模式用户最熟悉，学习成本为零
          - 后端分页，天然支持大数据量
          - 列设置/密度切换等工程化能力成熟
        cons:
          - 移动端体验差，需另做适配
          - 首屏需等待请求，弱网下观感差
          - 字段少时显得过重
        useCases:
          - 数据量 1 万条以上的业务列表
          - 需要筛选、排序、批量操作的场景
          - 字段数 8 个以上，需要列显隐控制
        antiCases:
          - 字段数少于 5 个，表格显得过重
          - 强视觉呈现需求（应选卡片列表）
          - 移动端为主的场景
        related: [PT002, PT003, PT004]
        relatedComponents:
          - id: IP005
            name: 高级筛选表单
            relation: 常搭配使用
            reason: 表格筛选场景
          - id: IG003
            name: Excel 导出
            relation: 场景组合
            reason: 数据导出场景
        tech: 'Ant Design Table + useRequest'
        dependencies:
          - 'antd ^5.0'
          - 'ahooks ^3.0'
        dimensions:
          layout: standard-table
          interaction: readonly
          data: backend-page
          visual: traditional
          techGen: antd
        complexity: 2
        rating: 5
        performance: high
        accessibility: good
        demo: /catalog/demo/PT001
        status: active
        versions:
          - version: '1.0'
            date: '2026-09-13'
            changes: 初始版本
        tags:
          - 大数据量
          - 后端分页
          - Ant Design
          - 工具栏
          - 列设置
        i18n:
          en:
            name: Standard Paginated Table
            tagline: Backend pagination + toolbar + column settings, most common

      - id: PT002
        name: 卡片列表表格
        tagline: 视觉优先，字段较少，适合图文混合展示
        thumb:
          - /thumbs/PT002-1.png
        pros:
          - 视觉效果好，信息层次清晰
          - 适合图文混合展示
          - 响应式适配容易
        cons:
          - 不适合字段多的场景
          - 不支持复杂排序/筛选
          - 数据密度低
        useCases:
          - 字段数 3-5 个的列表
          - 需要缩略图或图标展示
          - 移动端和 PC 端共用
        antiCases:
          - 字段数超过 6 个
          - 需要批量操作
          - 数据量超过 500 条
        related: [PT001, PT003, PT004]
        tech: 'Ant Design Card + List'
        dimensions:
          layout: card-list
          interaction: readonly
          data: frontend-page
          visual: card-based
          techGen: antd
        complexity: 1
        rating: 4
        performance: medium
        accessibility: excellent
        status: active

      - id: PT003
        name: 紧凑数据表
        tagline: 高密度，专业用户，适合金融/数据密集型场景
        thumb:
          - /thumbs/PT003-1.png
        pros:
          - 信息密度高，一屏展示更多数据
          - 专业用户操作效率高
          - 支持键盘导航
        cons:
          - 新手上手成本高
          - 不适合普通用户
          - 移动端几乎不可用
        useCases:
          - 金融交易数据展示
          - 专业用户的高频操作场景
          - 数据分析师的数据浏览
        antiCases:
          - 面向普通用户的系统
          - 移动端场景
          - 字段需要详细说明的场景
        related: [PT001, PT002, PT004]
        tech: 'Ant Design Table + compact mode'
        dimensions:
          layout: compact
          interaction: readonly
          data: backend-page
          visual: data-dense
          techGen: antd
        complexity: 2
        rating: 3
        performance: high
        accessibility: basic
        status: active

      - id: PT004
        name: 虚拟滚动表格
        tagline: 十万级数据流畅滚动，前端渲染零延迟
        thumb:
          - /thumbs/PT004-1.png
        pros:
          - 支持超大数据量（10 万+）
          - 前端渲染，滚动零延迟
          - 内存占用可控
        cons:
          - 实现复杂度高
          - 行高固定，不支持动态高度
          - 首屏仍需加载全量数据
        useCases:
          - 数据量 10 万条以上
          - 需要流畅滚动体验
          - 日志/监控数据展示
        antiCases:
          - 数据量少于 1000 条（杀鸡用牛刀）
          - 需要动态行高
          - 后端分页已满足需求
        related: [PT001, PT002, PT003]
        tech: 'rc-virtual-list + Ant Design Table'
        dimensions:
          layout: standard-table
          interaction: readonly
          data: virtual-scroll
          visual: modern
          techGen: antd
        complexity: 4
        rating: 4
        performance: high
        accessibility: good
        status: active

  - component: search-form
    name: 查询表单
    description: 列表页顶部的筛选条件表单

    variants:
      - id: PT005
        name: 基础查询表单
        tagline: 单行展开，5 个以内筛选条件
        thumb:
          - /thumbs/PT005-1.png
        pros:
          - 简单直观，用户最熟悉
          - 实现成本低
          - 与表格配合成熟
        cons:
          - 筛选条件多时占空间
          - 不支持复杂筛选逻辑
        useCases:
          - 筛选条件 5 个以内
          - 简单关键词搜索
        antiCases:
          - 筛选条件超过 8 个
          - 需要高级筛选逻辑
        related: [PT006, PT007]
        tech: 'Ant Design Form'
        dimensions:
          layout: standard-table
          interaction: readonly
          data: all-loaded
          visual: traditional
          techGen: antd
        complexity: 1
        rating: 4
        status: active

      - id: PT006
        name: 高级查询表单
        tagline: 展开/收起，支持高级筛选条件组合
        thumb:
          - /thumbs/PT006-1.png
        pros:
          - 支持多条件组合
          - 展开/收起节省空间
          - 支持保存筛选方案
        cons:
          - 交互复杂度增加
          - 实现成本较高
        useCases:
          - 筛选条件 5-15 个
          - 需要条件组合（AND/OR）
          - 用户需保存筛选方案
        antiCases:
          - 筛选条件少于 3 个
        related: [PT005, PT007]
        tech: 'Ant Design Form + 自定义逻辑'
        complexity: 3
        rating: 4
        status: active

      - id: PT007
        name: 折叠查询表单
        tagline: 标签式筛选，轻量快速
        thumb:
          - /thumbs/PT007-1.png
        pros:
          - 轻量，不占太多空间
          - 适合快速切换
        cons:
          - 不支持复杂筛选
          - 不适合多条件组合
        useCases:
          - 状态/类型快速切换
          - 筛选逻辑简单
        antiCases:
          - 需要输入关键词搜索
          - 筛选条件复杂
        related: [PT005, PT006]
        tech: 'Ant Design Tabs + Tag'
        complexity: 1
        rating: 3
        status: active

  - component: descriptions
    name: 详细描述
    description: 详情信息的结构化展示

    variants:
      - id: PT008
        name: 基础详细描述
        tagline: 标签-值对的标准展示
        thumb:
          - /thumbs/PT008-1.png
        pros:
          - 结构清晰，信息层次分明
          - 用户最熟悉
        cons:
          - 字段多时页面过长
          - 不支持编辑
        useCases:
          - 详情页信息展示
          - 字段数 10-20 个
        antiCases:
          - 字段数少于 5 个
          - 需要编辑功能
        related: [PT009, PT010]
        tech: 'Ant Design Descriptions'
        complexity: 1
        rating: 4
        status: active

      - id: PT009
        name: 分栏详细描述
        tagline: 多列布局，节省纵向空间
        thumb:
          - /thumbs/PT009-1.png
        pros:
          - 节省纵向空间
          - 信息密度高
        cons:
          - 列数多时横向拥挤
          - 响应式适配需额外处理
        useCases:
          - 字段数 15-30 个
          - 详情页空间有限
        antiCases:
          - 移动端场景
          - 字段内容很长
        related: [PT008, PT010]
        tech: 'Ant Design Descriptions + Grid'
        complexity: 2
        rating: 3
        status: active

      - id: PT010
        name: 卡片化详细描述
        tagline: 分组卡片，视觉层次清晰
        thumb:
          - /thumbs/PT010-1.png
        pros:
          - 分组清晰，视觉层次好
          - 适合复杂信息结构
        cons:
          - 占用空间大
          - 实现成本较高
        useCases:
          - 信息需要分组展示
          - 详情页信息量大
        antiCases:
          - 字段数少于 10 个
          - 简单信息展示
        related: [PT008, PT009]
        tech: 'Ant Design Card + Descriptions'
        complexity: 2
        rating: 4
        status: active
```

---

## 六、校验规则

校验脚本 `scripts/validate-catalog.ts` 需检查：

### 6.1 必填字段

- `id`、`name`、`tagline`、`thumb`（至少 1 张）、`pros`（至少 3 条）、`cons`（至少 3 条）、`useCases`（至少 3 条）、`antiCases`（至少 2 条）、`status`

### 6.2 编号唯一性

- 全量 YAML 中 `id` 不得重复

### 6.3 编号连续性

- 同一组件的形态编号应连续（允许预留空号，但校验脚本应发出 warning）

### 6.4 关联有效性

- `related` 中的编号必须存在于 catalog 中
- `relatedComponents` 中的 `id` 必须存在于 catalog 中
- `replacedBy` 中的编号必须存在于 catalog 中

### 6.5 枚举值校验

- `status` 只能是 `active` | `deprecated`
- `performance` 只能是 `low` | `medium` | `high`
- `accessibility` 只能是 `basic` | `good` | `excellent`
- `complexity` 范围 1-5
- `rating` 范围 1-5
- `dimensions.*` 的值必须在枚举范围内

### 6.6 deprecated 形态

- `status: deprecated` 时，`deprecatedNote` 为必填

### 6.7 缩略图存在性

- `thumb` 中的每个路径，对应文件必须存在（构建期检查）

---

## 七、派生产物

### 7.1 catalog.json

```bash
pnpm build-catalog
```

将 9 个 YAML 合并为一个 `catalog.json`，供：

- 站内运行时读取
- 外部脚本/AI 读取
- 导出为其他格式

### 7.2 cheatsheet.md

纯文本编号速查表，便于复制到需求文档。

### 7.3 componenta-schemas/*.json

每个形态生成对应的 PageSchema 配置片段，供 Componenta 直接使用。

---

## 八、数据文件格式约定

- 使用 YAML 格式（可读性优于 JSON）
- UTF-8 编码
- 缩进 2 空格
- 字符串不加引号（除非包含特殊字符）
- 数组项使用 `- ` 前缀
- 注释使用 `# `
