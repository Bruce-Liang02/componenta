#!/usr/bin/env tsx
/**
 * validate-catalog.ts
 *
 * 校验 catalog/*.yaml 数据完整性，不生成文件
 *
 * 用法：pnpm validate
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import type { Catalog, CategoryData } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogDir = path.resolve(__dirname, '../catalog');
const categoryOrder = ['PT', 'IP', 'VS', 'NV', 'WF', 'FB', 'AU', 'AB', 'IG'];

let errorCount = 0;
let warnCount = 0;

function error(msg: string) {
  console.error(`❌ ${msg}`);
  errorCount++;
}

function warn(msg: string) {
  console.warn(`⚠️  ${msg}`);
  warnCount++;
}

const categories: CategoryData[] = [];

for (const code of categoryOrder) {
  const file = path.join(catalogDir, `${code}.yaml`);
  if (!fs.existsSync(file)) {
    error(`文件不存在：${file}`);
    continue;
  }

  const content = fs.readFileSync(file, 'utf-8');
  const data = yaml.load(content) as CategoryData;

  if (!data?.category) {
    error(`解析为空：${file}`);
    continue;
  }

  if (data.category !== code) {
    error(`文件 ${code}.yaml 中 category 字段为 "${data.category}"，应为 "${code}"`);
  }

  categories.push(data);
}

const catalog: Catalog = { categories };
const allIds = new Set<string>();

// 形态级校验
for (const cat of categories) {
  for (const comp of cat.components) {
    if (!comp.component) error(`${cat.category}: 组件缺少 component 字段`);
    if (!comp.name) error(`${cat.category}: 组件缺少 name 字段`);
    if (!comp.description) error(`${cat.category}/${comp.component}: 缺少 description`);

    for (const v of comp.variants) {
      const prefix = `${cat.category}/${comp.component}/${v.id ?? '???'}`;

      // ID 格式
      if (!v.id) {
        error(`${prefix}: 缺少 id`);
        continue;
      }
      if (!/^[A-Z]{2}\d{3}(-v\d+)?$/.test(v.id)) {
        error(`${prefix}: ID 格式错误（期望：两位大写字母+三位数字）`);
      }
      if (!v.id.startsWith(cat.category)) {
        error(`${prefix}: ID 应以类别码 "${cat.category}" 开头`);
      }

      // 唯一性
      if (allIds.has(v.id)) {
        error(`${prefix}: ID 重复`);
      }
      allIds.add(v.id);

      // 必填字段
      if (!v.name) error(`${prefix}: 缺少 name`);
      if (!v.tagline) error(`${prefix}: 缺少 tagline`);
      if (!v.thumb?.length) error(`${prefix}: 缺少 thumb`);
      if (!v.pros?.length) error(`${prefix}: 缺少 pros`);
      if (!v.cons?.length) error(`${prefix}: 缺少 cons`);
      if (!v.useCases?.length) error(`${prefix}: 缺少 useCases`);
      if (!v.antiCases?.length) error(`${prefix}: 缺少 antiCases`);
      if (!v.status) error(`${prefix}: 缺少 status`);
      if (v.status && !['active', 'deprecated'].includes(v.status)) {
        error(`${prefix}: status 值无效（期望 active 或 deprecated）`);
      }

      // 废弃形态必须有 deprecatedNote
      if (v.status === 'deprecated' && !v.deprecatedNote) {
        warn(`${prefix}: 已废弃但未填写 deprecatedNote`);
      }

      // 维度值校验（仅检查类型，不限制枚举值，YAML 为数据源）
      if (v.dimensions) {
        const d = v.dimensions;
        const dimensionKeys = ['layout', 'interaction', 'data', 'visual', 'techGen'] as const;
        for (const key of dimensionKeys) {
          if (d[key] !== undefined && typeof d[key] !== 'string') {
            error(`${prefix}: dimensions.${key} 应为字符串`);
          }
        }
      }
    }
  }
}

// 跨形态引用
for (const cat of categories) {
  for (const comp of cat.components) {
    for (const v of comp.variants) {
      for (const refId of v.related ?? []) {
        if (!allIds.has(refId)) {
          warn(`${v.id}: related 引用不存在的形态 ${refId}`);
        }
      }
      for (const rc of v.relatedComponents ?? []) {
        if (!allIds.has(rc.id)) {
          warn(`${v.id}: relatedComponents 引用不存在的形态 ${rc.id}`);
        }
      }
    }
  }
}

// 汇总
const totalVariants = categories.reduce(
  (sum, cat) => sum + cat.components.reduce((s, c) => s + c.variants.length, 0),
  0,
);
const totalComponents = categories.reduce((sum, cat) => sum + cat.components.length, 0);

console.log(`\n📊 统计：${categories.length} 类别, ${totalComponents} 组件, ${totalVariants} 形态`);
console.log(`🔍 结果：${errorCount} 错误, ${warnCount} 警告\n`);

if (errorCount > 0) {
  console.error('❌ 校验失败');
  process.exit(1);
} else {
  console.log('✅ 校验通过');
}
