/**
 * Ant Design Card 变体（支持统计数值展示）
 */
import React from 'react';
import { Card as AntCard, Statistic, Typography } from 'antd';
import type { CardProps } from './types';

const { Text } = Typography;

export function Card({
  title,
  subTitle,
  extra,
  children,
  cover,
  hoverable,
  bordered = true,
  size = 'default',
  style,
  onClick,
  statistic,
}: CardProps) {
  const renderContent = () => {
    if (statistic) {
      return (
        <Statistic
          title={statistic.title}
          value={statistic.value}
          prefix={statistic.prefix}
          suffix={statistic.suffix}
          valueStyle={{
            color:
              statistic.trend === 'up'
                ? '#3f8600'
                : statistic.trend === 'down'
                  ? '#cf1322'
                  : undefined,
          }}
        />
      );
    }
    return children;
  };

  return (
    <AntCard
      title={
        title ? (
          <div>
            {title}
            {subTitle && (
              <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                {subTitle}
              </Text>
            )}
          </div>
        ) : undefined
      }
      extra={extra}
      cover={cover}
      hoverable={hoverable ?? !!onClick}
      bordered={bordered}
      size={size}
      style={{ cursor: onClick ? 'pointer' : undefined, ...style }}
      onClick={onClick}
    >
      {renderContent()}
    </AntCard>
  );
}

Card.displayName = 'Card';

export default Card;
