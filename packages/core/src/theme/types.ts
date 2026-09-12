/**
 * 主题包（Theme Pack）类型定义
 *
 * 一个主题包 = 三层配置：
 * 1. tokens：Ant Design Design Token（颜色/字号/间距/圆角...）
 * 2. componentVariants：组件类型 → 实现变体的默认映射
 * 3. layoutTemplate：默认布局模板
 */
import type { GlobalToken } from 'antd/es/theme/interface';

/** Ant Design Design Token 的部分覆盖 */
export type DesignTokens = Partial<GlobalToken>;

/** 主题包声明 */
export interface ThemePack {
  /** 主题唯一标识（kebab-case） */
  name: string;
  /** 版本 */
  version: string;
  /** 显示名称 */
  displayName: string;
  /** 主题描述 */
  description?: string;
  /** 预览图 URL */
  preview?: string;
  /** Ant Design Design Token 覆盖 */
  tokens: DesignTokens;
  /** 组件实现映射（可选）：type → impl name */
  componentVariants?: Record<string, string>;
  /** 默认布局模板 */
  layoutTemplate?: string;
  /** 资源：logo / 背景图等 */
  assets?: {
    logo?: string;
    favicon?: string;
    backgroundImage?: string;
  };
}

/** 主题加载器选项 */
export interface ThemeLoaderOptions {
  /** 默认主题包名 */
  defaultTheme?: string;
  /** 持久化 key（localStorage） */
  storageKey?: string;
}

/** 主题切换事件 */
export interface ThemeChangeEvent {
  from: string;
  to: string;
  pack: ThemePack;
}
