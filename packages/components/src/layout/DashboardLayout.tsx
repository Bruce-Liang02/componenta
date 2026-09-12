/**
 * 布局组件：dashboard（4 宫格）
 *
 * 将 children 按 2x2 网格排布。
 */
import React from 'react';
import { Layout as AntLayout } from 'antd';
import type { LayoutProps } from './types';

const { Content } = AntLayout;

export function DashboardLayout({ children, header, sidebar, main, footer }: LayoutProps) {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {header && (
        <AntLayout.Header style={{ padding: '0 24px', background: '#fff' }}>
          {header}
        </AntLayout.Header>
      )}
      <AntLayout>
        {sidebar && (
          <AntLayout.Sider width={220} style={{ background: '#fff' }}>
            {sidebar}
          </AntLayout.Sider>
        )}
        <AntLayout style={{ padding: 24 }}>
          <Content>{main ?? children}</Content>
          {footer && (
            <AntLayout.Footer style={{ padding: '16px 0', textAlign: 'center' }}>
              {footer}
            </AntLayout.Footer>
          )}
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
}

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
