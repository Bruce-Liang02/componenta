/**
 * 全局状态 store
 *
 * 基于 zustand，管理应用级状态：
 * - 当前用户
 * - 当前主题
 * - locale
 * - 全局加载状态
 */
import { create } from 'zustand';

export interface UserInfo {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  roles: string[];
}

export interface AppState {
  // 用户
  currentUser: UserInfo | null;
  setCurrentUser: (user: UserInfo | null) => void;
  // 主题（与 ThemeContext 同步，这里做状态冗余用于非组件代码访问）
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  // Locale
  locale: 'zh-CN' | 'en-US';
  setLocale: (locale: 'zh-CN' | 'en-US') => void;
  // 全局加载
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  currentTheme: 'default-light',
  setCurrentTheme: (theme) => set({ currentTheme: theme }),

  locale: 'zh-CN',
  setLocale: (locale) => set({ locale }),

  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));
