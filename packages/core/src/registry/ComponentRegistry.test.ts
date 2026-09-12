import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { ComponentRegistry } from './ComponentRegistry';

// 测试用假组件
const MockAntList: React.FC<Record<string, unknown>> = () =>
  React.createElement('div', { 'data-testid': 'ant-list' }, 'AntList');
MockAntList.displayName = 'AntList';

const MockVirtualList: React.FC<Record<string, unknown>> = () =>
  React.createElement('div', { 'data-testid': 'virtual-list' }, 'VirtualList');
MockVirtualList.displayName = 'VirtualList';

const MockCardList: React.FC<Record<string, unknown>> = () =>
  React.createElement('div', { 'data-testid': 'card-list' }, 'CardList');
MockCardList.displayName = 'CardList';

describe('ComponentRegistry', () => {
  let registry: ComponentRegistry;

  beforeEach(() => {
    registry = new ComponentRegistry();
    registry.register('List', {
      default: MockAntList,
      variants: {
        AntList: MockAntList,
        VirtualList: MockVirtualList,
        CardList: MockCardList,
      },
    });
  });

  it('should resolve default implementation', () => {
    const Comp = registry.resolve('List');
    expect(Comp).toBe(MockAntList);
  });

  it('should resolve specific variant', () => {
    const Comp = registry.resolve('List', 'VirtualList');
    expect(Comp).toBe(MockVirtualList);
  });

  it('should fallback to default when variant not found (non-strict)', () => {
    const Comp = registry.resolve('List', 'NotExists');
    expect(Comp).toBe(MockAntList);
  });

  it('should return null for unknown type (non-strict)', () => {
    const Comp = registry.resolve('Unknown');
    expect(Comp).toBeNull();
  });

  it('should throw in strict mode for unknown type', () => {
    const strict = new ComponentRegistry({ strict: true });
    expect(() => strict.resolve('Unknown')).toThrow(/Unknown component type/);
  });

  it('should throw in strict mode for unknown variant', () => {
    const strict = new ComponentRegistry({ strict: true });
    strict.register('List', {
      default: MockAntList,
      variants: { AntList: MockAntList },
    });
    expect(() => strict.resolve('List', 'NotExists')).toThrow(/Unknown variant/);
  });

  it('should list registered types', () => {
    expect(registry.listTypes()).toEqual(['List']);
  });

  it('should list variants', () => {
    const variants = registry.listVariants('List');
    expect(variants).toContain('AntList');
    expect(variants).toContain('VirtualList');
    expect(variants).toContain('CardList');
  });

  it('should report has() correctly', () => {
    expect(registry.has('List')).toBe(true);
    expect(registry.has('Unknown')).toBe(false);
  });

  it('should report hasVariant() correctly', () => {
    expect(registry.hasVariant('List', 'AntList')).toBe(true);
    expect(registry.hasVariant('List', 'NotExists')).toBe(false);
    expect(registry.hasVariant('Unknown', 'AntList')).toBe(false);
  });

  it('should clear registry', () => {
    registry.clear();
    expect(registry.has('List')).toBe(false);
    expect(registry.listTypes()).toEqual([]);
  });

  it('should throw when registering without default', () => {
    expect(() =>
      registry.register('Form', {
        default: undefined as unknown as React.FC,
        variants: {},
      }),
    ).toThrow(/requires a default implementation/);
  });
});
