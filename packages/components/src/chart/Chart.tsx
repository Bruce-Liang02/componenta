/**
 * Ant Design 风格 Chart 变体（基于 ECharts）
 */
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Empty } from 'antd';
import type { ChartProps } from './types';

export function Chart({
  type: _type,
  option,
  width = '100%',
  height = 320,
  loading = false,
  theme,
  title,
  toolbar,
  bordered = true,
}: ChartProps) {
  // 如果没有数据，显示空状态
  const isEmptyOption =
    !option ||
    (Array.isArray((option as { series?: unknown[] }).series) &&
      (option as { series?: { data?: unknown[] }[] }).series?.every(
        (s) => !s.data || s.data.length === 0,
      ));

  const chartNode = isEmptyOption ? (
    <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty description="暂无数据" />
    </div>
  ) : (
    <ReactECharts
      option={option}
      style={{ width, height }}
      theme={theme}
      notMerge
      lazyUpdate
      opts={{ renderer: 'canvas' }}
    />
  );

  const content = loading ? (
    <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      加载中...
    </div>
  ) : (
    chartNode
  );

  if (title || toolbar) {
    return (
      <Card title={title} extra={toolbar} bordered={bordered} styles={{ body: { padding: 16 } }}>
        {content}
      </Card>
    );
  }

  return content;
}

Chart.displayName = 'Chart';

export default Chart;
