/**
 * 字符串工具
 */

/** kebab-case 转 camelCase */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

/** camelCase 转 kebab-case */
export function camelToKebab(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

/** 首字母大写 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** 生成短 ID（用于测试/demo） */
export function shortId(prefix = ''): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return prefix ? `${prefix}-${rand}` : rand;
}

/** 截断字符串 */
export function truncate(str: string, maxLen: number, suffix = '...'): string {
  if (!str) return str;
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - suffix.length) + suffix;
}
