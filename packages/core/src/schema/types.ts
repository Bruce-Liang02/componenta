/**
 * PageSchema v0.1 类型定义
 *
 * Componenta 的页面描述语言，所有页面通过此 Schema 驱动渲染。
 * 设计原则：
 * - 数据驱动，声明式描述
 * - 支持组件实现替换（componentImpl）
 * - 支持数据源绑定
 * - 支持主题包覆盖
 */

/** 布局模板类型 */
export type LayoutType = 'fixed-header' | 'sidebar-main' | 'dashboard' | 'blank';

/** 组件类型：注册表中登记的业务组件类别 */
export type ComponentType = 'List' | 'Form' | 'Chart' | 'Card' | 'Custom' | 'Layout' | 'Text';

/** 数据源声明 */
export interface DataSource {
  /** 后端 API 路径，如 /api/orders */
  api?: string;
  /** 请求方法，默认 GET */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** 请求参数 */
  params?: Record<string, unknown>;
  /** 数据刷新间隔（毫秒），0 或不设置表示不自动刷新 */
  refreshInterval?: number;
}

/** 区块 Schema：描述页面上一个可渲染的最小单元 */
export interface BlockSchema {
  /** 区块唯一 ID，用于跨区块通信或状态共享 */
  id: string;
  /** 组件类型 */
  componentType: ComponentType;
  /** 具体实现变体（可选），未指定时使用注册表默认实现 */
  componentImpl?: string;
  /** 传递给组件的 props */
  props?: Record<string, unknown>;
  /** 数据源绑定 */
  dataSource?: DataSource;
  /** 嵌套子区块（v0.1 仅支持 1 层嵌套） */
  children?: BlockSchema[];
  /** 区块可见性条件（未来扩展：v0.2 支持表达式） */
  visible?: boolean | string;
}

/** 区域 Schema：页面中的一个命名插槽，包含多个区块 */
export interface RegionSchema {
  /** 区域名，如 'header' / 'sidebar' / 'main' / 'footer' */
  name: string;
  /** 该区域内的区块列表（顺序渲染） */
  blocks: BlockSchema[];
}

/** 布局 Schema */
export interface LayoutSchema {
  /** 布局类型 */
  type: LayoutType;
  /** 布局实现变体（可选） */
  impl?: string;
  /** 布局 props */
  props?: Record<string, unknown>;
  /** 区域定义 */
  regions: RegionSchema[];
}

/** 完整的页面 Schema */
export interface PageSchema {
  /** 页面唯一 ID */
  id: string;
  /** Schema 版本号 */
  version: string;
  /** 页面标题 */
  title?: string;
  /** 页面描述 */
  description?: string;
  /** 可覆盖全局主题包（可选） */
  themePack?: string;
  /** 页面布局 */
  layout: LayoutSchema;
  /** 页面级动作定义（未来扩展） */
  actions?: ActionSchema[];
}

/** 动作 Schema（v0.2 扩展预留） */
export interface ActionSchema {
  id: string;
  type: string;
  payload?: Record<string, unknown>;
}

/** 应用级 Schema（聚合多个页面） */
export interface AppSchema {
  id: string;
  version: string;
  defaultThemePack?: string;
  pages: Record<string, PageSchema>;
  navigation?: NavigationSchema;
}

/** 导航 Schema */
export interface NavigationSchema {
  mode: 'sidebar' | 'top' | 'mixed';
  items: NavigationItem[];
}

export interface NavigationItem {
  key: string;
  title: string;
  icon?: string;
  pageId?: string;
  children?: NavigationItem[];
}
