/**
 * 默认暗色主题包
 */
import type { ThemePack } from '@componenta/core';

export const defaultDark: ThemePack = {
  name: 'default-dark',
  version: '1.0.0',
  displayName: '默认暗色',
  description: '暗色模式，适合夜间或低光环境使用。',
  tokens: {
    colorPrimary: '#1668dc',
    colorInfo: '#1668dc',
    colorSuccess: '#49aa19',
    colorWarning: '#d89614',
    colorError: '#dc4446',
    borderRadius: 6,
    fontSize: 14,
    colorBgContainer: '#141414',
    colorBgLayout: '#000000',
    colorText: 'rgba(255, 255, 255, 0.85)',
    colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
  } as ThemePack['tokens'],
  componentVariants: {
    List: 'AntList',
    Form: 'AntForm',
    Chart: 'Chart',
    Card: 'Card',
  },
  layoutTemplate: 'dashboard',
};

export default defaultDark;
