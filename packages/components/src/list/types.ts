/**
 * List 组件契约（props interface）
 *
 * 所有 List 变体必须遵守此接口，保证 Schema 渲染器可以无差别切换实现。
 */
import type { ReactNode } from 'react';

/** 列定义（兼容 antd Table） */
export interface ListColumn<T = Record<string, unknown>> {
  /** 列标题 */
  title: ReactNode;
  /** 数据字段 */
  dataIndex?: string;
  /** 自定义渲染 */
  render?: (value: unknown, record: T, index: number) => ReactNode;
  /** 列宽 */
  width?: number | string;
  /** 是否可排序 */
  sortable?: boolean;
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 列 key */
  key?: string;
}

/** List 组件通用 Props */
export interface ListProps<T = Record<string, unknown>> {
  /** 数据源 */
  dataSource?: T[];
  /** 列定义 */
  columns?: ListColumn<T>[];
  /** 行唯一键字段 */
  rowKey?: string | ((record: T) => string);
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 分页配置，false 表示不分页 */
  pagination?:
    | false
    | {
        current?: number;
        pageSize?: number;
        total?: number;
        onChange?: (page: number, pageSize: number) => void;
      };
  /** 行点击事件 */
  onRowClick?: (record: T, index: number) => void;
  /** 选择模式 */
  selectionMode?: 'none' | 'single' | 'multiple';
  /** 选中行 keys */
  selectedRowKeys?: (string | number)[];
  /** 选中变化 */
  onSelectionChange?: (keys: (string | number)[], rows: T[]) => void;
  /** 空状态文案 */
  emptyText?: ReactNode;
  /** 标题 */
  title?: ReactNode;
  /** 工具栏 */
  toolbar?: ReactNode;
  /** 紧凑模式 */
  compact?: boolean;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 尺寸 */
  size?: 'small' | 'middle' | 'large';
}
