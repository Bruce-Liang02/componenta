/**
 * 速查表页
 *
 * 以紧凑表格形式展示全部形态，支持快速筛选和跳转
 */
import React, { useState, useMemo } from 'react';
import { Typography, Table, Tag, Input, Select, Space, Rate, Button, Tooltip } from 'antd';
import { FileTextOutlined, SearchOutlined, CopyOutlined, ExportOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../data/catalogStore';
import type { ComponentVariant, CategoryData } from '../types';
import { message } from 'antd';

const { Title, Text } = Typography;

interface FlatRow {
  id: string;
  name: string;
  tagline: string;
  category: string;
  categoryName: string;
  component: string;
  componentName: string;
  status: string;
  rating: number;
  complexity: number;
  performance: string;
  tags: string[];
  variant: ComponentVariant;
}

export function CheatsheetPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const categories = getAllCategories();

  const rows = useMemo(() => {
    const result: FlatRow[] = [];
    for (const cat of categories) {
      for (const comp of cat.components) {
        for (const v of comp.variants) {
          result.push({
            id: v.id,
            name: v.name,
            tagline: v.tagline,
            category: cat.category,
            categoryName: cat.categoryName,
            component: comp.component,
            componentName: comp.name,
            status: v.status,
            rating: v.rating ?? 0,
            complexity: v.complexity ?? 0,
            performance: v.performance ?? '-',
            tags: v.tags ?? [],
            variant: v,
          });
        }
      }
    }
    return result;
  }, [categories]);

  const filteredRows = useMemo(() => {
    let result = rows;
    if (categoryFilter !== 'all') {
      result = result.filter((r) => r.category === categoryFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.tagline.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.componentName.toLowerCase().includes(q),
      );
    }
    return result;
  }, [rows, categoryFilter, statusFilter, search]);

  const handleCopyAll = () => {
    const text = filteredRows
      .map((r) => `${r.id}\t${r.name}\t${r.tagline}\t${r.categoryName}\t${r.componentName}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    message.success(`已复制 ${filteredRows.length} 条记录`);
  };

  const handleExportCSV = () => {
    const header = '编号,名称,一句话定位,类别,组件,状态,推荐指数,复杂度,性能,标签\n';
    const csv =
      header +
      filteredRows
        .map(
          (r) =>
            `${r.id},"${r.name}","${r.tagline}","${r.categoryName}","${r.componentName}",${r.status},${r.rating},${r.complexity},${r.performance},"${r.tags.join(';')}"`,
        )
        .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `componenta-catalog-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('CSV 已导出');
  };

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 90,
      fixed: 'left' as const,
      render: (id: string) => (
        <a onClick={() => navigate(`/catalog/v/${id}`)}>
          <Text code style={{ fontSize: 12, color: '#1677ff' }}>
            {id}
          </Text>
        </a>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left' as const,
      render: (name: string, row: FlatRow) => (
        <Tooltip title={row.tagline}>
          <Text strong style={{ fontSize: 13 }}>
            {name}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      width: 110,
      render: (_: string, row: FlatRow) => (
        <Tag>
          {row.category} {row.categoryName}
        </Tag>
      ),
    },
    {
      title: '组件',
      dataIndex: 'componentName',
      key: 'componentName',
      width: 100,
    },
    {
      title: '推荐',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      sorter: (a: FlatRow, b: FlatRow) => a.rating - b.rating,
      render: (r: number) => <Rate disabled defaultValue={r} count={5} style={{ fontSize: 12 }} />,
    },
    {
      title: '复杂度',
      dataIndex: 'complexity',
      key: 'complexity',
      width: 120,
      sorter: (a: FlatRow, b: FlatRow) => a.complexity - b.complexity,
      render: (c: number) => (
        <Rate disabled defaultValue={c} count={5} style={{ fontSize: 12, color: '#faad14' }} />
      ),
    },
    {
      title: '性能',
      dataIndex: 'performance',
      key: 'performance',
      width: 70,
      render: (p: string) => {
        const color =
          p === 'high' ? 'green' : p === 'medium' ? 'orange' : p === 'low' ? 'red' : 'default';
        const text = p === 'high' ? '⚡高' : p === 'medium' ? '⚡中' : p === 'low' ? '⚡低' : '-';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      render: (s: string) => (
        <Tag color={s === 'active' ? 'green' : 'red'}>{s === 'active' ? '活跃' : '废弃'}</Tag>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <Space wrap size={2}>
          {tags.slice(0, 3).map((t) => (
            <Tag key={t} style={{ fontSize: 11 }}>
              {t}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <FileTextOutlined style={{ marginRight: 8 }} />
          速查表
        </Title>
        <Text type="secondary">全部 {rows.length} 个形态的紧凑一览，支持搜索和筛选</Text>
      </div>

      {/* 筛选区 */}
      <Space wrap style={{ marginBottom: 16, width: '100%' }} size={12}>
        <Input
          placeholder="搜索编号、名称、关键词..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
        <Select
          value={categoryFilter}
          onChange={setCategoryFilter}
          style={{ width: 160 }}
          options={[
            { value: 'all', label: '全部类别' },
            ...categories.map((cat: CategoryData) => ({
              value: cat.category,
              label: `${cat.category} ${cat.categoryName}`,
            })),
          ]}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: '全部状态' },
            { value: 'active', label: '活跃' },
            { value: 'deprecated', label: '已废弃' },
          ]}
        />
        <Text type="secondary">
          {filteredRows.length} / {rows.length} 条
        </Text>
        <Button icon={<CopyOutlined />} onClick={handleCopyAll}>
          复制
        </Button>
        <Button icon={<ExportOutlined />} onClick={handleExportCSV}>
          导出 CSV
        </Button>
      </Space>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={filteredRows}
        rowKey="id"
        size="small"
        pagination={{
          pageSize: 50,
          showSizeChanger: true,
          pageSizeOptions: ['20', '50', '100', '200'],
          showTotal: (total) => `共 ${total} 条`,
        }}
        scroll={{ x: 1100 }}
        onRow={(record) => ({
          onDoubleClick: () => navigate(`/catalog/v/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
}
