/**
 * 系统主布局（基于 Ant Design ProLayout 风格）
 */
import React, { useState, useMemo } from 'react';
import { Layout, Menu, Breadcrumb, theme, Avatar, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SkinOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTheme, useAppStore } from '@componenta/core';
import { ThemeSwitcher } from '@componenta/themes';
import type { MenuItem } from '../menu/types';

const { Header, Sider, Content, Footer } = Layout;

type AntMenuItem = NonNullable<MenuProps['items']>[number];

/** 将 MenuItem 转换为 antd Menu 的 items 格式 */
function convertMenuItems(items: MenuItem[]): AntMenuItem[] {
  return items
    .filter((item) => !item.hidden)
    .map((item) => ({
      key: item.path ?? item.key,
      icon: item.icon,
      label: item.href ? (
        <a href={item.href} target="_blank" rel="noreferrer">
          {item.title}
        </a>
      ) : (
        item.title
      ),
      children: item.children ? convertMenuItems(item.children) : undefined,
    }));
}

export interface SystemLayoutProps {
  /** 系统标题 */
  title?: string;
  /** Logo */
  logo?: React.ReactNode;
  /** 菜单项 */
  menuItems: MenuItem[];
  /** 是否显示页脚 */
  showFooter?: boolean;
  /** 用户菜单 */
  userMenuItems?: MenuItem[];
}

export function SystemLayout({
  title = 'Componenta',
  logo,
  menuItems,
  showFooter = true,
  userMenuItems,
}: SystemLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const { currentName, listThemes } = useTheme();
  const currentUser = useAppStore((s) => s.currentUser);

  const menuItemsConfig = useMemo<AntMenuItem[]>(() => convertMenuItems(menuItems), [menuItems]);

  // 计算当前打开的子菜单
  const openKeys = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const keys: string[] = [];
    let current = '';
    for (const part of parts) {
      current += `/${part}`;
      keys.push(current);
    }
    return keys;
  }, [location.pathname]);

  const handleMenuClick = (info: { key: string }) => {
    if (info.key.startsWith('http')) return;
    navigate(info.key);
  };

  const defaultUserMenu: MenuProps['items'] = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        localStorage.removeItem('componenta:token');
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={220}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          {logo ?? (
            <div
              style={{ fontSize: collapsed ? 16 : 20, fontWeight: 700, color: token.colorPrimary }}
            >
              {collapsed ? 'C' : `🧩 ${title}`}
            </div>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={openKeys}
          items={menuItemsConfig}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18, cursor: 'pointer' },
            })}
            <Breadcrumb />
          </div>

          <Space size={16}>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'header-theme',
                    label: (
                      <div style={{ padding: 8, minWidth: 200 }}>
                        <div style={{ marginBottom: 8, fontWeight: 500 }}>切换主题</div>
                        <ThemeSwitcher mode="select" />
                      </div>
                    ),
                  },
                ],
              }}
            >
              <Space style={{ cursor: 'pointer' }}>
                <SkinOutlined />
                <span>{listThemes().find((p) => p.name === currentName)?.displayName}</span>
              </Space>
            </Dropdown>
            <Dropdown
              menu={{
                items: (userMenuItems
                  ? convertMenuItems(userMenuItems)
                  : defaultUserMenu) as AntMenuItem[],
              }}
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{currentUser?.nickname ?? currentUser?.username ?? '用户'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: 24, minHeight: 280 }}>
          <Outlet />
        </Content>

        {showFooter && (
          <Footer style={{ textAlign: 'center', padding: '16px 50px' }}>
            Componenta ©2026 Created by Componenta Team
          </Footer>
        )}
      </Layout>
    </Layout>
  );
}

SystemLayout.displayName = 'SystemLayout';

export default SystemLayout;
