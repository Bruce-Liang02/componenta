/**
 * 总览目录页
 *
 * 单页展示全部形态，支持搜索、筛选、锚点导航
 */
import React, { useState, useMemo, useRef } from 'react';
import { Input, Select, Typography, Anchor, message, Tag, Space, Badge } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { VariantGrid } from '../components/VariantGrid';
import { getAllCategories, searchVariants, getVariantCountByCategory } from '../data/catalogStore';
import type { CategoryData, ComponentVariant } from '../types';

const { Title, Text } = Typography;

export interface CatalogPageProps {
  onNavigate?: (path: string) => void;
}

export function CatalogPage({ onNavigate }: CatalogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const categories = getAllCategories();
  const variantCounts = getVariantCountByCategory();

  // 搜索过滤
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchVariants(searchQuery);
  }, [searchQuery]);

  // 按类别筛选
  const filteredCategories = useMemo(() => {
    let result = categories;
    if (selectedCategory !== 'all') {
      result = categories.filter((c) => c.category === selectedCategory);
    }
    return result;
  }, [categories, selectedCategory]);

  // 获取类别下的全部形态
  const getCategoryVariants = (category: CategoryData): ComponentVariant[] => {
    const variants: ComponentVariant[] = [];
    for (const comp of category.components) {
      variants.push(...comp.variants);
    }
    return variants;
  };

  // 跳转到详情
  const handleDetail = (variantId: string) => {
    onNavigate?.(`/catalog/v/${variantId}`);
  };

  // 复制编号
  const handleCopy = (variantId: string) => {
    navigator.clipboard.writeText(variantId);
    message.success(`已复制编号：${variantId}`);
  };

  // 滚动到类别
  const scrollToCategory = (categoryCode: string) => {
    const el = categoryRefs.current[categoryCode];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 展开/收起类别
  const toggleCategory = (categoryCode: string) => {
    setCollapsedCategories((prev) =>
      prev.includes(categoryCode)
        ? prev.filter((c) => c !== categoryCode)
        : [...prev, categoryCode],
    );
  };

  return (
    <div style={{ display: 'flex', gap: 24, minHeight: '100%' }}>
      {/* 侧边锚点导航 */}
      <div
        style={{
          width: 200,
          flexShrink: 0,
          position: 'sticky',
          top: 24,
          alignSelf: 'flex-start',
          maxHeight: 'calc(100vh - 120px)',
          overflow: 'auto',
        }}
      >
        <Title level={5} style={{ marginBottom: 12 }}>
          类别导航
        </Title>
        <Anchor
          affix={false}
          items={[
            {
              key: 'all',
              href: '#all',
              title: (
                <span>
                  全部{' '}
                  <Badge
                    count={Object.values(variantCounts).reduce((a, b) => a + b, 0)}
                    style={{ backgroundColor: '#1890ff', marginLeft: 4 }}
                    size="small"
                  />
                </span>
              ),
            },
            ...categories.map((cat) => ({
              key: cat.category,
              href: `#${cat.category}`,
              title: (
                <span>
                  {cat.categoryName}{' '}
                  <Badge
                    count={variantCounts[cat.category] || 0}
                    style={{ backgroundColor: '#8c8c8c', marginLeft: 4 }}
                    size="small"
                  />
                </span>
              ),
            })),
          ]}
          onClick={(e, item) => {
            e.preventDefault();
            const key =
              (item as { key?: string }).key ??
              (item.href === '#all' ? 'all' : item.href.replace('#', ''));
            if (key === 'all') {
              setSelectedCategory('all');
            } else {
              setSelectedCategory(key);
              scrollToCategory(key);
            }
          }}
        />
      </div>

      {/* 主内容区 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 搜索和筛选 */}
        <div style={{ marginBottom: 24 }}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Input
              size="large"
              placeholder="搜索：按编号（如 PT001）、名称、场景关键词..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
            <Space wrap>
              <Text type="secondary">筛选：</Text>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: 160 }}
                options={[
                  { value: 'all', label: '全部类别' },
                  ...categories.map((cat) => ({
                    value: cat.category,
                    label: cat.categoryName,
                  })),
                ]}
              />
              {searchQuery && (
                <Tag closable onClose={() => setSearchQuery('')}>
                  搜索：{searchQuery}
                </Tag>
              )}
            </Space>
          </Space>
        </div>

        {/* 搜索结果模式 */}
        {searchResults !== null ? (
          <div>
            <Title level={4}>搜索结果（{searchResults.length} 个形态）</Title>
            {searchResults.length > 0 ? (
              <VariantGrid variants={searchResults} onDetail={handleDetail} onCopy={handleCopy} />
            ) : (
              <Text type="secondary">未找到匹配的形态</Text>
            )}
          </div>
        ) : (
          /* 类别浏览模式 */
          <div>
            {filteredCategories.map((category) => {
              const variants = getCategoryVariants(category);
              const isCollapsed = collapsedCategories.includes(category.category);

              return (
                <div
                  key={category.category}
                  ref={(el) => {
                    categoryRefs.current[category.category] = el;
                  }}
                  id={category.category}
                  style={{ marginBottom: 32 }}
                >
                  {/* 类别标题 */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 16,
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleCategory(category.category)}
                  >
                    <Space>
                      <Title level={3} style={{ margin: 0 }}>
                        {category.categoryName}
                      </Title>
                      <Tag>{category.category}</Tag>
                      <Text type="secondary">（{variants.length} 个形态）</Text>
                    </Space>
                    <Text type="secondary">{isCollapsed ? '展开' : '收起'}</Text>
                  </div>

                  {/* 类别描述 */}
                  {category.description && (
                    <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                      {category.description}
                    </Text>
                  )}

                  {/* 形态卡片 */}
                  {!isCollapsed && (
                    <div>
                      {category.components.map((comp) => (
                        <div key={comp.component} style={{ marginBottom: 24 }}>
                          <Title level={5} style={{ marginBottom: 12 }}>
                            {comp.name}
                            <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                              {comp.variants.length} 个形态
                            </Text>
                          </Title>
                          <VariantGrid
                            variants={comp.variants}
                            onDetail={handleDetail}
                            onCopy={handleCopy}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
