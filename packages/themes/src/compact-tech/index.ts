/**
 * 紧凑科技风主题包
 *
 * 风格：紧凑字号、大圆角、紫色系主色，科技感强。
 */
import type { ThemePack } from '@componenta/core';

export const compactTech: ThemePack = {
  name: 'compact-tech',
  version: '1.0.0',
  displayName: '紧凑科技风',
  description: '紧凑排版、科技感配色，适合数据密集型或科技类后台。',
  tokens: {
    colorPrimary: '#722ed1',
    colorInfo: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
    colorBgContainer: '#fafafa',
    colorBgLayout: '#f0f0f5',
    colorText: 'rgba(0, 0, 0, 0.9)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.55)',
  },
  componentVariants: {
    List: 'AntList',
    Form: 'AntForm',
    Chart: 'Chart',
    Card: 'Card',
  },
  layoutTemplate: 'dashboard',
};

export default compactTech;
