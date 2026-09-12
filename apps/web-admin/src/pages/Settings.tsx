/**
 * 系统设置页
 *
 * 支持主题切换、用户偏好持久化（占位）。
 */
import React from 'react';
import { Card, Typography, Divider, Tabs, Form, Input, Switch, Button, message, Tag } from 'antd';
import { useTheme } from '@componenta/core';
import { ThemeSwitcher } from '@componenta/themes';

const { Title, Paragraph } = Typography;

export function Settings() {
  const { currentName, listThemes } = useTheme();

  const handleSave = () => {
    message.success('设置已保存');
  };

  const tabItems = [
    {
      key: 'theme',
      label: '主题设置',
      children: (
        <div>
          <Paragraph>
            当前主题：
            <Tag color="blue">{listThemes().find((p) => p.name === currentName)?.displayName}</Tag>
          </Paragraph>
          <Divider orientation="left" plain>
            选择主题包（卡片模式）
          </Divider>
          <ThemeSwitcher mode="card" showDescription cols={4} />
          <Divider orientation="left" plain>
            选择主题包（下拉模式）
          </Divider>
          <div style={{ maxWidth: 300 }}>
            <ThemeSwitcher mode="select" />
          </div>
        </div>
      ),
    },
    {
      key: 'user',
      label: '用户偏好',
      children: (
        <Form layout="vertical" style={{ maxWidth: 500 }}>
          <Form.Item label="显示名称">
            <Input defaultValue="管理员" />
          </Form.Item>
          <Form.Item label="每页条数">
            <Input type="number" defaultValue={20} />
          </Form.Item>
          <Form.Item label="语言">
            <Input defaultValue="zh-CN" disabled />
          </Form.Item>
          <Form.Item label="消息通知">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'about',
      label: '关于',
      children: (
        <div>
          <Title level={4}>Componenta（组件塔）</Title>
          <Paragraph>版本：0.1.0</Paragraph>
          <Paragraph>Componenta 是一套面向复杂 B 端业务场景的组件化平台，核心理念是：</Paragraph>
          <ul>
            <li>组件可插拔：同一位置可注册多种实现</li>
            <li>主题可切换：Token + 组件变体 + 布局模板 三层一体</li>
            <li>引擎可独立：流程/表单/权限等引擎独立演进</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>系统设置</Title>
      <Card>
        <Tabs items={tabItems} defaultActiveKey="theme" />
      </Card>
    </div>
  );
}
