# PageSchema v0.1 规范

## 1. 概述

PageSchema 是 Componenta 的页面描述语言。所有页面通过此 Schema 驱动渲染，支持组件实现替换、数据源绑定、主题包覆盖。

## 2. 顶层结构

```typescript
interface PageSchema {
  id: string; // 页面唯一 ID
  version: string; // Schema 版本号，如 "0.1"
  title?: string; // 页面标题
  description?: string; // 页面描述
  themePack?: string; // 可覆盖全局主题包
  layout: LayoutSchema; // 页面布局
  actions?: ActionSchema[]; // 页面级动作定义（v0.2）
}
```

## 3. 布局

```typescript
interface LayoutSchema {
  type: 'fixed-header' | 'sidebar-main' | 'dashboard' | 'blank';
  impl?: string; // 布局实现变体（可选）
  props?: Record<string, any>;
  regions: RegionSchema[]; // 区域定义
}

interface RegionSchema {
  name: string; // 区域名，如 'header'/'sidebar'/'main'/'footer'
  blocks: BlockSchema[]; // 该区域内的区块列表
}
```

## 4. 区块

```typescript
interface BlockSchema {
  id: string; // 区块唯一 ID
  componentType: ComponentType; // 组件类型
  componentImpl?: string; // 具体实现变体（可选）
  props?: Record<string, any>; // 传递给组件的 props
  dataSource?: DataSource; // 数据源绑定
  children?: BlockSchema[]; // 嵌套子区块（v0.1 仅 1 层）
  visible?: boolean | string; // 可见性（字符串表达式留给 v0.2）
}

type ComponentType = 'List' | 'Form' | 'Chart' | 'Card' | 'Custom' | 'Layout' | 'Text';
```

## 5. 数据源

```typescript
interface DataSource {
  api?: string; // 后端 API 路径
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  refreshInterval?: number; // 自动刷新间隔（毫秒）
}
```

## 6. 示例

```json
{
  "id": "dashboard-demo",
  "version": "0.1",
  "title": "仪表盘",
  "layout": {
    "type": "dashboard",
    "regions": [
      {
        "name": "stats",
        "blocks": [
          {
            "id": "stat-orders",
            "componentType": "Card",
            "props": {
              "title": "今日订单",
              "statistic": { "value": 1234, "trend": "up" }
            }
          }
        ]
      },
      {
        "name": "chart",
        "blocks": [
          {
            "id": "chart-sales",
            "componentType": "Chart",
            "dataSource": { "api": "/api/stats/sales", "refreshInterval": 60000 },
            "props": { "title": "销售趋势", "height": 320 }
          }
        ]
      },
      {
        "name": "list",
        "blocks": [
          {
            "id": "list-orders",
            "componentType": "List",
            "componentImpl": "AntList",
            "dataSource": { "api": "/api/orders" },
            "props": { "title": "最近订单", "bordered": true }
          }
        ]
      }
    ]
  }
}
```

## 7. 版本演进

| 版本 | 变化                                  |
| ---- | ------------------------------------- |
| v0.1 | 基础 Schema，1 层嵌套，visible 仅布尔 |
| v0.2 | 表达式可见性、条件渲染、动作绑定      |
| v0.3 | 区块间通信（事件总线）、数据源聚合    |
| v1.0 | 完整低代码设计器兼容                  |

## 8. 校验

使用 zod 运行时校验，详见 `@componenta/core/schema/validator.ts`。
