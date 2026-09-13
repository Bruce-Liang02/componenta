/**
 * 目录数据加载与查询工具
 */
import type { Catalog, CategoryData, ComponentDefinition, ComponentVariant } from '../types';

// 内置的静态目录数据（构建时注入或运行时加载）
let catalogData: Catalog | null = null;

/** 设置目录数据 */
export function setCatalogData(data: Catalog): void {
  catalogData = data;
}

/** 获取全量目录 */
export function getCatalogData(): Catalog {
  if (!catalogData) {
    throw new Error('Catalog data not loaded. Call setCatalogData() first.');
  }
  return catalogData;
}

/** 获取所有类别 */
export function getAllCategories(): CategoryData[] {
  return getCatalogData().categories;
}

/** 按类别码查找类别 */
export function getCategoryByCode(code: string): CategoryData | undefined {
  return getAllCategories().find((cat) => cat.category === code);
}

/** 按组件标识查找组件（在全量目录中搜索） */
export function getComponentByKey(componentKey: string): ComponentDefinition | undefined {
  for (const category of getAllCategories()) {
    const comp = category.components.find((c) => c.component === componentKey);
    if (comp) return comp;
  }
  return undefined;
}

/** 按 ID 查找形态 */
export function getVariantById(id: string): ComponentVariant | undefined {
  for (const category of getAllCategories()) {
    for (const component of category.components) {
      const variant = component.variants.find((v) => v.id === id);
      if (variant) return variant;
    }
  }
  return undefined;
}

/** 获取形态所在的类别 */
export function getCategoryOfVariant(variantId: string): CategoryData | undefined {
  for (const category of getAllCategories()) {
    for (const component of category.components) {
      if (component.variants.some((v) => v.id === variantId)) {
        return category;
      }
    }
  }
  return undefined;
}

/** 获取形态所在的组件 */
export function getComponentOfVariant(variantId: string): ComponentDefinition | undefined {
  for (const category of getAllCategories()) {
    for (const component of category.components) {
      if (component.variants.some((v) => v.id === variantId)) {
        return component;
      }
    }
  }
  return undefined;
}

/** 获取全部形态列表 */
export function getAllVariants(): ComponentVariant[] {
  const variants: ComponentVariant[] = [];
  for (const category of getAllCategories()) {
    for (const component of category.components) {
      variants.push(...component.variants);
    }
  }
  return variants;
}

/** 搜索形态 */
export function searchVariants(query: string): ComponentVariant[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  return getAllVariants().filter((v) => {
    // 编号精确匹配
    if (v.id.toLowerCase() === lowerQuery) return true;
    // 名称匹配
    if (v.name.toLowerCase().includes(lowerQuery)) return true;
    // 一句话定位匹配
    if (v.tagline.toLowerCase().includes(lowerQuery)) return true;
    // 标签匹配
    if (v.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))) return true;
    // 适用场景匹配
    if (v.useCases?.some((uc) => uc.toLowerCase().includes(lowerQuery))) return true;
    return false;
  });
}

/** 按类别筛选形态 */
export function filterVariantsByCategory(categoryCode: string): ComponentVariant[] {
  const category = getCategoryByCode(categoryCode);
  if (!category) return [];
  const variants: ComponentVariant[] = [];
  for (const component of category.components) {
    variants.push(...component.variants);
  }
  return variants;
}

/** 统计各类别形态数量 */
export function getVariantCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const category of getAllCategories()) {
    let count = 0;
    for (const component of category.components) {
      count += component.variants.length;
    }
    counts[category.category] = count;
  }
  return counts;
}

/** 获取总形态数 */
export function getTotalVariantCount(): number {
  return getAllVariants().length;
}
