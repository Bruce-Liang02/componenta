/**
 * Chart Demo 模板
 */
import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import type { ComponentVariant } from '../../types';

interface Props {
  variant: ComponentVariant;
}

export const ChartDemo: React.FC<Props> = ({ variant }) => {
  const isStatCard = variant.id.startsWith('VS0') && variant.dimensions?.layout === 'stat-cards';

  if (isStatCard) {
    return (
      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic title="总项目数" value={126} suffix="个" valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic title="进行中" value={48} suffix="个" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic
              title="完成率"
              value={75.8}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic
              title="较上月"
              value={12.5}
              suffix="%"
              precision={1}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
    );
  }

  // 默认：图表占位
  return (
    <div>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="趋势图（ECharts 占位）" size="small">
            <div
              style={{
                height: 240,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 16,
              }}
            >
              📈 图表区域 - 接入 ECharts
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="进度分布" size="small">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>需求</span>
                <span>78%</span>
              </div>
              <Progress percent={78} showInfo={false} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>开发</span>
                <span>62%</span>
              </div>
              <Progress percent={62} showInfo={false} status="active" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>测试</span>
                <span>45%</span>
              </div>
              <Progress percent={45} showInfo={false} status="exception" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
