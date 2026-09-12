/**
 * 组件展示页
 *
 * 展示同一 Schema 在不同主题包下的渲染效果对比。
 */
import React from 'react';
import { Card, Typography, Space, Row, Col, Divider, Tag, Alert } from 'antd';
import { SchemaRenderer, globalRegistry } from '@componenta/core';
import { builtinThemes } from '@componenta/themes';
import type { PageSchema } from '@componenta/core';

const { Title, Paragraph } = Typography;

// 用于对比的 Schema
const comparisonSchema: PageSchema = {
  id: 'comparison-demo',
  version: '0.1',
  title: '组件对比',
  layout: {
    type: 'blank',
    regions: [
      {
        name: 'main',
        blocks: [
          {
            id: 'demo-card',
            componentType: 'Card',
            props: {
              title: '演示卡片',
              children: '这是卡片内容，主题切换后视觉风格会发生变化。',
              bordered: true,
            },
          },
          {
            id: 'demo-list',
            componentType: 'List',
            props: {
              title: '演示列表',
              dataSource: [
                { id: '1', name: '项目 A', progress: '80%', status: '进行中' },
                { id: '2', name: '项目 B', progress: '100%', status: '已完成' },
                { id: '3', name: '项目 C', progress: '30%', status: '规划中' },
              ],
              columns: [
                { title: '名称', dataIndex: 'name' },
                { title: '进度', dataIndex: 'progress' },
                { title: '状态', dataIndex: 'status' },
              ],
            },
          },
        ],
      },
    ],
  },
};

export function ComponentShowcase() {
  return (
    <div>
      <Title level={3}>组件展示</Title>
      <Paragraph type="secondary">
        本页面展示 Componenta
        的组件库和主题包机制。切换右上角的主题后，当前页面的视觉风格会即时变化。
      </Paragraph>

      <Alert
        message="主题包切换机制"
        description={
          <div>
            <div>
              主题包包含三层：<Tag>Design Tokens</Tag>
              <Tag>组件变体映射</Tag>
              <Tag>布局模板</Tag>
            </div>
            <div style={{ marginTop: 8 }}>切换主题 = 一次性替换这三层，所有页面响应。</div>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Divider orientation="left">内置主题包</Divider>

      <Row gutter={[16, 16]}>
        {builtinThemes.map((pack) => (
          <Col key={pack.name} xs={24} sm={12} lg={6}>
            <Card
              title={
                <Space>
                  <span>{pack.displayName}</span>
                  <Tag>{pack.name}</Tag>
                </Space>
              }
              size="small"
            >
              <Paragraph style={{ marginBottom: 8, fontSize: 12 }}>{pack.description}</Paragraph>
              <div style={{ fontSize: 12 }}>
                <div>
                  主色：
                  <Tag color={pack.tokens.colorPrimary as string}>
                    {pack.tokens.colorPrimary as string}
                  </Tag>
                </div>
                <div>圆角：{pack.tokens.borderRadius as number}px</div>
                <div>字号：{pack.tokens.fontSize as number}px</div>
                <div>布局：{pack.layoutTemplate}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider orientation="left">当前主题渲染效果</Divider>

      <SchemaRenderer schema={comparisonSchema} registry={globalRegistry} />

      <Divider orientation="left">已注册组件类型</Divider>

      <Card>
        <Space wrap>
          {globalRegistry.listTypes().map((type) => (
            <Tag key={type} color="blue">
              {type} → {globalRegistry.listVariants(type).join(', ')}
            </Tag>
          ))}
        </Space>
      </Card>
    </div>
  );
}
