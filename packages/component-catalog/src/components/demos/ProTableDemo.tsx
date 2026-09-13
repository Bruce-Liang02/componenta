/**
 * ProTable Demo 模板
 *
 * 展示不同形态的高级表格效果
 */
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Input, Tooltip, Card } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  ColumnHeightOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { ComponentVariant } from '../../types';

interface ProTableDemoProps {
  variant: ComponentVariant;
}

// 模拟数据
const mockData = Array.from({ length: 46 }, (_, i) => ({
  key: i + 1,
  name: `项目名称-${i + 1}`,
  status: ['active', 'inactive', 'pending'][i % 3],
  owner: ['张三', '李四', '王五', '赵六'][i % 4],
  priority: ['high', 'medium', 'low'][i % 3],
  createdAt: `2026-09-${String((i % 28) + 1).padStart(2, '0')}`,
  progress: Math.floor(Math.random() * 100),
}));

const columns = [
  { title: '项目名称', dataIndex: 'name', key: 'name', width: 200 },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status: string) => {
      const color = status === 'active' ? 'green' : status === 'pending' ? 'orange' : 'default';
      return (
        <Tag color={color}>
          {status === 'active' ? '进行中' : status === 'pending' ? '待处理' : '已关闭'}
        </Tag>
      );
    },
  },
  { title: '负责人', dataIndex: 'owner', key: 'owner', width: 100 },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
    render: (p: string) => {
      const color = p === 'high' ? 'red' : p === 'medium' ? 'orange' : 'default';
      return <Tag color={color}>{p === 'high' ? '高' : p === 'medium' ? '中' : '低'}</Tag>;
    },
  },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 120 },
];

export const ProTableDemo: React.FC<ProTableDemoProps> = ({ variant }) => {
  const [searchText, setSearchText] = useState('');

  // 根据形态维度调整展示
  const isCompact = variant.dimensions?.visual === 'data-dense' || variant.id.includes('PT003');
  const isCardList = variant.dimensions?.layout === 'card-list' || variant.id.includes('PT002');
  const isVirtual = variant.id.includes('PT004');
  const isInfiniteScroll = variant.id.includes('PT011') || variant.id.includes('NV011');

  // 筛选数据
  const filteredData = mockData.filter((item) => !searchText || item.name.includes(searchText));

  // 卡片列表模式
  if (isCardList) {
    return (
      <div>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Input.Search
            placeholder="搜索..."
            style={{ width: 240 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            新建
          </Button>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {filteredData.slice(0, 8).map((item) => (
            <Card key={item.key} hoverable size="small">
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{item.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Tag color={item.status === 'active' ? 'green' : 'default'}>
                  {item.status === 'active' ? '进行中' : '已关闭'}
                </Tag>
                <span style={{ color: '#999', fontSize: 12 }}>{item.owner}</span>
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>创建：{item.createdAt}</div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 表格模式
  return (
    <div>
      {/* 工具栏 */}
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Space>
          <Input.Search
            placeholder="搜索项目名称..."
            style={{ width: 240 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Tag>共 {filteredData.length} 条</Tag>
        </Space>
        <Space>
          <Tooltip title="刷新">
            <Button icon={<ReloadOutlined />} />
          </Tooltip>
          <Tooltip title="密度">
            <Button icon={<ColumnHeightOutlined />} />
          </Tooltip>
          <Tooltip title="列设置">
            <Button icon={<SettingOutlined />} />
          </Tooltip>
          <Button type="primary" icon={<PlusOutlined />}>
            新建
          </Button>
        </Space>
      </div>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={filteredData}
        size={isCompact ? 'small' : 'middle'}
        pagination={
          isInfiniteScroll
            ? false
            : { pageSize: 10, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }
        }
        scroll={isVirtual ? { y: 300 } : undefined}
        rowClassName={() => (isCompact ? 'compact-row' : '')}
        style={isCompact ? { fontSize: 12 } : undefined}
      />
    </div>
  );
};
