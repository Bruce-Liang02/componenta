/**
 * 主题 Context
 *
 * 提供当前主题包信息，包括：
 * - 当前 ThemePack
 * - 当前生效的 tokens
 * - 当前组件变体映射
 * - 当前布局模板
 * - 切换方法
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ThemePack } from './types';
import { globalThemeRegistry, type ThemePackRegistry } from './ThemePackRegistry';

export interface ThemeContextValue {
  /** 当前主题包 */
  currentPack: ThemePack;
  /** 当前主题名 */
  currentName: string;
  /** 当前 Ant Design tokens */
  tokens: ThemePack['tokens'];
  /** 当前组件变体映射 */
  componentVariants: Record<string, string>;
  /** 当前布局模板 */
  currentLayoutTemplate?: string;
  /** 切换主题 */
  setTheme: (name: string) => void;
  /** 列出可用主题 */
  listThemes: () => ThemePack[];
  /** 切换事件订阅 */
  subscribe: (cb: (pack: ThemePack) => void) => () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  /** 主题包注册表（默认使用全局） */
  registry?: ThemePackRegistry;
  /** 初始主题名 */
  initialTheme?: string;
  /** 持久化 key（localStorage），传 false 关闭 */
  storageKey?: string | false;
  children: React.ReactNode;
}

const DEFAULT_STORAGE_KEY = 'componenta:theme';

export function ThemeProvider({
  registry = globalThemeRegistry,
  initialTheme,
  storageKey = DEFAULT_STORAGE_KEY,
  children,
}: ThemeProviderProps) {
  const getDefaultName = useCallback(() => {
    if (initialTheme && registry.has(initialTheme)) return initialTheme;
    const def = registry.getDefault();
    return def?.name ?? registry.listNames()[0] ?? 'default-light';
  }, [initialTheme, registry]);

  const getStoredName = useCallback((): string | null => {
    if (storageKey === false) return null;
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }, [storageKey]);

  const [currentName, setCurrentName] = useState<string>(() => {
    return getStoredName() ?? getDefaultName();
  });

  const [listeners] = useState<Set<(pack: ThemePack) => void>>(() => new Set());

  const currentPack = useMemo<ThemePack>(() => {
    const pack = registry.get(currentName);
    if (!pack) {
      const fallback = registry.getDefault();
      if (!fallback) {
        throw new Error(
          `[ThemeProvider] No theme packs registered, and "${currentName}" not found`,
        );
      }
      return fallback;
    }
    return pack;
  }, [currentName, registry]);

  const setTheme = useCallback(
    (name: string) => {
      if (!registry.has(name)) {
        console.warn(`[ThemeProvider] Unknown theme: "${name}"`);
        return;
      }
      setCurrentName((prev) => {
        if (prev === name) return prev;
        if (storageKey !== false) {
          try {
            localStorage.setItem(storageKey, name);
          } catch {
            /* ignore */
          }
        }
        const pack = registry.get(name);
        if (pack) listeners.forEach((cb) => cb(pack));
        return name;
      });
    },
    [registry, storageKey, listeners],
  );

  const subscribe = useCallback(
    (cb: (pack: ThemePack) => void) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    [listeners],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      currentPack,
      currentName,
      tokens: currentPack.tokens,
      componentVariants: currentPack.componentVariants ?? {},
      currentLayoutTemplate: currentPack.layoutTemplate,
      setTheme,
      listThemes: () => registry.list(),
      subscribe,
    }),
    [currentPack, currentName, setTheme, registry, subscribe],
  );

  // 监听 storageKey 变化（跨 tab 同步）
  useEffect(() => {
    if (storageKey === false) return;
    const handler = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue && registry.has(e.newValue)) {
        setCurrentName(e.newValue);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [storageKey, registry]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}
