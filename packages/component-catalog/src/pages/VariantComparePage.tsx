/**
 * 形态对比页
 *
 * 支持选择 2-4 个形态并排对比，从多维度直观比较差异
 */
import React, { useState, useMemo } from 'react';
import {
  Typography,
  Card,
  Select,
  Tag,
  Rate,
  Button,
  Space,
  Empty,
  Divider,
  Row,
  Col,
  message,
} from 'antd';
import { CloseOutlined, SwapOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  getAllVariants,
  getVariantById,
  getCategoryOfVariant,
  getComponentOfVariant,
} from '../data/catalogStore';
import type { ComponentVariant } from '../types';

const { Title, Text } = Typography;

const MAX_COMPARE = 4;

/** 对比维度 */
const compareDimensions: {
  key: string;
  label: string;
  render: (v: ComponentVariant) => React.ReactNode;
}[] = [
  { key: 'name', label: '名称', render: (v) => <Text strong>{v.name}</Text> },
  { key: 'tagline', label: '一句话定位', render: (v) => <Text>{v.tagline}</Text> },
  {
    key: 'status',
    label: '状态',
    render: (v) => (
      <Tag color={v.status === 'active' ? 'green' : 'red'}>
        {v.status === 'active' ? '活跃' : '已废弃'}
      </Tag>
    ),
  },
  {
    key: 'complexity',
    label: '复杂度',
    render: (v) => (
      <Rate disabled defaultValue={v.complexity ?? 0} count={5} style={{ fontSize: 14 }} />
    ),
  },
  {
    key: 'rating',
    label: '推荐指数',
    render: (v) => (
      <Rate disabled defaultValue={v.rating ?? 0} count={5} style={{ fontSize: 14 }} />
    ),
  },
  {
    key: 'performance',
    label: '性能',
    render: (v) => {
      const color =
        v.performance === 'high' ? 'green' : v.performance === 'medium' ? 'orange' : 'red';
      const text =
        v.performance === 'high'
          ? '⚡高'
          : v.performance === 'medium'
            ? '⚡中'
            : v.performance === 'low'
              ? '⚡低'
              : '-';
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    key: 'accessibility',
    label: '无障碍',
    render: (v) => {
      const color =
        v.accessibility === 'excellent' ? 'green' : v.accessibility === 'good' ? 'blue' : 'default';
      const text =
        v.accessibility === 'excellent'
          ? '♿优秀'
          : v.accessibility === 'good'
            ? '♿良好'
            : v.accessibility === 'basic'
              ? '♿基础'
              : '-';
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    key: 'tech',
    label: '技术实现',
    render: (v) => (
      <Text code style={{ fontSize: 12 }}>
        {v.tech ?? '-'}
      </Text>
    ),
  },
  {
    key: 'pros',
    label: '✅ 优点',
    render: (v) => (
      <ul style={{ paddingLeft: 16, margin: 0 }}>
        {v.pros.map((p, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            {p}
          </li>
        ))}
      </ul>
    ),
  },
  {
    key: 'cons',
    label: '❌ 缺点',
    render: (v) => (
      <ul style={{ paddingLeft: 16, margin: 0 }}>
        {v.cons.map((c, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            {c}
          </li>
        ))}
      </ul>
    ),
  },
  {
    key: 'useCases',
    label: '🎯 适用场景',
    render: (v) => (
      <ul style={{ paddingLeft: 16, margin: 0 }}>
        {v.useCases.map((u, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            {u}
          </li>
        ))}
      </ul>
    ),
  },
  {
    key: 'antiCases',
    label: '🚫 不适用',
    render: (v) => (
      <ul style={{ paddingLeft: 16, margin: 0 }}>
        {v.antiCases.map((a, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            {a}
          </li>
        ))}
      </ul>
    ),
  },
  {
    key: 'tags',
    label: '标签',
    render: (v) => (
      <Space wrap>
        {(v.tags ?? []).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </Space>
    ),
  },
  {
    key: 'dimensions',
    label: '形态维度',
    render: (v) => {
      if (!v.dimensions) return <Text type="secondary">-</Text>;
      const d = v.dimensions;
      return (
        <Space wrap size={4}>
          {d.layout && <Tag>布局:{d.layout}</Tag>}
          {d.interaction && <Tag>交互:{d.interaction}</Tag>}
          {d.data && <Tag>数据:{d.data}</Tag>}
          {d.visual && <Tag>视觉:{d.visual}</Tag>}
          {d.techGen && <Tag>技术:{d.techGen}</Tag>}
        </Space>
      );
    },
  },
];

export function VariantComparePage() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allVariants = useMemo(() => getAllVariants(), []);

  const variantOptions = useMemo(
    () =>
      allVariants.map((v) => ({
        value: v.id,
        label: `${v.id} ${v.name}`,
      })),
    [allVariants],
  );

  const variants = useMemo(
    () => selectedIds.map((id) => getVariantById(id)).filter(Boolean) as ComponentVariant[],
    [selectedIds],
  );

  const addVariant = (id: string) => {
    if (selectedIds.length >= MAX_COMPARE) {
      message.warning(`最多对比 ${MAX_COMPARE} 个形态`);
      return;
    }
    if (selectedIds.includes(id)) {
      message.warning('该形态已在对比列表中');
      return;
    }
    setSelectedIds([...selectedIds, id]);
  };

  const removeVariant = (id: string) => {
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
  };

  const colSpan = variants.length <= 2 ? 12 : variants.length === 3 ? 8 : 6;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <SwapOutlined style={{ marginRight: 8 }} />
          形态对比
        </Title>
        <Text type="secondary">选择 2-{MAX_COMPARE} 个形态，从多维度直观比较差异</Text>
      </div>

      {/* 选择器 */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Text strong>添加形态到对比：</Text>
          <Select
            showSearch
            placeholder="搜索并添加形态（编号、名称、关键词）..."
            style={{ width: '100%' }}
            options={variantOptions}
            value={undefined}
            onChange={(val: string) => {
              if (val) addVariant(val);
            }}
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
            }
          />
          <Space wrap>
            <Text type="secondary">
              已选 {selectedIds.length}/{MAX_COMPARE}：
            </Text>
            {selectedIds.map((id) => {
              const v = getVariantById(id);
              return (
                <Tag
                  key={id}
                  closable
                  onClose={() => removeVariant(id)}
                  color="blue"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/catalog/v/${id}`)}
                >
                  {id} {v?.name}
                </Tag>
              );
            })}
            {selectedIds.length === 0 && <Text type="secondary">暂未选择</Text>}
          </Space>
        </Space>
      </Card>

      {/* 对比结果 */}
      {variants.length < 2 ? (
        <Empty
          description={`请至少选择 2 个形态开始对比（已选 ${variants.length} 个）`}
          style={{ marginTop: 48 }}
        />
      ) : (
        <>
          {/* 头部：形态卡片 */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            {variants.map((v) => {
              const category = getCategoryOfVariant(v.id);
              const component = getComponentOfVariant(v.id);
              return (
                <Col key={v.id} xs={24} sm={12} md={colSpan}>
                  <Card
                    size="small"
                    title={
                      <Space>
                        <Tag color="blue">{v.id}</Tag>
                        <Text strong>{v.name}</Text>
                      </Space>
                    }
                    extra={
                      <Button
                        type="text"
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={() => removeVariant(v.id)}
                      />
                    }
                  >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {category?.categoryName} / {component?.name}
                    </Text>
                    <div style={{ marginTop: 8 }}>{v.tagline}</div>
                    <div style={{ marginTop: 8 }}>
                      <Space split={<Divider type="vertical" />}>
                        <span>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            复杂度：
                          </Text>
                          <Rate
                            disabled
                            defaultValue={v.complexity ?? 0}
                            count={5}
                            style={{ fontSize: 12 }}
                          />
                        </span>
                        <span>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            推荐：
                          </Text>
                          <Rate
                            disabled
                            defaultValue={v.rating ?? 0}
                            count={5}
                            style={{ fontSize: 12 }}
                          />
                        </span>
                      </Space>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* 对比维度表格 */}
          <Card title="多维度对比">
            {compareDimensions.map((dim) => (
              <div
                key={dim.key}
                style={{
                  display: 'flex',
                  borderBottom: '1px solid #f0f0f0',
                  padding: '12px 0',
                }}
              >
                <div style={{ width: 120, flexShrink: 0, fontWeight: 500, color: '#595959' }}>
                  {dim.label}
                </div>
                <div style={{ flex: 1, display: 'flex', gap: 16 }}>
                  {variants.map((v) => (
                    <div key={v.id} style={{ flex: 1 }}>
                      {dim.render(v)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>

          {/* 操作 */}
          <Divider />
          <Space>
            <Button
              icon={<CopyOutlined />}
              onClick={() => {
                const text = variants.map((v) => `${v.id} ${v.name}：${v.tagline}`).join('\n');
                navigator.clipboard.writeText(text);
                message.success('已复制对比摘要');
              }}
            >
              复制摘要
            </Button>
            <Button onClick={() => setSelectedIds([])}>清空选择</Button>
          </Space>
        </>
      )}
    </div>
  );
}
