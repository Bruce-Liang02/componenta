/**
 * 形态卡片组件
 *
 * 展示在总览页的卡片，包含缩略图、编号、名称、一句话定位、评级
 */
import React from 'react';
import { Card, Typography, Tag, Tooltip, Button, Space } from 'antd';
import { CopyOutlined, SwapOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { ComponentVariant } from '../types';

const { Text, Paragraph } = Typography;

export interface VariantCardProps {
  variant: ComponentVariant;
  /** 点击查看详情 */
  onDetail?: (variantId: string) => void;
  /** 点击复制编号 */
  onCopy?: (variantId: string) => void;
  /** 点击加入对比 */
  onCompare?: (variantId: string) => void;
}

/** 性能标识颜色 */
function getPerformanceColor(perf?: string): string {
  switch (perf) {
    case 'high':
      return '#52c41a';
    case 'medium':
      return '#faad14';
    case 'low':
      return '#ff4d4f';
    default:
      return '#d9d9d9';
  }
}

/** 性能文字 */
function getPerformanceLabel(perf?: string): string {
  switch (perf) {
    case 'high':
      return '⚡高';
    case 'medium':
      return '⚡中';
    case 'low':
      return '⚡低';
    default:
      return '-';
  }
}

/** 无障碍标识 */
function getAccessibilityLabel(a11y?: string): string {
  switch (a11y) {
    case 'excellent':
      return '♿优秀';
    case 'good':
      return '♿良好';
    case 'basic':
      return '♿基础';
    default:
      return '-';
  }
}

export function VariantCard({ variant, onDetail, onCopy, onCompare }: VariantCardProps) {
  const isDeprecated = variant.status === 'deprecated';

  return (
    <Card
      hoverable
      size="small"
      style={{
        height: '100%',
        opacity: isDeprecated ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
      styles={{
        body: { padding: 0 },
      }}
      onClick={() => onDetail?.(variant.id)}
    >
      {/* 废弃标记 */}
      {isDeprecated && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
          }}
        >
          <Tag color="red">已废弃</Tag>
        </div>
      )}

      {/* 缩略图区域 */}
      <div
        style={{
          height: 140,
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {variant.thumb[0] ? (
          <img
            src={variant.thumb[0]}
            alt={variant.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              // 图片加载失败时显示占位
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            暂无缩略图
          </Text>
        )}

        {/* 悬浮操作按钮 */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
          className="variant-card-actions"
        >
          <Space size={4}>
            <Tooltip title="复制编号">
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy?.(variant.id);
                }}
              />
            </Tooltip>
            <Tooltip title="加入对比">
              <Button
                size="small"
                icon={<SwapOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onCompare?.(variant.id);
                }}
              />
            </Tooltip>
          </Space>
        </div>
      </div>

      {/* 信息区域 */}
      <div style={{ padding: '12px 16px' }}>
        {/* 编号 + 性能 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text
            strong
            style={{
              fontFamily: 'monospace',
              fontSize: 14,
              color: '#1890ff',
            }}
          >
            {variant.id}
          </Text>
          <Text style={{ fontSize: 11, color: getPerformanceColor(variant.performance) }}>
            {getPerformanceLabel(variant.performance)}
          </Text>
        </div>

        {/* 名称 */}
        <div style={{ marginTop: 4 }}>
          <Text strong style={{ fontSize: 14 }}>
            {variant.name}
          </Text>
        </div>

        {/* 一句话定位 */}
        <Paragraph
          type="secondary"
          style={{
            fontSize: 12,
            marginTop: 4,
            marginBottom: 8,
            height: 36,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {variant.tagline}
        </Paragraph>

        {/* 评级 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size={8}>
            <Tooltip title="复杂度">
              <span style={{ fontSize: 11 }}>
                {'★'.repeat(variant.complexity ?? 0)}
                {'☆'.repeat(5 - (variant.complexity ?? 0))}
              </span>
            </Tooltip>
            <Tooltip title="推荐指数">
              <span style={{ fontSize: 11, color: '#faad14' }}>
                {'★'.repeat(variant.rating ?? 0)}
                {'☆'.repeat(5 - (variant.rating ?? 0))}
              </span>
            </Tooltip>
          </Space>
          <Tooltip title={getAccessibilityLabel(variant.accessibility)}>
            <InfoCircleOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
          </Tooltip>
        </div>
      </div>

      {/* 悬浮样式 */}
      <style>{`
        .variant-card-actions {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .ant-card:hover .variant-card-actions {
          opacity: 1;
        }
      `}</style>
    </Card>
  );
}
