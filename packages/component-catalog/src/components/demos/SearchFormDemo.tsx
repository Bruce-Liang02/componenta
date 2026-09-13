/**
 * SearchForm Demo 模板
 */
import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Row, Col, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import type { ComponentVariant } from '../../types';

interface Props {
  variant: ComponentVariant;
}

const { RangePicker } = DatePicker;

export const SearchFormDemo: React.FC<Props> = ({ variant }) => {
  const [expanded, setExpanded] = useState(false);
  const [statusActive, setStatusActive] = useState('全部');
  const [typeActive, setTypeActive] = useState('全部');
  const isAdvanced = variant.id.includes('PT006');
  const isTagFilter = variant.id.includes('PT007');

  if (isTagFilter) {
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 8, color: '#666' }}>状态：</span>
          <Space wrap>
            {['全部', '进行中', '待处理', '已关闭'].map((t) => (
              <Tag.CheckableTag
                key={t}
                checked={statusActive === t}
                onChange={() => setStatusActive(t)}
              >
                {t}
              </Tag.CheckableTag>
            ))}
          </Space>
        </div>
        <div>
          <span style={{ marginRight: 8, color: '#666' }}>类型：</span>
          <Space wrap>
            {['全部', '需求', '缺陷', '任务'].map((t) => (
              <Tag.CheckableTag
                key={t}
                checked={typeActive === t}
                onChange={() => setTypeActive(t)}
              >
                {t}
              </Tag.CheckableTag>
            ))}
          </Space>
        </div>
      </div>
    );
  }

  return (
    <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="项目名称">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="状态">
            <Select
              placeholder="请选择"
              allowClear
              options={[
                { label: '进行中', value: 'active' },
                { label: '待处理', value: 'pending' },
                { label: '已关闭', value: 'closed' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="负责人">
            <Select
              placeholder="请选择"
              allowClear
              options={[
                { label: '张三', value: 'zhangsan' },
                { label: '李四', value: 'lisi' },
                { label: '王五', value: 'wangwu' },
              ]}
            />
          </Form.Item>
        </Col>

        {(expanded || isAdvanced) && (
          <>
            <Col span={8}>
              <Form.Item label="优先级">
                <Select
                  placeholder="请选择"
                  allowClear
                  options={[
                    { label: '高', value: 'high' },
                    { label: '中', value: 'medium' },
                    { label: '低', value: 'low' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="创建时间">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            {isAdvanced && (
              <Col span={8}>
                <Form.Item label="标签">
                  <Select mode="tags" placeholder="输入标签" />
                </Form.Item>
              </Col>
            )}
          </>
        )}
      </Row>

      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Space>
            <Button icon={<ReloadOutlined />}>重置</Button>
            <Button type="primary" icon={<SearchOutlined />}>
              查询
            </Button>
            {(isAdvanced || variant.id.includes('PT005')) && (
              <a onClick={() => setExpanded(!expanded)} style={{ fontSize: 13 }}>
                {expanded ? '收起' : '展开'} {expanded ? <UpOutlined /> : <DownOutlined />}
              </a>
            )}
          </Space>
        </Col>
      </Row>
    </Form>
  );
};
