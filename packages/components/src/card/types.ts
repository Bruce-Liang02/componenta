/**
 * Card 组件契约
 */
import type { ReactNode } from 'react';

export interface CardProps {
  /** 卡片标题 */
  title?: ReactNode;
  /** 副标题 */
  subTitle?: ReactNode;
  /** 额外操作（右上角） */
  extra?: ReactNode;
  /** 卡片内容 */
  children?: ReactNode;
  /** 封面图 */
  cover?: ReactNode;
  /** 是否可悬浮 */
  hoverable?: boolean;
  /** 是否带边框 */
  bordered?: boolean;
  /** 尺寸 */
  size?: 'small' | 'default';
  /** 样式 */
  style?: React.CSSProperties;
  /** 点击事件 */
  onClick?: () => void;
  /** 统计数值模式（显示数字） */
  statistic?: {
    title: string;
    value: number | string;
    prefix?: ReactNode;
    suffix?: ReactNode;
    trend?: 'up' | 'down';
    trendValue?: string;
  };
}
