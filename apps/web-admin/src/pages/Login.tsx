/**
 * 登录页（Phase 0 使用 mock 登录）
 */
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@componenta/core';

const { Title, Paragraph } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true);
    try {
      // Phase 0：mock 登录
      // 未来会调用后端 POST /api/auth/login
      if (values.username === 'admin' && values.password === 'admin123') {
        localStorage.setItem('componenta:token', 'mock-token-admin');
        setCurrentUser({
          id: '1',
          username: 'admin',
          nickname: '管理员',
          roles: ['admin'],
        });
        message.success('登录成功');
        navigate('/dashboard', { replace: true });
      } else {
        message.error('用户名或密码错误');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card style={{ width: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 4 }}>
            🧩 Componenta
          </Title>
          <Paragraph type="secondary">组件塔 · B 端业务管理平台</Paragraph>
        </div>

        <Alert
          message="Phase 0 Demo"
          description="使用 admin / admin123 登录"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form<LoginForm> onFinish={handleSubmit} size="large">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
