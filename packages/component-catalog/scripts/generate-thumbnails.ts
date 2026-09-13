#!/usr/bin/env tsx
/**
 * generate-thumbnails.ts
 *
 * 为所有形态生成占位 SVG 缩略图。
 * 每个类别有独特的配色和图标风格，便于视觉区分。
 *
 * 用法：pnpm generate-thumbnails
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import type { CategoryData } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogDir = path.resolve(__dirname, '../catalog');
const outputDir = path.resolve(__dirname, '../../../apps/web-admin/public/thumbs');
const categoryOrder = ['PT', 'IP', 'VS', 'NV', 'WF', 'FB', 'AU', 'AB', 'IG'];

// 类别配色方案
const categoryThemes: Record<string, { bg: string; accent: string; icon: string; label: string }> =
  {
    PT: { bg: '#f0f5ff', accent: '#1677ff', icon: '📊', label: '基础展示' },
    IP: { bg: '#f6ffed', accent: '#52c41a', icon: '✏️', label: '数据录入' },
    VS: { bg: '#fff7e6', accent: '#fa8c16', icon: '📈', label: '数据可视化' },
    NV: { bg: '#f9f0ff', accent: '#722ed1', icon: '🧭', label: '导航与布局' },
    WF: { bg: '#fff0f6', accent: '#eb2f96', icon: '🔄', label: '流程编排' },
    FB: { bg: '#e6fffb', accent: '#13c2c2', icon: '💬', label: '状态反馈' },
    AU: { bg: '#fcffe6', accent: '#a0d911', icon: '🔐', label: '权限组织' },
    AB: { bg: '#f0f0f0', accent: '#595959', icon: '⚙️', label: '通用能力' },
    IG: { bg: '#fff1f0', accent: '#f5222d', icon: '🔌', label: '集成类' },
  };

function generateSvg(variantId: string, variantName: string, categoryCode: string): string {
  const theme = categoryThemes[categoryCode] ?? categoryThemes.PT;
  const lines =
    variantName.length > 16 ? [variantName.slice(0, 16), variantName.slice(16)] : [variantName];

  const textElements = lines
    .map(
      (line, i) =>
        `<text x="200" y="${155 + i * 22}" text-anchor="middle" font-size="14" fill="#333" font-family="system-ui,sans-serif">${escapeXml(line)}</text>`,
    )
    .join('\n  ');

  // 类别特定装饰图案
  const decorations = getCategoryDecoration(categoryCode, theme);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">
  <rect width="400" height="240" rx="8" fill="${theme.bg}" />
  <rect x="0" y="0" width="400" height="4" fill="${theme.accent}" />
  ${decorations}
  <text x="200" y="60" text-anchor="middle" font-size="36">${theme.icon}</text>
  <text x="200" y="100" text-anchor="middle" font-size="20" font-weight="bold" fill="${theme.accent}" font-family="monospace">${variantId}</text>
  ${textElements}
  <text x="200" y="215" text-anchor="middle" font-size="11" fill="#999" font-family="system-ui,sans-serif">${theme.label}</text>
</svg>`;
}

function getCategoryDecoration(code: string, theme: { accent: string }): string {
  const opacity = 0.08;
  switch (code) {
    case 'PT': // 表格线条
      return `<g opacity="${opacity}">
        <line x1="40" y1="130" x2="360" y2="130" stroke="${theme.accent}" stroke-width="1" />
        <line x1="40" y1="145" x2="360" y2="145" stroke="${theme.accent}" stroke-width="1" />
        <line x1="40" y1="160" x2="360" y2="160" stroke="${theme.accent}" stroke-width="1" />
        <line x1="120" y1="125" x2="120" y2="165" stroke="${theme.accent}" stroke-width="1" />
        <line x1="240" y1="125" x2="240" y2="165" stroke="${theme.accent}" stroke-width="1" />
      </g>`;
    case 'IP': // 表单输入框
      return `<g opacity="${opacity}">
        <rect x="100" y="130" width="200" height="24" rx="4" stroke="${theme.accent}" fill="none" stroke-width="1.5" />
        <rect x="100" y="162" width="200" height="24" rx="4" stroke="${theme.accent}" fill="none" stroke-width="1.5" />
      </g>`;
    case 'VS': // 图表柱状
      return `<g opacity="${opacity}">
        <rect x="120" y="150" width="20" height="40" fill="${theme.accent}" />
        <rect x="155" y="135" width="20" height="55" fill="${theme.accent}" />
        <rect x="190" y="145" width="20" height="45" fill="${theme.accent}" />
        <rect x="225" y="125" width="20" height="65" fill="${theme.accent}" />
        <rect x="260" y="140" width="20" height="50" fill="${theme.accent}" />
      </g>`;
    case 'NV': // 导航菜单线条
      return `<g opacity="${opacity}">
        <rect x="50" y="130" width="120" height="10" rx="2" fill="${theme.accent}" />
        <rect x="50" y="148" width="100" height="10" rx="2" fill="${theme.accent}" />
        <rect x="50" y="166" width="140" height="10" rx="2" fill="${theme.accent}" />
      </g>`;
    case 'WF': // 流程节点
      return `<g opacity="${opacity}">
        <circle cx="120" cy="150" r="12" stroke="${theme.accent}" fill="none" stroke-width="1.5" />
        <circle cx="200" cy="150" r="12" stroke="${theme.accent}" fill="none" stroke-width="1.5" />
        <circle cx="280" cy="150" r="12" stroke="${theme.accent}" fill="none" stroke-width="1.5" />
        <line x1="132" y1="150" x2="188" y2="150" stroke="${theme.accent}" stroke-width="1.5" />
        <line x1="212" y1="150" x2="268" y2="150" stroke="${theme.accent}" stroke-width="1.5" />
      </g>`;
    case 'FB': // 气泡
      return `<g opacity="${opacity}">
        <rect x="100" y="130" width="160" height="30" rx="12" fill="${theme.accent}" />
        <polygon points="140,160 150,172 160,160" fill="${theme.accent}" />
      </g>`;
    case 'AU': // 锁
      return `<g opacity="${opacity}">
        <rect x="180" y="145" width="40" height="30" rx="4" fill="${theme.accent}" />
        <path d="M188 145 v-10 a12 12 0 0 1 24 0 v10" stroke="${theme.accent}" fill="none" stroke-width="2" />
      </g>`;
    case 'AB': // 齿轮
      return `<g opacity="${opacity}">
        <circle cx="200" cy="150" r="20" stroke="${theme.accent}" fill="none" stroke-width="2" />
        <circle cx="200" cy="150" r="8" fill="${theme.accent}" />
      </g>`;
    case 'IG': // 拼图
      return `<g opacity="${opacity}">
        <rect x="160" y="130" width="35" height="35" rx="4" fill="${theme.accent}" />
        <rect x="200" y="130" width="35" height="35" rx="4" fill="${theme.accent}" />
        <rect x="160" y="168" width="35" height="35" rx="4" fill="${theme.accent}" />
        <rect x="200" y="168" width="35" height="35" rx="4" stroke="${theme.accent}" fill="none" stroke-width="1.5" stroke-dasharray="4" />
      </g>`;
    default:
      return '';
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// === 主流程 ===
console.log('🖼️  开始生成缩略图...\n');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let totalGenerated = 0;

for (const code of categoryOrder) {
  const file = path.join(catalogDir, `${code}.yaml`);
  if (!fs.existsSync(file)) continue;

  const content = fs.readFileSync(file, 'utf-8');
  const data = yaml.load(content) as CategoryData;

  let count = 0;
  for (const comp of data.components) {
    for (const variant of comp.variants) {
      const svg = generateSvg(variant.id, variant.name, code);
      const outputPath = path.join(outputDir, `${variant.id}-1.svg`);
      fs.writeFileSync(outputPath, svg, 'utf-8');
      count++;
    }
  }

  console.log(`  ${code} ${data.categoryName}: ${count} 张`);
  totalGenerated += count;
}

console.log(`\n✨ 共生成 ${totalGenerated} 张缩略图`);
console.log(`📁 输出目录：${outputDir}`);
