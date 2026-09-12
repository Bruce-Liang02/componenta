/**
 * 全局常量
 */

/** 项目版本号 */
export const COMPONENTA_VERSION = '0.1.0';

/** 默认 API 基础路径 */
export const API_BASE_PATH = '/api';

/** LocalStorage keys */
export const STORAGE_KEYS = {
  THEME: 'componenta:theme',
  TOKEN: 'componenta:token',
  LOCALE: 'componenta:locale',
  USER: 'componenta:user',
} as const;

/** 默认分页 */
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/** 支持的语言 */
export const LOCALES = ['zh-CN', 'en-US'] as const;
export type Locale = (typeof LOCALES)[number];

/** 默认 locale */
export const DEFAULT_LOCALE: Locale = 'zh-CN';
