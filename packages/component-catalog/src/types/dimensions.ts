/**
 * 形态维度定义
 *
 * 5 个维度的枚举值和中文描述
 */

export const DIMENSION_LABELS = {
  layout: {
    label: '布局形态',
    values: {
      'standard-table': '标准表格',
      'card-list': '卡片列表',
      compact: '紧凑密度',
      grouped: '分组折叠',
      tree: '树形结构',
    },
  },
  interaction: {
    label: '交互形态',
    values: {
      'inline-edit': '行内编辑',
      'modal-edit': '弹窗编辑',
      'drawer-edit': '抽屉编辑',
      'batch-edit': '批量编辑',
      readonly: '只读',
    },
  },
  data: {
    label: '数据策略',
    values: {
      'frontend-page': '前端分页',
      'backend-page': '后端分页',
      'infinite-scroll': '无限滚动',
      'virtual-scroll': '虚拟滚动',
      'all-loaded': '全量加载',
    },
  },
  visual: {
    label: '视觉风格',
    values: {
      traditional: '传统后台',
      modern: '现代简约',
      'data-dense': '数据密集',
      'card-based': '卡片化',
      minimal: '极简',
    },
  },
  techGen: {
    label: '技术代际',
    values: {
      antd: 'Ant Design 系',
      shadcn: 'shadcn 系',
      'tailwind-native': 'Tailwind 原生',
      'ag-grid': 'AG Grid 系',
      custom: '自定义',
    },
  },
} as const;

/** 获取维度值的中文标签 */
export function getDimensionLabel(
  dimension: keyof typeof DIMENSION_LABELS,
  value: string | undefined,
): string {
  if (!value) return '-';
  const dim = DIMENSION_LABELS[dimension];
  return (dim.values as Record<string, string>)[value] ?? value;
}

/** 获取形态维度的完整描述 */
export function getDimensionsDescription(dimensions?: {
  layout?: string;
  interaction?: string;
  data?: string;
  visual?: string;
  techGen?: string;
}): string {
  if (!dimensions) return '-';
  const parts: string[] = [];
  if (dimensions.layout) parts.push(`D1:${getDimensionLabel('layout', dimensions.layout)}`);
  if (dimensions.interaction)
    parts.push(`D2:${getDimensionLabel('interaction', dimensions.interaction)}`);
  if (dimensions.data) parts.push(`D3:${getDimensionLabel('data', dimensions.data)}`);
  if (dimensions.visual) parts.push(`D4:${getDimensionLabel('visual', dimensions.visual)}`);
  if (dimensions.techGen) parts.push(`D5:${getDimensionLabel('techGen', dimensions.techGen)}`);
  return parts.length > 0 ? parts.join(' + ') : '-';
}
