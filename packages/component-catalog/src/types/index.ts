/**
 * 组件形态选型目录 - 类型定义
 *
 * 对应 catalog/*.yaml 的数据结构
 */

// ===== 形态维度 =====

export interface VariantDimensions {
  /** D1 布局形态 */
  layout?: string;
  /** D2 交互形态 */
  interaction?: string;
  /** D3 数据策略 */
  data?: string;
  /** D4 视觉风格 */
  visual?: string;
  /** D5 技术代际 */
  techGen?: string;
}

// ===== 跨组件关联 =====

export interface RelatedComponent {
  /** 关联形态编号 */
  id: string;
  /** 关联形态名称 */
  name: string;
  /** 关系类型 */
  relation: '常搭配使用' | '场景组合' | '替代方案';
  /** 关联原因 */
  reason: string;
}

// ===== 版本历史 =====

export interface VersionRecord {
  /** 版本号 */
  version: string;
  /** 日期 YYYY-MM-DD */
  date: string;
  /** 变更说明 */
  changes: string;
}

// ===== 国际化 =====

export interface VariantI18n {
  name?: string;
  tagline?: string;
  pros?: string[];
  cons?: string[];
  useCases?: string[];
  antiCases?: string[];
}

export interface I18nMap {
  en?: VariantI18n;
  'zh-TW'?: VariantI18n;
  [locale: string]: VariantI18n | undefined;
}

// ===== 形态（Variant）=====

export type VariantStatus = 'active' | 'deprecated';
export type PerformanceLevel = 'low' | 'medium' | 'high';
export type AccessibilityLevel = 'basic' | 'good' | 'excellent';

export interface ComponentVariant {
  // 基础信息（必填）
  id: string;
  name: string;
  tagline: string;

  // 视觉信息（必填）
  thumb: string[];

  // 选型信息（必填）
  pros: string[];
  cons: string[];
  useCases: string[];
  antiCases: string[];

  // 状态（必填）
  status: VariantStatus;

  // 关联信息（选填）
  related?: string[];
  relatedComponents?: RelatedComponent[];

  // 技术信息（选填）
  tech?: string;
  dependencies?: string[];
  dimensions?: VariantDimensions;

  // 评级（选填）
  complexity?: number;
  rating?: number;
  performance?: PerformanceLevel;
  accessibility?: AccessibilityLevel;

  // 演示（选填）
  demo?: string;
  sourceCode?: string;
  previewUrl?: string;

  // 版本（选填）
  versions?: VersionRecord[];

  // 废弃信息
  deprecatedNote?: string;
  replacedBy?: string;

  // 国际化（选填）
  i18n?: I18nMap;

  // 标签（选填）
  tags?: string[];
}

// ===== 组件（Component）=====

export interface ComponentDefinition {
  component: string;
  name: string;
  nameEn?: string;
  description: string;
  icon?: string;
  variants: ComponentVariant[];
}

// ===== 类别（Category）=====

export interface CategoryData {
  category: string;
  categoryName: string;
  categoryNameEn?: string;
  description?: string;
  components: ComponentDefinition[];
}

// ===== 全量目录（Catalog）=====

export interface Catalog {
  categories: CategoryData[];
}

// ===== 辅助函数类型 =====

/** 从全量目录中按 ID 查找形态 */
export type VariantFinder = (id: string) => ComponentVariant | undefined;

/** 按类别码查找类别 */
export type CategoryFinder = (code: string) => CategoryData | undefined;

/** 按组件标识查找组件 */
export type ComponentFinder = (component: string) => ComponentDefinition | undefined;
