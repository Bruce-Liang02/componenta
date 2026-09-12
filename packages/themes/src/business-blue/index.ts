/**
 * 商务蓝主题包
 *
 * 风格：深蓝主色，更稳重的商务感，适合政企/金融场景。
 */
import type { ThemePack } from '@componenta/core';

export const businessBlue: ThemePack = {
  name: 'business-blue',
  version: '1.0.0',
  displayName: '商务蓝',
  description: '深蓝色主色，稳重商务风格，适合政企、金融、大型企业场景。',
  tokens: {
    colorPrimary: '#0052d9',
    colorInfo: '#0052d9',
    colorSuccess: '#2ba471',
    colorWarning: '#e37318',
    colorError: '#d54941',
    borderRadius: 4,
    fontSize: 14,
    fontFamily: "'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif",
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f0f2f5',
    colorText: 'rgba(0, 0, 0, 0.9)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.6)',
  },
  componentVariants: {
    List: 'AntList',
    Form: 'AntForm',
    Chart: 'Chart',
    Card: 'Card',
  },
  layoutTemplate: 'dashboard',
  assets: {
    logo: '/assets/themes/business-blue/logo.svg',
  },
};

export default businessBlue;
