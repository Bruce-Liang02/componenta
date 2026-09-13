/**
 * PageSchema 生成器
 *
 * 从选型目录中选择形态后，自动生成 PageSchema 供 SchemaRenderer 渲染
 */
import React, { useState, useMemo } from 'react';
import { Typography, Card, Select, Button, Space, Tag, message, Input, Divider } from 'antd';
import {
  CodeOutlined,
  CopyOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  getVariantById,
  getAllVariants,
  getCategoryOfVariant,
  getComponentOfVariant,
} from '../data/catalogStore';
import type { ComponentVariant } from '../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface BlockConfig {
  id: string;
  variantId: string;
  props: Record<string, unknown>;
}

/** 根据形态生成 BlockSchema */
function generateBlockSchema(block: BlockConfig): Record<string, unknown> {
  const variant = getVariantById(block.variantId);
  if (!variant) return {};

  const component = getComponentOfVariant(block.variantId);

  // 根据形态的维度信息映射到组件类型
  const componentType = mapVariantToComponentType(variant, component?.component ?? '');

  return {
    id: block.id,
    componentType,
    componentImpl: block.variantId,
    props: {
      ...block.props,
      _variantId: block.variantId,
      _variantName: variant.name,
    },
  };
}

/** 根据形态映射到组件类型 */
function mapVariantToComponentType(variant: ComponentVariant, componentKey: string): string {
  // 基于组件标识映射
  const typeMap: Record<string, string> = {
    'pro-table': 'List',
    'search-form': 'Form',
    descriptions: 'Card',
    form: 'Form',
    selector: 'Form',
    upload: 'Form',
    chart: 'Chart',
    'stat-card': 'Card',
    dashboard: 'Chart',
    menu: 'Custom',
    tabs: 'Custom',
    breadcrumb: 'Custom',
    'flow-designer': 'Custom',
    approval: 'Custom',
    'status-tag': 'Custom',
    notification: 'Custom',
    result: 'Custom',
  };

  // 先尝试精确匹配组件 key
  if (typeMap[componentKey]) return typeMap[componentKey];

  // 根据 ID 前缀推断
  const prefix = variant.id.slice(0, 2);
  const prefixMap: Record<string, string> = {
    PT: 'List',
    IP: 'Form',
    VS: 'Chart',
    NV: 'Custom',
    WF: 'Custom',
    FB: 'Custom',
    AU: 'Custom',
    AB: 'Custom',
    IG: 'Custom',
  };

  return prefixMap[prefix] ?? 'Custom';
}

/** 生成完整的 PageSchema */
function generatePageSchema(
  pageId: string,
  pageName: string,
  blocks: BlockConfig[],
  themePack?: string,
): Record<string, unknown> {
  return {
    id: pageId,
    version: '0.1.0',
    ...(themePack ? { themePack } : {}),
    layout: {
      type: 'sidebar-main',
      regions: [
        {
          name: 'header',
          blocks: [
            {
              id: `${pageId}-header`,
              componentType: 'Custom',
              props: {
                title: pageName,
                type: 'page-header',
              },
            },
          ],
        },
        {
          name: 'main',
          blocks: blocks.map(generateBlockSchema),
        },
      ],
    },
  };
}

