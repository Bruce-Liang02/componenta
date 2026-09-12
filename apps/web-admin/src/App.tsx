import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemePackLoader, globalThemeRegistry, globalRegistry } from '@componenta/core';
import { registerAllComponents } from '@componenta/components';
import { registerAllThemes } from '@componenta/themes';
import { SystemLayout } from '@componenta/admin-shell';
import {
  DashboardOutlined,
  AppstoreOutlined,
  SettingOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import type { MenuItem } from '@componenta/admin-shell';

import { Dashboard } from './pages/Dashboard';
import { ComponentShowcase } from './pages/ComponentShowcase';
import { Settings } from './pages/Settings';
import { LoginPage } from './pages/Login';
import { AuthRoute } from '@componenta/admin-shell';

// 注册所有组件和主题
registerAllComponents(globalRegistry);
registerAllThemes(globalThemeRegistry);

export function App() {
  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        key: '/dashboard',
        title: '仪表盘',
        icon: <DashboardOutlined />,
        path: '/dashboard',
      },
      {
        key: '/components',
        title: '组件展示',
        icon: <AppstoreOutlined />,
        path: '/components',
      },
      {
        key: '/experiment',
        title: '实验特性',
        icon: <ExperimentOutlined />,
        path: '/experiment',
      },
      {
        key: '/settings',
        title: '系统设置',
        icon: <SettingOutlined />,
        path: '/settings',
      },
    ],
    [],
  );

  return (
    <ThemePackLoader registry={globalThemeRegistry}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <AuthRoute>
                <SystemLayout title="Componenta" menuItems={menuItems} />
              </AuthRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="components" element={<ComponentShowcase />} />
            <Route path="experiment" element={<div>实验特性（预留）</div>} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemePackLoader>
  );
}

export default App;
