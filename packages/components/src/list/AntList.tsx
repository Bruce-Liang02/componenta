/**
 * Ant Design List 变体
 *
 * 基于 antd Table 的默认 List 实现。
 */
import React, { useMemo } from 'react';
import { Table, Card } from 'antd';
import type { TableProps } from 'antd';
import type { ListProps } from './types';

export type AntListProps<T = Record<string, unknown>> = ListProps<T>;

export function AntList<T extends Record<string, unknown> = Record<string, unknown>>({
  dataSource = [],
  columns = [],
  rowKey = 'id',
  loading = false,
  pagination,
  onRowClick,
  emptyText,
  title,
  toolbar,
  compact = false,
  bordered = true,
  size = 'middle',
}: AntListProps<T>) {
  // 将 ListColumn 转换为 antd 的 ColumnsType
  const antColumns = useMemo<TableProps<T>['columns']>(() => {
    return columns.map((col) => ({
      title: col.title,
      dataIndex: col.dataIndex,
      key: col.key ?? col.dataIndex,
      width: col.width,
      align: col.align,
      render: col.render,
      sorter: col.sortable ? true : undefined,
    }));
  }, [columns]);

  const paginationConfig = useMemo(() => {
    if (pagination === false) return false;
    return {
      current: pagination?.current ?? 1,
      pageSize: pagination?.pageSize ?? 10,
      total: pagination?.total ?? dataSource.length,
      onChange: pagination?.onChange,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number) => `共 ${total} 条`,
    };
  }, [pagination, dataSource.length]);

  const tableProps: TableProps<T> = {
    dataSource,
    columns: antColumns,
    rowKey,
    loading,
    pagination: paginationConfig,
    size,
    bordered,
    locale: { emptyText: emptyText ?? '暂无数据' },
    onRow: onRowClick
      ? (record, index) => ({
          onClick: () => onRowClick(record, index ?? 0),
          style: { cursor: 'pointer' },
        })
      : undefined,
  };

  if (title || toolbar) {
    return (
      <Card
        title={title}
        extra={toolbar}
        styles={{ body: { padding: compact ? 12 : 24 } }}
        size={compact ? 'small' : 'default'}
      >
        <Table<T> {...tableProps} />
      </Card>
    );
  }

  return <Table<T> {...tableProps} />;
}

AntList.displayName = 'AntList';

export default AntList;
