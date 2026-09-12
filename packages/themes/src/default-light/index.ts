/**
 * 默认亮色主题包
 *
 * 风格：Ant Design 官方默认风格，蓝色主色，适合通用 B 端场景。
 */
import type { ThemePack } from '@componenta/core';

export const defaultLight: ThemePack = {
  name: 'default-light',
  version: '1.0.0',
  displayName: '默认亮色',
  description: '基于 Ant Design 默认风格，清爽明亮，适用于大多数 B 端管理后台。',
  tokens: {
    colorPrimary: '#1677ff',
    colorInfo: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    borderRadius: 6,
    fontSize: 14,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorText: 'rgba(0, 0, 0, 0.88)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
  },
  componentVariants: {
    List: 'AntList',
    Form: 'AntForm',
    Chart: 'Chart',
    Card: 'Card',
  },
  layoutTemplate: 'dashboard',
  assets: {
    logo: '/assets/themes/default-light/logo.svg',
  },
};

export default defaultLight;
