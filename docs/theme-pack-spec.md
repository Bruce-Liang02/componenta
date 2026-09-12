# 主题包（Theme Pack）规范

## 1. 概述

一个主题包包含三层配置：

1. **tokens**：Ant Design Design Token 覆盖（颜色/字号/间距/圆角）
2. **componentVariants**：组件类型 → 实现变体的默认映射
3. **layoutTemplate**：默认布局模板

切换主题包 = 一次性替换这三层，所有页面响应。

## 2. 类型定义

```typescript
interface ThemePack {
  name: string; // 主题唯一标识（kebab-case）
  version: string; // 版本号
  displayName: string; // 显示名称
  description?: string; // 主题描述
  preview?: string; // 预览图 URL
  tokens: DesignTokens; // Ant Design Design Token 覆盖
  componentVariants?: Record<string, string>; // 组件实现映射
  layoutTemplate?: string; // 默认布局模板
  assets?: {
    // 资源
    logo?: string;
    favicon?: string;
    backgroundImage?: string;
  };
}
```

## 3. 示例

```typescript
// themes/business-blue/index.ts
export const businessBlue: ThemePack = {
  name: 'business-blue',
  version: '1.0.0',
  displayName: '商务蓝',
  description: '深蓝色主色，稳重商务风格，适合政企、金融场景。',
  tokens: {
    colorPrimary: '#0052d9',
    borderRadius: 4,
    fontSize: 14,
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f0f2f5',
  },
  componentVariants: {
    List: 'AntList',
    Form: 'AntForm',
    Chart: 'Chart',
    Card: 'Card',
  },
  layoutTemplate: 'dashboard',
  assets: {
    logo: '/assets/themes/business-blue/logo.svg',
  },
};
```

## 4. 内置主题包

| 名称            | displayName | 主色    | 圆角 | 字号 |
| --------------- | ----------- | ------- | ---- | ---- |
| `default-light` | 默认亮色    | #1677ff | 6px  | 14px |
| `business-blue` | 商务蓝      | #0052d9 | 4px  | 14px |
| `default-dark`  | 默认暗色    | #1668dc | 6px  | 14px |
| `compact-tech`  | 紧凑科技风  | #722ed1 | 8px  | 12px |

## 5. 切换机制

### 5.1 用户切换

- 通过 `<ThemeSwitcher />` 组件选择主题包
- 选择结果持久化到 `localStorage['componenta:theme']`
- 跨 tab 通过 `storage` 事件同步

### 5.2 页面覆盖

- 页面 Schema 中的 `themePack` 字段可覆盖全局主题
- 仅影响该页面，离开后恢复全局设置

### 5.3 用户偏好同步

- 登录用户的主題偏好同步到后端（`PUT /api/admin/users/{id}/preference`）
- 下次登录自动应用

## 6. 自定义主题包

创建自定义主题包：

```typescript
// packages/themes/src/my-theme/index.ts
import type { ThemePack } from '@componenta/core';

export const myTheme: ThemePack = {
  name: 'my-theme',
  version: '1.0.0',
  displayName: '我的主题',
  tokens: {
    colorPrimary: '#ff4d4f',
    borderRadius: 8,
  },
  componentVariants: {
    List: 'CardList', // 用卡片列表替换默认表格
  },
  layoutTemplate: 'sidebar-main',
};
```

注册：

```typescript
import { globalThemeRegistry } from '@componenta/core';
import { myTheme } from '@componenta/themes/my-theme';
globalThemeRegistry.register(myTheme);
```

## 7. 设计原则

- **Token 优先**：能用 Token 解决的不要用组件变体
- **组件变体保持 Props 一致**：所有变体必须实现相同的 Props 契约
- **布局模板可组合**：布局模板内可包含多个区域，区域间可嵌套
- **资源外部化**：logo、背景图等资源通过 URL 引用，支持 CDN
