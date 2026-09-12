/**
 * 主题包模块公共导出
 */
import type { ThemePackRegistry } from '@componenta/core';
import { defaultLight } from './default-light';
import { businessBlue } from './business-blue';
import { defaultDark } from './default-dark';
import { compactTech } from './compact-tech';

export { defaultLight } from './default-light';
export { businessBlue } from './business-blue';
export { defaultDark } from './default-dark';
export { compactTech } from './compact-tech';
export { ThemeSwitcher } from './switcher';

/** 所有内置主题包 */
export const builtinThemes = [defaultLight, businessBlue, defaultDark, compactTech] as const;

/** 一次性注册所有内置主题包到指定 registry */
export function registerAllThemes(registry: ThemePackRegistry): void {
  builtinThemes.forEach((pack, index) => {
    registry.register(pack, index === 0);
  });
}
