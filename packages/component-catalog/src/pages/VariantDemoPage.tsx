/**
 * 形态 Demo 全屏页
 *
 * 独立路由 /catalog/demo/:id，全屏展示组件效果
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Breadcrumb, Typography, Space, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getVariantById } from '../data/catalogStore';
import { VariantDemo } from '../components/VariantDemo';

const { Title, Text } = Typography;

export function VariantDemoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return <Text type="danger">缺少形态 ID</Text>;
  }

  const variant = getVariantById(id);

  if (!variant) {
    return (
      <Alert
        type="error"
        message="形态未找到"
        description={`编号 ${id} 不存在于目录中`}
        action={<Button onClick={() => navigate('/catalog')}>返回目录</Button>}
      />
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <a onClick={() => navigate('/catalog')}>选型目录</a> },
          { title: <a onClick={() => navigate(`/catalog/v/${id}`)}>{variant.id}</a> },
          { title: '效果预览' },
        ]}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Space align="baseline">
          <Title level={3} style={{ margin: 0 }}>
            <Text code>{variant.id}</Text> · {variant.name}
          </Title>
          <Text type="secondary">- {variant.tagline}</Text>
        </Space>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/catalog/v/${id}`)}>
            返回详情
          </Button>
        </Space>
      </div>

      <VariantDemo variantId={variant.id} />
    </div>
  );
}
