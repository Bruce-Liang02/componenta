/**
 * Ant Design Form 变体
 */
import React, { useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  Switch,
  Button,
  Card,
  Space,
  Row,
  Col,
} from 'antd';
import type { FormProps, FormField } from './types';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

// 使用自定义名字避免和 antd FormProps 冲突
export type { FormProps as AntFormProps } from './types';

function renderField(field: FormField) {
  const common = {
    placeholder: field.placeholder as string | undefined,
    disabled: field.readonly,
  };

  switch (field.type) {
    case 'input':
      return <Input {...common} />;
    case 'textarea':
      return <TextArea {...common} rows={4} />;
    case 'number':
      return <InputNumber {...common} style={{ width: '100%' }} />;
    case 'select':
      return <Select {...common} options={field.options} style={{ width: '100%' }} allowClear />;
    case 'multi-select':
      return (
        <Select
          {...common}
          mode="multiple"
          options={field.options}
          style={{ width: '100%' }}
          allowClear
        />
      );
    case 'radio':
      return <Radio.Group {...common} options={field.options} />;
    case 'checkbox':
      return <Checkbox.Group {...common} options={field.options} />;
    case 'date':
      return <DatePicker {...common} style={{ width: '100%' }} />;
    case 'date-range':
      return (
        <RangePicker
          placeholder={
            field.placeholder ? [String(field.placeholder), String(field.placeholder)] : undefined
          }
          disabled={field.readonly}
          style={{ width: '100%' }}
        />
      );
    case 'switch':
      return <Switch disabled={field.readonly} />;
    case 'custom':
      return <>{field.customRender}</>;
    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
}

export function AntForm(props: FormProps) {
  const {
    fields = [],
    values,
    onChange,
    onSubmit,
    onReset,
    layout = 'vertical',
    labelCol,
    wrapperCol,
    showSubmit = true,
    showReset = true,
    submitText = '提交',
    disabled = false,
    title,
  } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (values) {
      form.setFieldsValue(values as Record<string, unknown>);
    }
  }, [values, form]);

  const visibleFields = fields.filter((f: FormField) => !f.hidden);

  const handleFinish = (vals: Record<string, unknown>) => {
    onSubmit?.(vals);
  };

  const handleValuesChange = (_: unknown, allValues: Record<string, unknown>) => {
    onChange?.(allValues);
  };

  const formNode = (
    <Form
      form={form}
      layout={layout}
      labelCol={layout === 'horizontal' ? labelCol : undefined}
      wrapperCol={layout === 'horizontal' ? wrapperCol : undefined}
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
      disabled={disabled}
      initialValues={values}
    >
      <Row gutter={16}>
        {visibleFields.map((field: FormField) => (
          <Col key={field.name} span={field.span ?? 24}>
            <Form.Item
              name={field.name}
              label={field.label}
              tooltip={field.tooltip}
              rules={
                field.rules?.map((r) => {
                  if (r.type === 'required') {
                    return { required: true, message: r.message ?? `${field.label} 不能为空` };
                  }
                  if (r.type === 'email') {
                    return { type: 'email', message: r.message ?? '请输入有效的邮箱地址' };
                  }
                  if (r.type === 'pattern' && typeof r.value === 'string') {
                    return { pattern: new RegExp(r.value), message: r.message };
                  }
                  if (r.type === 'min' && typeof r.value === 'number') {
                    return { min: r.value, message: r.message };
                  }
                  if (r.type === 'max' && typeof r.value === 'number') {
                    return { max: r.value, message: r.message };
                  }
                  return {};
                }) ??
                (field.required ? [{ required: true, message: `${field.label} 不能为空` }] : [])
              }
            >
              {renderField(field)}
            </Form.Item>
          </Col>
        ))}
      </Row>
      {(showSubmit || showReset) && (
        <Form.Item>
          <Space>
            {showSubmit && (
              <Button type="primary" htmlType="submit">
                {submitText}
              </Button>
            )}
            {showReset && (
              <Button
                onClick={() => {
                  form.resetFields();
                  onReset?.();
                }}
              >
                重置
              </Button>
            )}
          </Space>
        </Form.Item>
      )}
    </Form>
  );

  if (title) {
    return <Card title={title}>{formNode}</Card>;
  }

  return formNode;
}

AntForm.displayName = 'AntForm';

export default AntForm;
