import { describe, it, expect } from 'vitest';
import { validatePageSchema, safeValidatePageSchema, validateBlockSchema } from './validator';

describe('PageSchema Validator', () => {
  const validBlock = {
    id: 'block-1',
    componentType: 'List' as const,
    componentImpl: 'AntList',
    props: { columns: [] },
  };

  const validPageSchema = {
    id: 'page-1',
    version: '0.1',
    title: 'Test Page',
    layout: {
      type: 'sidebar-main' as const,
      regions: [
        {
          name: 'main',
          blocks: [validBlock],
        },
      ],
    },
  };

  it('should validate a valid PageSchema', () => {
    const result = validatePageSchema(validPageSchema);
    expect(result.id).toBe('page-1');
    expect(result.layout.type).toBe('sidebar-main');
    expect(result.layout.regions[0]?.blocks).toHaveLength(1);
  });

  it('should safeValidate successfully', () => {
    const result = safeValidatePageSchema(validPageSchema);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('page-1');
    }
  });

  it('should reject PageSchema without id', () => {
    const invalid = { ...validPageSchema, id: '' };
    expect(() => validatePageSchema(invalid)).toThrow();
  });

  it('should reject PageSchema without version', () => {
    const invalid = { ...validPageSchema };
    delete (invalid as { version?: string }).version;
    const result = safeValidatePageSchema(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject unknown componentType', () => {
    const invalid = {
      ...validPageSchema,
      layout: {
        ...validPageSchema.layout,
        regions: [
          {
            name: 'main',
            blocks: [{ ...validBlock, componentType: 'UnknownType' }],
          },
        ],
      },
    };
    expect(() => validatePageSchema(invalid)).toThrow();
  });

  it('should reject unknown layout type', () => {
    const invalid = {
      ...validPageSchema,
      layout: { ...validPageSchema.layout, type: 'flying-carpet' },
    };
    expect(() => validatePageSchema(invalid)).toThrow();
  });

  it('should validate BlockSchema independently', () => {
    const block = validateBlockSchema(validBlock);
    expect(block.id).toBe('block-1');
    expect(block.componentType).toBe('List');
  });

  it('should accept nested children (1 level)', () => {
    const nested = {
      ...validBlock,
      componentType: 'Layout' as const,
      children: [validBlock],
    };
    const block = validateBlockSchema(nested);
    expect(block.children).toHaveLength(1);
  });

  it('should accept dataSource binding', () => {
    const withDataSource = {
      ...validBlock,
      dataSource: {
        api: '/api/orders',
        method: 'POST' as const,
        params: { status: 'pending' },
        refreshInterval: 5000,
      },
    };
    const block = validateBlockSchema(withDataSource);
    expect(block.dataSource?.api).toBe('/api/orders');
    expect(block.dataSource?.method).toBe('POST');
  });

  it('should default dataSource.method to GET', () => {
    const withDataSource = {
      ...validBlock,
      dataSource: { api: '/api/users' },
    };
    const block = validateBlockSchema(withDataSource);
    expect(block.dataSource?.method).toBe('GET');
  });

  it('should reject negative refreshInterval', () => {
    const invalid = {
      ...validBlock,
      dataSource: { api: '/api/users', refreshInterval: -1 },
    };
    expect(() => validateBlockSchema(invalid)).toThrow();
  });
});
