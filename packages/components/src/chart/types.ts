/**
 * Chart 组件契约
 */
import type { ReactNode } from 'react';
import type { EChartsOption } from 'echarts';

export type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'custom';

export interface ChartProps {
  /** 图表类型（用于预设） */
  type?: ChartType;
  /** ECharts option（完整配置，type 仅做预设参考） */
  option: EChartsOption;
  /** 宽度 */
  width?: number | string;
  /** 高度 */
  height?: number | string;
  /** 是否显示加载 */
  loading?: boolean;
  /** 主题 */
  theme?: string;
  /** 标题（外层 Card） */
  title?: ReactNode;
  /** 工具栏（外层 Card） */
  toolbar?: ReactNode;
  /** 是否显示边框 */
  bordered?: boolean;
}
