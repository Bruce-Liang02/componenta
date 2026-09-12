import { describe, it, expect, beforeEach } from 'vitest';
import { ThemePackRegistry } from './ThemePackRegistry';
import type { ThemePack } from './types';

const lightPack: ThemePack = {
  name: 'default-light',
  version: '1.0.0',
  displayName: 'Default Light',
  tokens: { colorPrimary: '#1677ff' },
  componentVariants: { List: 'AntList' },
  layoutTemplate: 'sidebar-main',
};

const bluePack: ThemePack = {
  name: 'business-blue',
  version: '1.0.0',
  displayName: 'Business Blue',
  tokens: { colorPrimary: '#0052d9', borderRadius: 6 },
  componentVariants: { List: 'VirtualList' },
  layoutTemplate: 'fixed-header',
};

describe('ThemePackRegistry', () => {
  let registry: ThemePackRegistry;

  beforeEach(() => {
    registry = new ThemePackRegistry();
  });

  it('should register and retrieve a pack', () => {
    registry.register(lightPack);
    expect(registry.get('default-light')).toEqual(lightPack);
  });

  it('should use first registered as default', () => {
    registry.register(lightPack);
    registry.register(bluePack);
    expect(registry.getDefault()?.name).toBe('default-light');
  });

  it('should allow explicit default', () => {
    registry.register(lightPack);
    registry.register(bluePack, true);
    expect(registry.getDefault()?.name).toBe('business-blue');
  });

  it('should setDefault', () => {
    registry.register(lightPack);
    registry.register(bluePack);
    registry.setDefault('business-blue');
    expect(registry.getDefault()?.name).toBe('business-blue');
  });

  it('should throw on setDefault with unknown name', () => {
    registry.register(lightPack);
    expect(() => registry.setDefault('not-exists')).toThrow();
  });

  it('should list all packs', () => {
    registry.register(lightPack);
    registry.register(bluePack);
    expect(registry.list()).toHaveLength(2);
    expect(registry.listNames()).toEqual(['default-light', 'business-blue']);
  });

  it('should check has()', () => {
    registry.register(lightPack);
    expect(registry.has('default-light')).toBe(true);
    expect(registry.has('not-exists')).toBe(false);
  });

  it('should throw when registering without name', () => {
    expect(() =>
      registry.register({ name: '', version: '1.0.0', displayName: 'X', tokens: {} }),
    ).toThrow();
  });
});
