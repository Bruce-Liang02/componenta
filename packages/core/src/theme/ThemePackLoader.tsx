/**
 * 主题包加载器
 *
 * 把 ThemeProvider 与 Ant Design 的 ConfigProvider 桥接起来，
 * 让切换主题包时 Ant Design 组件自动响应。
 */
import React from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider, useTheme } from './ThemeContext';
import type { ThemePackRegistry } from './ThemePackRegistry';

export interface ThemePackLoaderProps {
  registry?: ThemePackRegistry;
  initialTheme?: string;
  storageKey?: string | false;
  children: React.ReactNode;
}

/**
 * 顶层主题加载器：同时提供 ThemeProvider + Ant Design ConfigProvider
 */
export function ThemePackLoader({
  registry,
  initialTheme,
  storageKey,
  children,
}: ThemePackLoaderProps) {
  return (
    <ThemeProvider registry={registry} initialTheme={initialTheme} storageKey={storageKey}>
      <AntdConfigBridge>{children}</AntdConfigBridge>
    </ThemeProvider>
  );
}

/** 桥接：把 ThemeContext 的 tokens 注入到 Ant Design 的 ConfigProvider */
function AntdConfigBridge({ children }: { children: React.ReactNode }) {
  const { tokens } = useTheme();

  // 推断算法模式：根据 tokens 里的 colorBgBase 等判断
  const algorithm = React.useMemo(() => {
    // 如果 tokens 里有 algorithm 字段直接使用
    if ((tokens as { algorithm?: 'light' | 'dark' }).algorithm === 'dark') {
      return antdTheme.darkAlgorithm;
    }
    return antdTheme.defaultAlgorithm;
  }, [tokens]);

  return (
    <ConfigProvider
      theme={{
        token: tokens as Parameters<typeof ConfigProvider>[0]['theme'] extends infer T
          ? T extends { token?: infer U }
            ? U
            : never
          : never,
        algorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
