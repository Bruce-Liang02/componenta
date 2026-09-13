/**
 * Navigation Demo 模板
 */
import React from 'react';
import { Menu, Tabs, Breadcrumb, Pagination, Space, Tag, Typography, Divider } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  FileOutlined,
  MailOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { ComponentVariant } from '../../types';

interface Props {
  variant: ComponentVariant;
}

export const NavigationDemo: React.FC<Props> = ({ variant }) => {
  const ct = variant.id.replace(/\d+/g, '');
  const num = parseInt(variant.id.replace(/\D/g, ''));

  if (ct === 'NV' && num <= 3) {
    // Menu demos
    const isSide = num === 1;
    const isTop = num === 2;
    const items = [
      { key: 'dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
      { key: 'users', icon: <UserOutlined />, label: '用户管理' },
      { key: 'projects', icon: <FileOutlined />, label: '项目管理' },
      { key: 'messages', icon: <MailOutlined />, label: '消息中心' },
      { key: 'calendar', icon: <CalendarOutlined />, label: '日程安排' },
      { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
    ];
    if (isSide) {
      return (
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          style={{ height: 300, borderRight: 0 }}
          items={items}
        />
      );
    }
    if (isTop) {
      return <Menu mode="horizontal" defaultSelectedKeys={['dashboard']} items={items} />;
    }
    return (
      <div>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['projects']}
          items={items.slice(0, 4)}
          style={{ marginBottom: 16 }}
        />
        <div style={{ display: 'flex', gap: 16 }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['sub1']}
            style={{ width: 200, height: 200 }}
            items={[
              { key: 'sub1', label: '项目列表', icon: <FileOutlined /> },
              { key: 'sub2', label: '我的项目', icon: <UserOutlined /> },
            ]}
          />
          <div style={{ flex: 1, padding: 16, background: '#fafafa', borderRadius: 8 }}>
            内容区域
          </div>
        </div>
      </div>
    );
  }

  if (ct === 'NV' && num <= 6) {
    // Tabs demos
    const isEditable = num === 5;
    const tabs = [
      { key: '1', label: '标签一', children: '标签一的内容' },
      { key: '2', label: '标签二', children: '标签二的内容' },
      { key: '3', label: '标签三', children: '标签三的内容' },
    ];
    return <Tabs defaultActiveKey="1" items={tabs} type={isEditable ? 'editable-card' : 'card'} />;
  }

  if (ct === 'NV' && num <= 8) {
    return <Breadcrumb items={[{ title: '首页' }, { title: '列表页' }, { title: '详情页' }]} />;
  }

  if (ct === 'NV' && num <= 11) {
    return (
      <Pagination defaultCurrent={3} total={500} showSizeChanger showTotal={(t) => `共 ${t} 条`} />
    );
  }

  if (ct === 'NV' && num <= 14) {
    return (
      <div>
        <Breadcrumb
          items={[{ title: '首页' }, { title: '列表' }, { title: '详情' }]}
          style={{ marginBottom: 12 }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Space align="baseline">
            <Typography.Title level={4} style={{ margin: 0 }}>
              页面标题
            </Typography.Title>
            <Tag color="blue">进行中</Tag>
          </Space>
          <Space>
            <span style={{ color: '#1677ff', cursor: 'pointer' }}>操作一</span>
            <Divider type="vertical" />
            <span style={{ color: '#1677ff', cursor: 'pointer' }}>操作二</span>
          </Space>
        </div>
        <div style={{ padding: 16, background: '#fafafa', borderRadius: 8 }}>页面内容</div>
      </div>
    );
  }

  return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>导航 Demo 占位</div>;
};
