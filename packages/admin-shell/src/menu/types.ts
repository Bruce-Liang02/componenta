/**
 * 菜单项定义
 */
import type { ReactNode } from 'react';

export interface MenuItem {
  key: string;
  title: string;
  icon?: ReactNode;
  path?: string;
  children?: MenuItem[];
  /** 隐藏菜单但保留路由 */
  hidden?: boolean;
  /** 是否需要权限 */
  requireAuth?: boolean;
  /** 外部链接 */
  href?: string;
}
