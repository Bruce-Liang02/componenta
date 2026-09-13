/**
 * 形态详情页
 *
 * 一形态一页，展示完整的选型信息
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Row,
  Col,
  Tag,
  Rate,
  Button,
  Space,
  Divider,
  message,
  Breadcrumb,
  Collapse,
  Alert,
} from 'antd';
import {
  CopyOutlined,
  CodeOutlined,
  PlayCircleOutlined,
  ArrowLeftOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { getVariantById, getCategoryOfVariant, getComponentOfVariant } from '../data/catalogStore';
import { getDimensionsDescription } from '../types/dimensions';

const { Title, Text, Paragraph } = Typography;

export function VariantDetailPage() {
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

  const category = getCategoryOfVariant(id);
  const component = getComponentOfVariant(id);

  // 复制编号
  const handleCopy = () => {
    navigator.clipboard.writeText(variant.id);
    message.success(`已复制编号：${variant.id}`);
  };

  // 跳转到同类形态
  const handleRelatedClick = (relatedId: string) => {
    navigate(`/catalog/v/${relatedId}`);
  };

  // 跳转到跨组件关联
  const handleRelatedComponentClick = (relatedId: string) => {
    navigate(`/catalog/v/${relatedId}`);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* 面包屑 */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <a onClick={() => navigate('/catalog')}>选型目录</a> },
          { title: category?.categoryName ?? '-' },
          { title: component?.name ?? '-' },
          { title: variant.id },
        ]}
      />

      {/* 废弃提示 */}
      {variant.status === 'deprecated' && (
        <Alert
          type="warning"
          showIcon
          message="该形态已废弃"
          description={
            <div>
              <div>{variant.deprecatedNote}</div>
              {variant.replacedBy && (
                <div style={{ marginTop: 8 }}>
                  替代形态：
                  <a onClick={() => handleRelatedClick(variant.replacedBy!)}>
                    {variant.replacedBy}
                  </a>
                </div>
              )}
            </div>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 标题区 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Space align="baseline">
              <Title level={2} style={{ margin: 0 }}>
                <Text code style={{ fontSize: 20, color: '#1890ff' }}>
                  {variant.id}
                </Text>
                {' · '}
                {variant.name}
              </Title>
              <Tag color={variant.status === 'active' ? 'green' : 'red'}>
                {variant.status === 'active' ? '活跃' : '已废弃'}
              </Tag>
            </Space>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                所属组件：{component?.name} | 类别：{category?.categoryName}
              </Text>
              {variant.versions &&
                variant.versions.length > 0 &&
                (() => {
                  const latest = variant.versions![0];
                  return latest ? (
                    <Text type="secondary" style={{ marginLeft: 16 }}>
                      版本：v{latest.version} ({latest.date})
                    </Text>
                  ) : null;
                })()}
            </div>
          </div>
          <Button icon={<CopyOutlined />} onClick={handleCopy}>
            复制编号
          </Button>
        </div>
      </div>

      {/* 缩略图 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {variant.thumb.map((thumbUrl, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card
              size="small"
              cover={
                <div
                  style={{
                    height: 200,
                    background: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={thumbUrl}
                    alt={`${variant.name} - 图 ${index + 1}`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {!thumbUrl && <Text type="secondary">暂无缩略图</Text>}
                </div>
              }
            />
          </Col>
        ))}
      </Row>

      {/* 一句话定位 */}
      <Card style={{ marginBottom: 24, background: '#f6ffed', borderColor: '#b7eb8f' }}>
        <Text strong style={{ fontSize: 16 }}>
          💡 一句话定位
        </Text>
        <Paragraph style={{ fontSize: 16, marginTop: 8, marginBottom: 0 }}>
          {variant.tagline}
        </Paragraph>
      </Card>

      {/* 优缺点 + 适用场景 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="✅ 优点" size="small">
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {variant.pros.map((pro, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  {pro}
                </li>
              ))}
            </ul>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="❌ 缺点" size="small">
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {variant.cons.map((con, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  {con}
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="🎯 适用场景" size="small">
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {variant.useCases.map((uc, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  {uc}
                </li>
              ))}
            </ul>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="🚫 不适用场景" size="small">
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {variant.antiCases.map((ac, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  {ac}
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>

      {/* 同类形态对比 */}
      {variant.related && variant.related.length > 0 && (
        <Card title="🔀 同类形态对比" size="small" style={{ marginBottom: 24 }}>
          <Space wrap>
            {variant.related.map((relatedId) => (
              <Button
                key={relatedId}
                type={relatedId === variant.id ? 'primary' : 'default'}
                onClick={() => handleRelatedClick(relatedId)}
              >
                {relatedId}
              </Button>
            ))}
          </Space>
        </Card>
      )}

      {/* 跨组件关联 */}
      {variant.relatedComponents && variant.relatedComponents.length > 0 && (
        <Card title="🔗 跨组件关联" size="small" style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {variant.relatedComponents.map((rc) => (
              <div key={rc.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag color="blue">{rc.relation}</Tag>
                <Button type="link" onClick={() => handleRelatedComponentClick(rc.id)}>
                  {rc.id}（{rc.name}）
                </Button>
                <Text type="secondary">— {rc.reason}</Text>
              </div>
            ))}
          </Space>
        </Card>
      )}

      {/* 技术信息 */}
      <Card title="📊 技术信息" size="small" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {variant.tech && (
            <Col xs={24} md={12}>
              <Text strong>技术实现：</Text>
              <div>{variant.tech}</div>
            </Col>
          )}
          {variant.dependencies && variant.dependencies.length > 0 && (
            <Col xs={24} md={12}>
              <Text strong>依赖：</Text>
              <div>
                {variant.dependencies.map((dep) => (
                  <Tag key={dep}>{dep}</Tag>
                ))}
              </div>
            </Col>
          )}
          {variant.dimensions && (
            <Col xs={24}>
              <Text strong>形态维度：</Text>
              <div>
                <Tag>{getDimensionsDescription(variant.dimensions)}</Tag>
              </div>
            </Col>
          )}
          <Col xs={24} md={12}>
            <Space split={<Divider type="vertical" />}>
              <span>
                <Text strong>复杂度：</Text>
                <Rate disabled defaultValue={variant.complexity ?? 0} style={{ fontSize: 14 }} />
              </span>
              <span>
                <Text strong>推荐指数：</Text>
                <Rate disabled defaultValue={variant.rating ?? 0} style={{ fontSize: 14 }} />
              </span>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Space size="large">
              <span>
                <Text strong>性能：</Text>
                <Tag
                  color={
                    variant.performance === 'high'
                      ? 'green'
                      : variant.performance === 'medium'
                        ? 'orange'
                        : 'red'
                  }
                >
                  {variant.performance === 'high'
                    ? '⚡高'
                    : variant.performance === 'medium'
                      ? '⚡中'
                      : '⚡低'}
                </Tag>
              </span>
              <span>
                <Text strong>无障碍：</Text>
                <Tag
                  color={
                    variant.accessibility === 'excellent'
                      ? 'green'
                      : variant.accessibility === 'good'
                        ? 'blue'
                        : 'default'
                  }
                >
                  {variant.accessibility === 'excellent'
                    ? '♿优秀'
                    : variant.accessibility === 'good'
                      ? '♿良好'
                      : '♿基础'}
                </Tag>
              </span>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 版本历史 */}
      {variant.versions && variant.versions.length > 0 && (
        <Card title="📝 版本历史" size="small" style={{ marginBottom: 24 }}>
          <Collapse
            items={variant.versions.map((v) => ({
              key: v.version,
              label: `v${v.version} — ${v.date}`,
              children: <Paragraph>{v.changes}</Paragraph>,
            }))}
          />
        </Card>
      )}

      {/* 标签 */}
      {variant.tags && variant.tags.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Text strong>标签：</Text>
          <div style={{ marginTop: 8 }}>
            <Space wrap>
              {variant.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <Divider />
      <Space size="middle">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/catalog')}>
          返回目录
        </Button>
        {variant.demo && (
          <Button type="primary" icon={<PlayCircleOutlined />}>
            在线演示
          </Button>
        )}
        {variant.sourceCode && <Button icon={<CodeOutlined />}>查看源码</Button>}
        <Button icon={<CopyOutlined />} onClick={handleCopy}>
          复制编号
        </Button>
        <Button type="primary" icon={<SwapOutlined />}>
          在 Componenta 中使用
        </Button>
      </Space>
    </div>
  );
}
