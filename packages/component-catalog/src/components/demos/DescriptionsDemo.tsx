/**
 * Descriptions Demo 模板
 */
import React from 'react';
import { Descriptions, Tag, Card, Row, Col, Space } from 'antd';
import type { ComponentVariant } from '../../types';

interface Props {
  variant: ComponentVariant;
}

const mockDetail = {
  name: 'Componenta 组件化平台',
  code: 'CMP-2026-001',
  status: 'active',
  owner: '张三',
  department: '技术部',
  priority: '高',
  createdAt: '2026-09-01',
  updatedAt: '2026-09-12',
  description: '基于 Schema 驱动的组件化中后台搭建平台，支持主题包切换与组件形态选型。',
  tags: ['React', 'TypeScript', 'Ant Design'],
  budget: '¥128,000',
};

export const DescriptionsDemo: React.FC<Props> = ({ variant }) => {
  const isMultiCol = variant.id.includes('PT009');
  const isCardGroup = variant.id.includes('PT010');

  if (isCardGroup) {
    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="基本信息" size="small">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="项目名称">{mockDetail.name}</Descriptions.Item>
              <Descriptions.Item label="项目编号">{mockDetail.code}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color="green">进行中</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="负责人">{mockDetail.owner}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="组织信息" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="所属部门">{mockDetail.department}</Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color="red">{mockDetail.priority}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="时间信息" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="创建时间">{mockDetail.createdAt}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{mockDetail.updatedAt}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="描述" size="small">
            <p style={{ margin: 0, color: '#666' }}>{mockDetail.description}</p>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Descriptions title="项目详情" bordered column={isMultiCol ? 3 : 2} size="middle">
      <Descriptions.Item label="项目名称">{mockDetail.name}</Descriptions.Item>
      <Descriptions.Item label="项目编号">{mockDetail.code}</Descriptions.Item>
      <Descriptions.Item label="状态">
        <Tag color="green">进行中</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="负责人">{mockDetail.owner}</Descriptions.Item>
      <Descriptions.Item label="所属部门">{mockDetail.department}</Descriptions.Item>
      <Descriptions.Item label="优先级">
        <Tag color="red">{mockDetail.priority}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">{mockDetail.createdAt}</Descriptions.Item>
      <Descriptions.Item label="更新时间">{mockDetail.updatedAt}</Descriptions.Item>
      <Descriptions.Item label="预算">{mockDetail.budget}</Descriptions.Item>
      <Descriptions.Item label="标签" span={isMultiCol ? 1 : 2}>
        <Space wrap>
          {mockDetail.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label="描述" span={isMultiCol ? 3 : 2}>
        {mockDetail.description}
      </Descriptions.Item>
    </Descriptions>
  );
};
