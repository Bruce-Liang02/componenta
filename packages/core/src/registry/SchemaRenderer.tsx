/**
 * Schema 渲染器
 *
 * 将 PageSchema 渲染为 React 组件树。
 * 核心职责：
 * 1. 根据 BlockSchema.componentType 从注册表查组件
 * 2. 根据 BlockSchema.componentImpl 选变体
 * 3. 递归渲染 children
 * 4. 注入当前主题 Token（通过 ThemeContext）
 * 5. 预留数据源绑定（v0.1 仅静态 props）
 */
import React, { Suspense, useMemo } from 'react';
import type { BlockSchema, PageSchema, RegionSchema } from '../schema/types';
import type { ComponentRegistry } from './ComponentRegistry';
import { useTheme } from '../theme/ThemeContext';

export interface SchemaRendererProps {
  /** 页面 Schema */
  schema: PageSchema;
  /** 组件注册表 */
  registry: ComponentRegistry;
  /** 渲染失败时的 fallback */
  fallback?: React.ReactNode;
}

export interface BlockRendererProps {
  block: BlockSchema;
  registry: ComponentRegistry;
  fallback?: React.ReactNode;
  /** 嵌套深度，用于调试 */
  depth?: number;
}

/** 区块渲染器（递归） */
export function BlockRenderer({ block, registry, fallback, depth = 0 }: BlockRendererProps) {
  // v0.1: visible 仅支持布尔值；字符串表达式留给 v0.2
  const visible = typeof block.visible === 'boolean' ? block.visible : true;
  if (!visible) return null;

  // 1. 查组件
  const Component = registry.resolve(block.componentType, block.componentImpl);

  if (!Component) {
    if (fallback) return <>{fallback}</>;
    return (
      <div
        style={{
          padding: 12,
          border: '1px dashed #f00',
          borderRadius: 4,
          color: '#f00',
          margin: 8,
        }}
        data-block-id={block.id}
      >
        [Missing Component] type="{block.componentType}" impl="{block.componentImpl ?? 'default'}"
      </div>
    );
  }

  // 2. 组装 props（不包含 key，key 必须直接传）
  const props: Record<string, unknown> = {
    'data-block-id': block.id,
    'data-block-type': block.componentType,
    'data-block-depth': depth,
    ...(block.props ?? {}),
  };

  // 3. 处理 children
  if (block.children && block.children.length > 0) {
    props.children = (
      <>
        {block.children.map((child) => (
          <BlockRenderer
            key={child.id}
            block={child}
            registry={registry}
            fallback={fallback}
            depth={depth + 1}
          />
        ))}
      </>
    );
  }

  // 4. 渲染（key 单独传，不 spread）
  return <Component key={block.id} {...(props as Record<string, never>)} />;
}

/** 区域渲染器：渲染一个 region 内的所有 blocks */
export function RegionRenderer({
  region,
  registry,
  fallback,
}: {
  region: RegionSchema;
  registry: ComponentRegistry;
  fallback?: React.ReactNode;
}) {
  return (
    <div className={`componenta-region componenta-region-${region.name}`} data-region={region.name}>
      {region.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} registry={registry} fallback={fallback} />
      ))}
    </div>
  );
}

/** 布局渲染器：根据 layout.type 选择布局容器，再渲染各 region */
export function LayoutRenderer({ schema, registry, fallback }: SchemaRendererProps) {
  const { currentLayoutTemplate } = useTheme();
  const layoutType = currentLayoutTemplate ?? schema.layout.type;

  // 查找布局组件（可选）
  const LayoutComponent = registry.resolve('Layout', schema.layout.impl ?? layoutType);

  const regions = useMemo(
    () =>
      schema.layout.regions.map((region) => (
        <RegionRenderer key={region.name} region={region} registry={registry} fallback={fallback} />
      )),
    [schema.layout.regions, registry, fallback],
  );

  // 如果有注册的布局组件，使用它包裹
  if (LayoutComponent) {
    return (
      <LayoutComponent {...(schema.layout.props ?? {})} data-layout-type={layoutType}>
        {regions}
      </LayoutComponent>
    );
  }

  // 默认：按 region 顺序平铺
  return <>{regions}</>;
}

/** 顶层页面渲染器 */
export function SchemaRenderer({ schema, registry, fallback }: SchemaRendererProps) {
  // Schema 中声明的 themePack 会作为页面级覆盖（ThemePackLoader 会在上层处理）
  // 这里仅渲染内容
  return (
    <Suspense fallback={<div className="componenta-loading">Loading schema...</div>}>
      <LayoutRenderer schema={schema} registry={registry} fallback={fallback} />
    </Suspense>
  );
}
