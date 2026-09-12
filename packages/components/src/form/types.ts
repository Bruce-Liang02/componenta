/**
 * Form 组件契约
 */
import type { ReactNode } from 'react';

/** 字段类型 */
export type FieldType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multi-select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'date-range'
  | 'switch'
  | 'upload'
  | 'custom';

/** 字段选项 */
export interface FieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  children?: FieldOption[];
}

/** 字段定义 */
export interface FormField {
  /** 字段名 */
  name: string;
  /** 字段标签 */
  label: string;
  /** 字段类型 */
  type: FieldType;
  /** 占位符 */
  placeholder?: string;
  /** 是否必填 */
  required?: boolean;
  /** 选项（select/radio/checkbox） */
  options?: FieldOption[];
  /** 默认值 */
  defaultValue?: unknown;
  /** 是否只读 */
  readonly?: boolean;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 校验规则 */
  rules?: Array<{
    type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'custom';
    value?: unknown;
    message?: string;
  }>;
  /** 字段栅格跨度（1-24） */
  span?: number;
  /** 自定义渲染（type=custom 时） */
  customRender?: ReactNode;
  /** 额外提示 */
  tooltip?: string;
}

/** Form 组件通用 Props */
export interface FormProps {
  /** 字段定义 */
  fields: FormField[];
  /** 表单值 */
  values?: Record<string, unknown>;
  /** 值变化回调 */
  onChange?: (values: Record<string, unknown>) => void;
  /** 提交回调 */
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
  /** 重置回调 */
  onReset?: () => void;
  /** 布局模式 */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /** 标签列宽 */
  labelCol?: { span: number };
  /** 控件列宽 */
  wrapperCol?: { span: number };
  /** 是否显示提交按钮 */
  showSubmit?: boolean;
  /** 是否显示重置按钮 */
  showReset?: boolean;
  /** 提交按钮文案 */
  submitText?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 标题 */
  title?: ReactNode;
}
