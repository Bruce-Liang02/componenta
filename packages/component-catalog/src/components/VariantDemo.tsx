/**
 * 形态 Demo 渲染器
 *
 * 根据形态 ID 渲染真实的 Ant Design 组件预览
 */
import React from 'react';
import { getVariantById, getComponentOfVariant } from '../data/catalogStore';
import type { ComponentVariant } from '../types';

// 导入各类组件的 Demo 模板
import { ProTableDemo } from './demos/ProTableDemo';
import { SearchFormDemo } from './demos/SearchFormDemo';
import { DescriptionsDemo } from './demos/DescriptionsDemo';
import { InputFormDemo } from './demos/InputFormDemo';
import { ChartDemo } from './demos/ChartDemo';
import { NavigationDemo } from './demos/NavigationDemo';

interface VariantDemoProps {
  variantId: string;
}

/**
 * Demo 渲染器主组件
 * 根据形态 ID 自动选择合适的 Demo 模板
 */
export const VariantDemo: React.FC<VariantDemoProps> = ({ variantId }) => {
  const variant = getVariantById(variantId);
  const component = getComponentOfVariant(variantId);

  if (!variant || !component) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>未找到形态 {variantId}</div>
    );
  }

  // 根据组件类型选择 Demo 模板
  const demoComponent = renderDemo(component.component, variant);

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <div
        style={{ marginBottom: 16, padding: '12px 16px', background: '#fafafa', borderRadius: 6 }}
      >
        <strong style={{ color: '#1677ff' }}>{variant.id}</strong>
        <span style={{ margin: '0 12px', color: '#999' }}>|</span>
        <span>{variant.name}</span>
        <span style={{ marginLeft: 12, color: '#666', fontSize: 13 }}>- {variant.tagline}</span>
      </div>
      {demoComponent}
    </div>
  );
};

/**
 * 根据组件类型渲染对应的 Demo
 */
function renderDemo(componentType: string, variant: ComponentVariant): React.ReactNode {
  // 基础展示类
  if (componentType === 'pro-table') {
    return <ProTableDemo variant={variant} />;
  }
  if (componentType === 'search-form') {
    return <SearchFormDemo variant={variant} />;
  }
  if (componentType === 'descriptions') {
    return <DescriptionsDemo variant={variant} />;
  }

  // 数据录入类
  if (componentType.startsWith('input-') || componentType === 'form') {
    return <InputFormDemo variant={variant} />;
  }

  // 数据可视化类
  if (componentType.startsWith('chart-') || componentType === 'stat-card') {
    return <ChartDemo variant={variant} />;
  }

  // 导航类
  if (['menu', 'tabs', 'breadcrumb', 'pagination', 'page-header'].includes(componentType)) {
    return <NavigationDemo variant={variant} />;
  }

  // 默认：显示形态信息占位
  return (
    <div
      style={{
        padding: 40,
        textAlign: 'center',
        color: '#999',
        background: '#fafafa',
        borderRadius: 8,
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
      <div>
        组件类型 <code>{componentType}</code> 的 Demo 正在开发中
      </div>
      <div style={{ marginTop: 8, fontSize: 13 }}>当前展示形态：{variant.name}</div>
    </div>
  );
}