export function PageSchemaGenerator() {
  const [pageId, setPageId] = useState('page-001');
  const [pageName, setPageName] = useState('新建页面');
  const [blocks, setBlocks] = useState<BlockConfig[]>([
    { id: 'block-1', variantId: 'PT001', props: { title: '数据列表' } },
  ]);
  const [generatedSchema, setGeneratedSchema] = useState<string>('');

  const allVariants = useMemo(() => getAllVariants(), []);

  const variantOptions = useMemo(
    () =>
      allVariants.map((v) => ({
        value: v.id,
        label: `${v.id} ${v.name}`,
      })),
    [allVariants],
  );

  const addBlock = () => {
    const newId = `block-${blocks.length + 1}`;
    setBlocks([...blocks, { id: newId, variantId: '', props: {} }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const updateBlock = (id: string, updates: Partial<BlockConfig>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const handleGenerate = () => {
    const schema = generatePageSchema(pageId, pageName, blocks);
    setGeneratedSchema(JSON.stringify(schema, null, 2));
    message.success('PageSchema 已生成');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSchema);
    message.success('已复制到剪贴板');
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <CodeOutlined style={{ marginRight: 8 }} />
          PageSchema 生成器
        </Title>
        <Text type="secondary">
          从选型目录中选择形态，自动生成 PageSchema JSON，可直接用于 SchemaRenderer 渲染
        </Text>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* 左侧：配置区 */}
        <div style={{ flex: 1 }}>
          <Card title="页面配置" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>
                  页面 ID
                </Text>
                <Input value={pageId} onChange={(e) => setPageId(e.target.value)} />
              </div>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>
                  页面名称
                </Text>
                <Input value={pageName} onChange={(e) => setPageName(e.target.value)} />
              </div>
            </Space>
          </Card>

          <Card
            title={`区块配置（${blocks.length} 个）`}
            extra={
              <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addBlock}>
                添加区块
              </Button>
            }
          >
            {blocks.map((block, idx) => {
              const variant = block.variantId ? getVariantById(block.variantId) : null;
              const category = block.variantId ? getCategoryOfVariant(block.variantId) : null;
              return (
                <Card
                  key={block.id}
                  size="small"
                  style={{ marginBottom: 12, borderColor: '#d9d9d9' }}
                  title={
                    <Space>
                      <Tag>#{idx + 1}</Tag>
                      <Text code>{block.id}</Text>
                    </Space>
                  }
                  extra={
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeBlock(block.id)}
                    />
                  }
                >
                  <div style={{ marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 12 }}>
                      选择形态：
                    </Text>
                    <Select
                      showSearch
                      style={{ width: '100%', marginTop: 4 }}
                      placeholder="搜索并选择形态..."
                      value={block.variantId || undefined}
                      onChange={(val) => updateBlock(block.id, { variantId: val })}
                      options={variantOptions}
                      filterOption={(input, option) =>
                        (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ??
                        false
                      }
                    />
                  </div>
                  {variant && (
                    <div style={{ marginTop: 8 }}>
                      <Space wrap size={4}>
                        <Tag color="blue">{variant.id}</Tag>
                        <Tag>{category?.categoryName}</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          →{' '}
                          {mapVariantToComponentType(
                            variant,
                            getComponentOfVariant(variant.id)?.component ?? '',
                          )}
                        </Text>
                      </Space>
                    </div>
                  )}
                </Card>
              );
            })}
          </Card>

          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleGenerate}
            block
            size="large"
          >
            生成 PageSchema
          </Button>
        </div>

        {/* 右侧：JSON 输出 */}
        <div style={{ flex: 1 }}>
          <Card
            title="PageSchema JSON"
            extra={
              generatedSchema && (
                <Button icon={<CopyOutlined />} size="small" onClick={handleCopy}>
                  复制
                </Button>
              )
            }
          >
            {generatedSchema ? (
              <TextArea
                value={generatedSchema}
                readOnly
                autoSize={{ minRows: 10, maxRows: 30 }}
                style={{ fontFamily: 'monospace', fontSize: 12 }}
              />
            ) : (
              <Text type="secondary">点击「生成 PageSchema」查看输出</Text>
            )}
          </Card>

          <Divider />

          <Card title="使用说明" size="small">
            <Paragraph type="secondary" style={{ fontSize: 12 }}>
              1. 在左侧配置页面信息和区块
              <br />
              2. 每个区块选择一个形态变体
              <br />
              3. 点击「生成 PageSchema」获得 JSON
              <br />
              4. JSON 可直接传入 <Text code>&lt;SchemaRenderer schema={'{...}'} /&gt;</Text> 渲染
              <br />
              5. 形态的维度信息会自动映射为组件类型和实现变体
            </Paragraph>
          </Card>
        </div>
      </div>
    </div>
  );
}
