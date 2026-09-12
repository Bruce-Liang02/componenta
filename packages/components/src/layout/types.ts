/**
 * Layout 组件契约
 */
import type { ReactNode } from 'react';

export interface LayoutProps {
  /** 布局类型 */
  type?: 'fixed-header' | 'sidebar-main' | 'dashboard' | 'blank';
  /** 子节点（通常是 RegionRenderer 输出的 regions） */
  children?: ReactNode;
  /** 头部内容 */
  header?: ReactNode;
  /** 侧边栏内容 */
  sidebar?: ReactNode;
  /** 主内容 */
  main?: ReactNode;
  /** 底部内容 */
  footer?: ReactNode;
}
