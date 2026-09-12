/**
 * 主题切换器组件
 *
 * 提供下拉 / 卡片 两种切换模式。
 */
import React from 'react';
import { Select, Dropdown, Card, Row, Col, Tag, Space, theme } from 'antd';
import { SkinOutlined, CheckOutlined } from '@ant-design/icons';
import { useTheme } from '@componenta/core';
import type { ThemePack } from '@componenta/core';

export interface ThemeSwitcherProps {
  /** 切换模式 */
  mode?: 'select' | 'card' | 'dropdown';
  /** 是否显示描述 */
  showDescription?: boolean;
  /** 卡片模式下的列宽 */
  cols?: number;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

export function ThemeSwitcher({
  mode = 'select',
  showDescription = false,
  cols = 4,
  style,
}: ThemeSwitcherProps) {
  const { currentName, listThemes, setTheme } = useTheme();
  const themes = listThemes();

  if (mode === 'card') {
    return (
      <Row gutter={[16, 16]} style={style}>
        {themes.map((pack) => {
          const isActive = pack.name === currentName;
          return (
            <Col key={pack.name} span={24 / cols}>
              <ThemeCard
                pack={pack}
                isActive={isActive}
                showDescription={showDescription}
                onClick={() => setTheme(pack.name)}
              />
            </Col>
          );
        })}
      </Row>
    );
  }

  if (mode === 'dropdown') {
    const items = themes.map((pack) => ({
      key: pack.name,
      label: (
        <Space>
          {pack.name === currentName && <CheckOutlined style={{ color: '#52c41a' }} />}
          <span>{pack.displayName}</span>
          {showDescription && <Tag>{pack.name}</Tag>}
        </Space>
      ),
    }));

    return (
      <Dropdown menu={{ items, selectedKeys: [currentName], onClick: ({ key }) => setTheme(key) }}>
        <Space style={{ cursor: 'pointer', ...style }}>
          <SkinOutlined />
          <span>{themes.find((p) => p.name === currentName)?.displayName ?? currentName}</span>
        </Space>
      </Dropdown>
    );
  }

  // 默认：select 模式
  return (
    <Select
      value={currentName}
      onChange={setTheme}
      style={{ width: 200, ...style }}
      prefix={<SkinOutlined />}
      options={themes.map((pack) => ({
        value: pack.name,
        label: (
          <Space>
            <span>{pack.displayName}</span>
            {showDescription && <Tag>{pack.name}</Tag>}
          </Space>
        ),
      }))}
    />
  );
}

ThemeSwitcher.displayName = 'ThemeSwitcher';

function ThemeCard({
  pack,
  isActive,
  showDescription,
  onClick,
}: {
  pack: ThemePack;
  isActive: boolean;
  showDescription?: boolean;
  onClick: () => void;
}) {
  const { token } = theme.useToken();

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        borderColor: isActive ? token.colorPrimary : undefined,
        borderWidth: isActive ? 2 : 1,
      }}
      styles={{ body: { padding: 16 } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 500 }}>{pack.displayName}</div>
        {isActive && <CheckOutlined style={{ color: token.colorPrimary }} />}
      </div>
      {showDescription && pack.description && (
        <div style={{ fontSize: 12, color: token.colorTextSecondary, marginTop: 8 }}>
          {pack.description}
        </div>
      )}
      <div
        style={{
          marginTop: 12,
          height: 40,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${pack.tokens.colorPrimary} 0%, ${pack.tokens.colorPrimary}88 100%)`,
        }}
      />
    </Card>
  );
}

export default ThemeSwitcher;
