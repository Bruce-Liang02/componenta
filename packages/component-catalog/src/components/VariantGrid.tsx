/**
 * 形态卡片网格布局
 */
import React from 'react';
import { Row, Col } from 'antd';
import { VariantCard } from './VariantCard';
import type { ComponentVariant } from '../types';

export interface VariantGridProps {
  variants: ComponentVariant[];
  /** 每行显示几个卡片（响应式） */
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  };
  onDetail?: (variantId: string) => void;
  onCopy?: (variantId: string) => void;
  onCompare?: (variantId: string) => void;
}

const defaultCols = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
  xxl: 6,
};

export function VariantGrid({
  variants,
  cols = defaultCols,
  onDetail,
  onCopy,
  onCompare,
}: VariantGridProps) {
  return (
    <Row gutter={[16, 16]}>
      {variants.map((variant) => (
        <React.Fragment key={variant.id}>
          <Col
            xs={24 / (cols.xs ?? 1)}
            sm={24 / (cols.sm ?? 2)}
            md={24 / (cols.md ?? 3)}
            lg={24 / (cols.lg ?? 4)}
            xl={24 / (cols.xl ?? 5)}
            xxl={24 / (cols.xxl ?? 6)}
          >
            <VariantCard
              variant={variant}
              onDetail={onDetail}
              onCopy={onCopy}
              onCompare={onCompare}
            />
          </Col>
        </React.Fragment>
      ))}
    </Row>
  );
}
