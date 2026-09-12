/**
 * 主题包注册表
 *
 * 管理所有已注册的主题包，支持按名称加载。
 */
import type { ThemePack } from './types';

export class ThemePackRegistry {
  private packs = new Map<string, ThemePack>();
  private defaultName: string | null = null;

  /** 注册一个主题包 */
  register(pack: ThemePack, asDefault = false): void {
    if (!pack.name) {
      throw new Error('[ThemePackRegistry] ThemePack must have a name');
    }
    this.packs.set(pack.name, pack);
    if (asDefault || this.defaultName === null) {
      this.defaultName = pack.name;
    }
  }

  /** 按名称获取主题包 */
  get(name: string): ThemePack | undefined {
    return this.packs.get(name);
  }

  /** 获取默认主题包 */
  getDefault(): ThemePack | undefined {
    if (!this.defaultName) return undefined;
    return this.packs.get(this.defaultName);
  }

  /** 设置默认主题 */
  setDefault(name: string): void {
    if (!this.packs.has(name)) {
      throw new Error(`[ThemePackRegistry] Unknown theme pack: "${name}"`);
    }
    this.defaultName = name;
  }

  /** 列出所有已注册主题包 */
  list(): ThemePack[] {
    return Array.from(this.packs.values());
  }

  /** 列出所有主题名 */
  listNames(): string[] {
    return Array.from(this.packs.keys());
  }

  /** 是否已注册 */
  has(name: string): boolean {
    return this.packs.has(name);
  }
}

/** 全局主题包注册表单例 */
export const globalThemeRegistry = new ThemePackRegistry();
