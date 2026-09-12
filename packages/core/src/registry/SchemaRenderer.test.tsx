import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SchemaRenderer, BlockRenderer } from './SchemaRenderer';
import { ComponentRegistry } from './ComponentRegistry';
import type { BlockSchema, PageSchema } from '../schema/types';
import { ThemePackRegistry } from '../theme/ThemePackRegistry';
import { ThemeProvider } from '../theme/ThemeContext';
import type { ThemePack } from '../theme/types';

// Mock 组件
const MockText: React.FC<Record<string, unknown>> = ({ content, ...rest }) =>
  React.createElement(
    'p',
    { 'data-testid': `text-${(rest as { 'data-block-id'?: string })['data-block-id']}` },
    content as string,
  );

const MockCard: React.FC<Record<string, unknown>> = ({ title, children, ..._rest }) =>
  React.createElement(
    'div',
    { 'data-testid': 'card', style: { border: '1px solid #ccc', padding: 12 } },
    React.createElement('h3', null, title as string),
    children,
  );

// 主题提供器包装
function renderWithTheme(ui: React.ReactElement) {
  const themeRegistry = new ThemePackRegistry();
  const defaultPack: ThemePack = {
    name: 'test-light',
    version: '1.0.0',
    displayName: 'Test Light',
    tokens: {},
  };
  themeRegistry.register(defaultPack, true);
  return render(<ThemeProvider registry={themeRegistry}>{ui}</ThemeProvider>);
}

describe('BlockRenderer', () => {
  it('should render a registered component', () => {
    const registry = new ComponentRegistry();
    registry.register('Text', { default: MockText, variants: { Text: MockText } });

    const block: BlockSchema = {
      id: 'block-1',
      componentType: 'Text',
      props: { content: 'Hello Componenta' },
    };

    renderWithTheme(React.createElement(BlockRenderer, { block, registry }));

    expect(screen.getByText('Hello Componenta')).toBeInTheDocument();
  });

  it('should render fallback for missing component', () => {
    const registry = new ComponentRegistry();
    const block: BlockSchema = {
      id: 'block-2',
      componentType: 'Text',
    };

    renderWithTheme(React.createElement(BlockRenderer, { block, registry }));

    expect(screen.getByText(/\[Missing Component\]/)).toBeInTheDocument();
  });

  it('should render custom fallback for missing component', () => {
    const registry = new ComponentRegistry();
    const block: BlockSchema = {
      id: 'block-3',
      componentType: 'Text',
    };

    renderWithTheme(
      React.createElement(BlockRenderer, {
        block,
        registry,
        fallback: React.createElement('div', null, 'Fallback content'),
      }),
    );

    expect(screen.getByText('Fallback content')).toBeInTheDocument();
  });

  it('should not render when visible=false', () => {
    const registry = new ComponentRegistry();
    registry.register('Text', { default: MockText, variants: { Text: MockText } });
    const block: BlockSchema = {
      id: 'block-4',
      componentType: 'Text',
      props: { content: 'Hidden' },
      visible: false,
    };

    renderWithTheme(React.createElement(BlockRenderer, { block, registry }));

    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('should render children recursively', () => {
    const registry = new ComponentRegistry();
    registry.register('Card', { default: MockCard, variants: { Card: MockCard } });
    registry.register('Text', { default: MockText, variants: { Text: MockText } });

    const block: BlockSchema = {
      id: 'card-1',
      componentType: 'Card',
      props: { title: 'Card Title' },
      children: [
        {
          id: 'text-1',
          componentType: 'Text',
          props: { content: 'Inside Card' },
        },
      ],
    };

    renderWithTheme(React.createElement(BlockRenderer, { block, registry }));

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Inside Card')).toBeInTheDocument();
  });

  it('should resolve variant implementation', () => {
    const MockTextV2: React.FC<Record<string, unknown>> = ({ content }) =>
      React.createElement('p', { 'data-testid': 'text-v2' }, content as string);

    const registry = new ComponentRegistry();
    registry.register('Text', {
      default: MockText,
      variants: { Text: MockText, TextV2: MockTextV2 },
    });

    const block: BlockSchema = {
      id: 'block-5',
      componentType: 'Text',
      componentImpl: 'TextV2',
      props: { content: 'Variant content' },
    };

    renderWithTheme(React.createElement(BlockRenderer, { block, registry }));

    expect(screen.getByText('Variant content')).toBeInTheDocument();
  });
});

describe('SchemaRenderer', () => {
  it('should render a full page schema', () => {
    const registry = new ComponentRegistry();
    registry.register('Text', { default: MockText, variants: { Text: MockText } });
    registry.register('Card', { default: MockCard, variants: { Card: MockCard } });

    const schema: PageSchema = {
      id: 'page-1',
      version: '0.1',
      title: 'Test Page',
      layout: {
        type: 'dashboard',
        regions: [
          {
            name: 'main',
            blocks: [
              {
                id: 'text-1',
                componentType: 'Text',
                props: { content: 'Page content' },
              },
            ],
          },
        ],
      },
    };

    renderWithTheme(React.createElement(SchemaRenderer, { schema, registry }));

    expect(screen.getByText('Page content')).toBeInTheDocument();
  });
});
