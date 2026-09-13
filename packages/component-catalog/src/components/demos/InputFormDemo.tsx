/**
 * InputForm Demo 模板
 */
import React from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Switch,
  Upload,
  Button,
  Card,
  message,
} from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import type { ComponentVariant } from '../../types';

interface Props {
  variant: ComponentVariant;
}

export const InputFormDemo: React.FC<Props> = ({ variant }) => {
  const isModal = variant.dimensions?.interaction === 'modal-edit';
  const isDrawer = variant.dimensions?.interaction === 'drawer-edit';

  return (
    <Card
      title={isModal ? '弹窗表单（示意）' : isDrawer ? '抽屉表单（示意）' : '数据录入表单'}
      size="small"
    >
      <Form layout="vertical" style={{ maxWidth: 600 }}>
        <Form.Item label="名称" required>
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item label="类型">
          <Select
            placeholder="请选择类型"
            options={[
              { label: '需求', value: 'requirement' },
              { label: '缺陷', value: 'bug' },
              { label: '任务', value: 'task' },
            ]}
          />
        </Form.Item>
        <Form.Item label="优先级">
          <Radio.Group defaultValue="medium">
            <Radio value="high">高</Radio>
            <Radio value="medium">中</Radio>
            <Radio value="low">低</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="计划日期">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="负责人">
          <Select
            mode="multiple"
            placeholder="可多选"
            options={[
              { label: '张三', value: 'zhangsan' },
              { label: '李四', value: 'lisi' },
              { label: '王五', value: 'wangwu' },
            ]}
          />
        </Form.Item>
        <Form.Item label="是否紧急">
          <Switch />
        </Form.Item>
        <Form.Item label="附件">
          <Upload>
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="描述">
          <Input.TextArea rows={3} placeholder="请输入描述" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => message.success('保存成功')}
          >
            保存
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
