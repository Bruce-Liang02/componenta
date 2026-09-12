/**
 * CardList 变体：以卡片形式展示列表数据
 */
import React from 'react';
import { Card, Row, Col, Empty, Typography } from 'antd';
import type { ListProps } from './types';

const { Text, Paragraph } = Typography;

export interface CardListProps<T = Record<string, unknown>> extends ListProps<T> {
  /** 每行列数（响应式） */
  cols?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** 卡片标题字段 */
  titleField?: string;
  /** 卡片描述字段 */
  descriptionField?: string;
  /** 卡片封面图字段 */
  coverField?: string;
}

export function CardList<T extends Record<string, unknown> = Record<string, unknown>>({
  dataSource = [],
  rowKey = 'id',
  loading = false,
  emptyText,
  title,
  toolbar,
  cols = { xs: 1, sm: 2, md: 3, lg: 3, xl: 4 },
  titleField = 'title',
  descriptionField = 'description',
  coverField,
  onRowClick,
}: CardListProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(record);
    return String(record[rowKey] ?? index);
  };

  return (
    <div>
      {(title || toolbar) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          {title && (
            <Text strong style={{ fontSize: 16 }}>
              {title}
            </Text>
          )}
          {toolbar}
        </div>
      )}
      <Row gutter={[16, 16]}>
        {dataSource.length === 0 && !loading && (
          <Col span={24}>
            <Empty description={emptyText ?? '暂无数据'} />
          </Col>
        )}
        {dataSource.map((record, index) => (
          <Col key={getRowKey(record, index)} {...cols}>
            <Card
              hoverable={!!onRowClick}
              onClick={() => onRowClick?.(record, index)}
              cover={
                coverField && record[coverField] ? (
                  <img
                    alt={String(record[titleField] ?? '')}
                    src={String(record[coverField])}
                    style={{ height: 160, objectFit: 'cover' }}
                  />
                ) : undefined
              }
              styles={{ body: { padding: 16 } }}
            >
              <Card.Meta
                title={String(record[titleField] ?? '')}
                description={
                  record[descriptionField] ? (
                    <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
                      {String(record[descriptionField])}
                    </Paragraph>
                  ) : undefined
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

CardList.displayName = 'CardList';

export default CardList;
