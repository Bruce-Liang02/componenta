/**
 * PageSchema v0.1 的 Zod 校验器
 *
 * 运行时校验 JSON Schema，避免脏数据导致渲染崩溃。
 */
import { z } from 'zod';
import type { PageSchema, BlockSchema, AppSchema } from './types';

export const DataSourceSchema = z.object({
  api: z.string().optional(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).optional().default('GET'),
  params: z.record(z.unknown()).optional(),
  refreshInterval: z.number().int().nonnegative().optional(),
});

export const ComponentTypeSchema = z.enum([
  'List',
  'Form',
  'Chart',
  'Card',
  'Custom',
  'Layout',
  'Text',
]);

export const LayoutTypeSchema = z.enum(['fixed-header', 'sidebar-main', 'dashboard', 'blank']);

// 递归 BlockSchema
export const BlockSchemaZod: z.ZodType<BlockSchema> = z.object({
  id: z.string().min(1),
  componentType: ComponentTypeSchema,
  componentImpl: z.string().optional(),
  props: z.record(z.unknown()).optional(),
  dataSource: DataSourceSchema.optional(),
  children: z.lazy(() => z.array(BlockSchemaZod)).optional(),
  visible: z.union([z.boolean(), z.string()]).optional().default(true),
});

export const RegionSchemaZod = z.object({
  name: z.string().min(1),
  blocks: z.array(BlockSchemaZod).default([]),
});

export const LayoutSchemaZod = z.object({
  type: LayoutTypeSchema,
  impl: z.string().optional(),
  props: z.record(z.unknown()).optional(),
  regions: z.array(RegionSchemaZod).default([]),
});

export const ActionSchemaZod = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  payload: z.record(z.unknown()).optional(),
});

export const PageSchemaZod = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  themePack: z.string().optional(),
  layout: LayoutSchemaZod,
  actions: z.array(ActionSchemaZod).optional(),
});

export const NavigationItemZod: z.ZodType<{
  key: string;
  title: string;
  icon?: string;
  pageId?: string;
  children?: Array<{ key: string; title: string; icon?: string; pageId?: string }>;
}> = z.lazy(() =>
  z.object({
    key: z.string().min(1),
    title: z.string().min(1),
    icon: z.string().optional(),
    pageId: z.string().optional(),
    children: z.array(NavigationItemZod).optional(),
  }),
);

export const NavigationSchemaZod = z.object({
  mode: z.enum(['sidebar', 'top', 'mixed']),
  items: z.array(NavigationItemZod),
});

export const AppSchemaZod = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  defaultThemePack: z.string().optional(),
  pages: z.record(PageSchemaZod),
  navigation: NavigationSchemaZod.optional(),
});

/** 校验并返回 PageSchema，失败抛出错误 */
export function validatePageSchema(input: unknown): PageSchema {
  return PageSchemaZod.parse(input);
}

/** 安全校验，返回结果对象 */
export function safeValidatePageSchema(
  input: unknown,
): { success: true; data: PageSchema } | { success: false; error: z.ZodError } {
  const result = PageSchemaZod.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/** 校验 AppSchema */
export function validateAppSchema(input: unknown): AppSchema {
  return AppSchemaZod.parse(input);
}

/** 校验 BlockSchema */
export function validateBlockSchema(input: unknown): BlockSchema {
  return BlockSchemaZod.parse(input);
}
