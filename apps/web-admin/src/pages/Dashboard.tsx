/**
 * Dashboard 演示页
 *
 * 展示主题包切换效果 + Schema 渲染。
 */
import React, { useState } from 'react';
import { Row, Col, Typography, Segmented } from 'antd';
import { SchemaRenderer, globalRegistry } from '@componenta/core';
import { useTheme } from '@componenta/core';
import type { PageSchema } from '@componenta/core';

const { Title, Paragraph } = Typography;

// 演示 Schema：一个仪表盘，包含 4 个统计卡片 + 1 个图表 + 1 个列表
const dashboardSchema: PageSchema = {
  id: 'dashboard-demo',
  version: '0.1',
  title: '仪表盘演示',
  layout: {
    type: 'dashboard',
    regions: [
      {
        name: 'stats',
        blocks: [
          {
            id: 'stat-orders',
            componentType: 'Card',
            props: {
              statistic: { title: '今日订单', value: 1234, trend: 'up', trendValue: '12%' },
            },
          },
          {
            id: 'stat-revenue',
            componentType: 'Card',
            props: {
              statistic: { title: '今日营收', value: '¥23,456', trend: 'up', trendValue: '8%' },
            },
          },
          {
            id: 'stat-users',
            componentType: 'Card',
            props: {
              statistic: { title: '活跃用户', value: 892, trend: 'down', trendValue: '3%' },
            },
          },
          {
            id: 'stat-conversion',
            componentType: 'Card',
            props: {
              statistic: { title: '转化率', value: '65.4%' },
            },
          },
        ],
      },
      {
        name: 'chart',
        blocks: [
          {
            id: 'chart-sales',
            componentType: 'Chart',
            props: {
              title: '近 7 天销售趋势',
              option: {
                tooltip: { trigger: 'axis' },
                xAxis: {
                  type: 'category',
                  data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                },
                yAxis: { type: 'value' },
                series: [
                  {
                    data: [820, 932, 901, 1034, 1290, 1330, 1520],
                    type: 'line',
                    smooth: true,
                    areaStyle: {},
                  },
                ],
              },
              height: 320,
            },
          },
        ],
      },
      {
        name: 'list',
        blocks: [
          {
            id: 'list-recent-orders',
            componentType: 'List',
            componentImpl: 'AntList',
            props: {
              title: '最近订单',
              bordered: true,
              dataSource: [
                {
                  id: '1',
                  orderNo: 'ORD-001',
                  customer: '张三',
                  amount: '¥1,234',
                  status: '已完成',
                },
                {
                  id: '2',
                  orderNo: 'ORD-002',
                  customer: '李四',
                  amount: '¥2,345',
                  status: '处理中',
                },
                {
                  id: '3',
                  orderNo: 'ORD-003',
                  customer: '王五',
                  amount: '¥3,456',
                  status: '已完成',
                },
                {
                  id: '4',
                  orderNo: 'ORD-004',
                  customer: '赵六',
                  amount: '¥4,567',
                  status: '已取消',
                },
                {
                  id: '5',
                  orderNo: 'ORD-005',
                  customer: '孙七',
                  amount: '¥5,678',
                  status: '已完成',
                },
              ],
              columns: [
                { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
                { title: '客户', dataIndex: 'customer', key: 'customer' },
                { title: '金额', dataIndex: 'amount', key: 'amount' },
                { title: '状态', dataIndex: 'status', key: 'status' },
              ],
              pagination: { pageSize: 10 },
            },
          },
        ],
      },
    ],
  },
};

export function Dashboard() {
  const { currentName, currentPack } = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            仪表盘演示
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            当前主题：{currentPack.displayName}（{currentName}）
          </Paragraph>
        </div>
        <Segmented
          value={viewMode}
          onChange={(v) => setViewMode(v as 'grid' | 'single')}
          options={[
            { label: '宫格', value: 'grid' },
            { label: '单列', value: 'single' },
          ]}
        />
      </div>

      <div
        style={{
          display: viewMode === 'grid' ? 'grid' : 'block',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(4, 1fr)' : undefined,
          gap: 16,
          marginBottom: 16,
        }}
      >
        {dashboardSchema.layout.regions[0]?.blocks.map((block) => (
          <div key={block.id}>
            <SchemaRenderer
              schema={{
                ...dashboardSchema,
                layout: {
                  ...dashboardSchema.layout,
                  regions: [dashboardSchema.layout.regions[0]!],
                },
              }}
              registry={globalRegistry}
            />
            {/* 只显示第一个区块的卡片，简化展示 */}
          </div>
        ))}
      </div>

      {/* 简化：直接渲染图表和列表区块 */}
      <Row gutter={16}>
        <Col span={viewMode === 'grid' ? 12 : 24}>
          {dashboardSchema.layout.regions[1]?.blocks.map((block) => (
            <div key={block.id} style={{ marginBottom: 16 }}>
              <SchemaRenderer
                schema={{
                  ...dashboardSchema,
                  layout: {
                    ...dashboardSchema.layout,
                    regions: [dashboardSchema.layout.regions[1]!],
                  },
                }}
                registry={globalRegistry}
              />
            </div>
          ))}
        </Col>
        <Col span={viewMode === 'grid' ? 12 : 24}>
          {dashboardSchema.layout.regions[2]?.blocks.map((block) => (
            <div key={block.id}>
              <SchemaRenderer
                schema={{
                  ...dashboardSchema,
                  layout: {
                    ...dashboardSchema.layout,
                    regions: [dashboardSchema.layout.regions[2]!],
                  },
                }}
                registry={globalRegistry}
              />
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
}
