/**
 * 组件预设：一次性将所有组件注册到 ComponentRegistry
 *
 * 使用：
 *   import { registerAllComponents } from '@componenta/components/preset';
 *   import { globalRegistry } from '@componenta/core';
 *   registerAllComponents(globalRegistry);
 */
import type { ComponentRegistry } from '@componenta/core';
import { AntList } from './list';
import { CardList } from './list';
import { AntForm } from './form';
import { Chart } from './chart';
import { Card } from './card';
import { DashboardLayout } from './layout';

export function registerAllComponents(registry: ComponentRegistry): void {
  registry.register('List', {
    default: AntList as unknown as React.FC<Record<string, unknown>>,
    variants: {
      AntList: AntList as unknown as React.FC<Record<string, unknown>>,
      CardList: CardList as unknown as React.FC<Record<string, unknown>>,
    },
  });

  registry.register('Form', {
    default: AntForm as unknown as React.FC<Record<string, unknown>>,
    variants: {
      AntForm: AntForm as unknown as React.FC<Record<string, unknown>>,
    },
  });

  registry.register('Chart', {
    default: Chart as unknown as React.FC<Record<string, unknown>>,
    variants: {
      Chart: Chart as unknown as React.FC<Record<string, unknown>>,
    },
  });

  registry.register('Card', {
    default: Card as unknown as React.FC<Record<string, unknown>>,
    variants: {
      Card: Card as unknown as React.FC<Record<string, unknown>>,
    },
  });

  registry.register('Layout', {
    default: DashboardLayout as unknown as React.FC<Record<string, unknown>>,
    variants: {
      dashboard: DashboardLayout as unknown as React.FC<Record<string, unknown>>,
    },
  });
}
