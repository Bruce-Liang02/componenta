#!/usr/bin/env tsx
/**
 * build-catalog.ts
 *
 * 读取 catalog/*.yaml，合并生成 src/data/staticCatalog.ts
 *
 * 用法：pnpm build-catalog
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import type { Catalog, CategoryData } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogDir = path.resolve(__dirname, '../catalog');
const outputFile = path.resolve(__dirname, '../src/data/staticCatalog.ts');

// 类别排序顺序
const categoryOrder = ['PT', 'IP', 'VS', 'NV', 'WF', 'FB', 'AU', 'AB', 'IG'];

function loadAllYaml(): Catalog {
  const categories: CategoryData[] = [];

  for (const code of categoryOrder) {
    const file = path.join(catalogDir, `${code}.yaml`);
    if (!fs.existsSync(file)) {
      console.warn(`⚠️  跳过：${file} 不存在`);
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');
    const data = yaml.load(content) as CategoryData;

    if (!data || !data.category) {
      console.warn(`⚠️  跳过：${file} 解析为空`);
      continue;
    }

    const variantCount = data.components.reduce((sum, c) => sum + c.variants.length, 0);
    console.log(
      `✅ ${data.category} ${data.categoryName}: ${data.components.length} 组件, ${variantCount} 形态`,
    );

    categories.push(data);
  }

  return { categories };
}

function catalogToTs(catalog: Catalog): string {
  const json = JSON.stringify(catalog, null, 2);

  return `/**
 * 静态目录数据（由 build-catalog 脚本自动生成）
 *
 * 数据来源：catalog/*.yaml
 * 生成时间：${new Date().toISOString()}
 *
 * 请勿手动编辑此文件，修改 catalog/*.yaml 后重新运行 pnpm build-catalog
 */
import type { Catalog } from '../types';

export const staticCatalog: Catalog = ${json} as const;
`;
}

function validate(catalog: Catalog): boolean {
  let valid = true;
  const allIds = new Set<string>();

  for (const cat of catalog.categories) {
    for (const comp of cat.components) {
      for (const v of comp.variants) {
        // ID 唯一性检查
        if (allIds.has(v.id)) {
          console.error(`❌ ID 重复：${v.id}`);
          valid = false;
        }
        allIds.add(v.id);

        // ID 格式检查
        if (!/^[A-Z]{2}\d{3}(-v\d+)?$/.test(v.id)) {
          console.error(`❌ ID 格式错误：${v.id}（期望：两位大写字母+三位数字）`);
          valid = false;
        }

        // 必填字段检查
        if (!v.name) {
          console.error(`❌ ${v.id} 缺少 name`);
          valid = false;
        }
        if (!v.tagline) {
          console.error(`❌ ${v.id} 缺少 tagline`);
          valid = false;
        }
        if (!v.thumb || v.thumb.length === 0) {
          console.error(`❌ ${v.id} 缺少 thumb`);
          valid = false;
        }
        if (!v.pros || v.pros.length === 0) {
          console.error(`❌ ${v.id} 缺少 pros`);
          valid = false;
        }
        if (!v.cons || v.cons.length === 0) {
          console.error(`❌ ${v.id} 缺少 cons`);
          valid = false;
        }
        if (!v.useCases || v.useCases.length === 0) {
          console.error(`❌ ${v.id} 缺少 useCases`);
          valid = false;
        }
        if (!v.antiCases || v.antiCases.length === 0) {
          console.error(`❌ ${v.id} 缺少 antiCases`);
          valid = false;
        }
        if (!v.status) {
          console.error(`❌ ${v.id} 缺少 status`);
          valid = false;
        }

        // relatedComponents 引用的 ID 存在性检查（延迟到全部加载后检查）
      }
    }
  }

  // 跨形态引用检查
  for (const cat of catalog.categories) {
    for (const comp of cat.components) {
      for (const v of comp.variants) {
        for (const refId of v.related ?? []) {
          if (!allIds.has(refId)) {
            console.warn(`⚠️  ${v.id} 引用了不存在的形态：${refId}`);
          }
        }
        for (const rc of v.relatedComponents ?? []) {
          if (!allIds.has(rc.id)) {
            console.warn(`⚠️  ${v.id} 跨组件关联引用了不存在的形态：${rc.id}`);
          }
        }
      }
    }
  }

  return valid;
}

// === 主流程 ===
console.log('📦 开始构建选型目录数据...\n');

const catalog = loadAllYaml();

const totalVariants = catalog.categories.reduce(
  (sum, cat) => sum + cat.components.reduce((s, c) => s + c.variants.length, 0),
  0,
);
const totalComponents = catalog.categories.reduce((sum, cat) => sum + cat.components.length, 0);

console.log(
  `\n📊 总计：${catalog.categories.length} 类别, ${totalComponents} 组件, ${totalVariants} 形态\n`,
);

console.log('🔍 校验数据...\n');
const valid = validate(catalog);

if (!valid) {
  console.error('\n❌ 校验失败，请修复上述错误后重试');
  process.exit(1);
}

console.log('\n✅ 校验通过\n');

const tsContent = catalogToTs(catalog);
fs.writeFileSync(outputFile, tsContent, 'utf-8');
console.log(`📝 已生成：${outputFile}`);
console.log(`\n✨ 构建完成！`);
