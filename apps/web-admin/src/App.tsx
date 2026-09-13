import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemePackLoader, globalThemeRegistry, globalRegistry } from '@componenta/core';
import { registerAllComponents } from '@componenta/components';
import { registerAllThemes } from '@componenta/themes';
import { SystemLayout } from '@componenta/admin-shell';
import {
  DashboardOutlined,
  AppstoreOutlined,
  SettingOutlined,
  ExperimentOutlined,
  BookOutlined,
} from '@ant-design/icons';
import type { MenuItem } from '@componenta/admin-shell';

// 组件选型目录
import {
  CatalogPage,
  VariantDetailPage,
  VariantComparePage,
  SelectionGuidePage,
  CheatsheetPage,
  PageSchemaGenerator,
  VariantDemoPage,
  setCatalogData,
  staticCatalog,
} from '@componenta/component-catalog';

import { Dashboard } from './pages/Dashboard';
import { ComponentShowcase } from './pages/ComponentShowcase';
import { Settings } from './pages/Settings';
import { LoginPage } from './pages/Login';
import { AuthRoute } from '@componenta/admin-shell';

// 注册所有组件和主题
registerAllComponents(globalRegistry);
registerAllThemes(globalThemeRegistry);

// 初始化选型目录数据
setCatalogData(staticCatalog);

/** 路由内容（必须在 BrowserRouter 内部，以使用 useNavigate） */
function AppRoutes() {
  const navigate = useNavigate();

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
        key: '/catalog',
        title: '选型目录',
        icon: <BookOutlined />,
        children: [
          {
            key: '/catalog',
            title: '形态总览',
            path: '/catalog',
          },
          {
            key: '/catalog/guide',
            title: '选型向导',
            path: '/catalog/guide',
          },
          {
            key: '/catalog/compare',
            title: '形态对比',
            path: '/catalog/compare',
          },
          {
            key: '/catalog/cheatsheet',
            title: '速查表',
            path: '/catalog/cheatsheet',
          },
          {
            key: '/catalog/schema-generator',
            title: 'Schema 生成器',
            path: '/catalog/schema-generator',
          },
        ],
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
        <Route path="catalog" element={<CatalogPage onNavigate={(path) => navigate(path)} />} />
        <Route path="catalog/v/:id" element={<VariantDetailPage />} />
        <Route path="catalog/compare" element={<VariantComparePage />} />
        <Route path="catalog/guide" element={<SelectionGuidePage />} />
        <Route path="catalog/cheatsheet" element={<CheatsheetPage />} />
        <Route path="catalog/schema-generator" element={<PageSchemaGenerator />} />
        <Route path="catalog/demo/:id" element={<VariantDemoPage />} />
        <Route path="experiment" element={<div>实验特性（预留）</div>} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemePackLoader registry={globalThemeRegistry}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemePackLoader>
  );
}

export default App;
