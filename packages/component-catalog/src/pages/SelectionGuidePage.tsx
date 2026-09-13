/**
 * 选型向导页
 *
 * 通过问答式引导帮助用户找到最合适的形态
 */
import React, { useState, useMemo } from 'react';
import { Typography, Card, Radio, Button, Space, Tag, Progress, Result, Rate } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAllVariants } from '../data/catalogStore';
import type { ComponentVariant } from '../types';

const { Title, Text } = Typography;

interface Question {
  id: string;
  title: string;
  description?: string;
  options: {
    label: string;
    value: string;
    description?: string;
  }[];
}

const questions: Question[] = [
  {
    id: 'category',
    title: '你需要哪种类型的组件？',
    description: '选择组件所属的大类',
    options: [
      { label: '📊 数据展示（表格/列表/描述）', value: 'PT' },
      { label: '✏️ 数据录入（表单/选择/上传）', value: 'IP' },
      { label: '📈 数据可视化（图表/统计/看板）', value: 'VS' },
      { label: '🧭 导航与布局（菜单/标签/面包屑）', value: 'NV' },
      { label: '🔄 流程与编排（审批/规则/调度）', value: 'WF' },
      { label: '💬 状态与反馈（通知/确认/结果）', value: 'FB' },
      { label: '🔐 权限与组织（登录/授权/组织）', value: 'AU' },
      { label: '⚙️ 通用能力（Hook/拦截器/工具）', value: 'AB' },
      { label: '🔌 集成类（预览/导入导出/二维码）', value: 'IG' },
    ],
  },
  {
    id: 'dataVolume',
    title: '数据量级如何？',
    description: '这影响渲染策略的选择',
    options: [
      { label: '少量（<100 条）', value: 'small', description: '一次加载即可' },
      { label: '中等（100-1 万条）', value: 'medium', description: '需要分页' },
      { label: '大量（1 万-10 万条）', value: 'large', description: '需要后端分页或虚拟滚动' },
      { label: '海量（>10 万条）', value: 'huge', description: '必须虚拟滚动或后端分页' },
      { label: '不涉及数据', value: 'none', description: '纯展示/工具组件' },
    ],
  },
  {
    id: 'interaction',
    title: '用户需要什么级别的交互？',
    options: [
      { label: '只读展示', value: 'readonly', description: '不需要编辑' },
      { label: '轻量编辑', value: 'light-edit', description: '弹窗/抽屉编辑' },
      { label: '行内编辑', value: 'inline-edit', description: '直接在列表中编辑' },
      { label: '批量操作', value: 'batch', description: '需要批量选择/编辑/删除' },
    ],
  },
  {
    id: 'visualStyle',
    title: '视觉风格偏好？',
    options: [
      { label: '传统稳重', value: 'traditional', description: '经典表格/表单样式' },
      { label: '现代简约', value: 'modern', description: '卡片化、圆角、留白' },
      { label: '数据密集', value: 'data-dense', description: '高密度、专业感' },
      { label: '视觉优先', value: 'card-based', description: '大图/卡片布局' },
    ],
  },
  {
    id: 'mobile',
    title: '是否需要支持移动端？',
    options: [
      { label: '必须支持', value: 'required', description: '需要响应式适配' },
      { label: '最好支持', value: 'nice-to-have' },
      { label: '不需要', value: 'no', description: '仅 PC 端使用' },
    ],
  },
];

function filterVariants(answers: Record<string, string>): ComponentVariant[] {
  let variants = getAllVariants();

  // 按类别筛选
  if (answers.category) {
    const cat = answers.category;
    variants = variants.filter((v) => v.id.startsWith(cat));
  }

  // 按数据量筛选
  if (answers.dataVolume && answers.dataVolume !== 'none') {
    const dataMap: Record<string, string[]> = {
      small: ['all-loaded', 'frontend-page'],
      medium: ['frontend-page', 'backend-page'],
      large: ['backend-page', 'virtual-scroll'],
      huge: ['virtual-scroll', 'backend-page'],
    };
    const acceptable = dataMap[answers.dataVolume] ?? [];
    if (acceptable.length > 0) {
      const filtered = variants.filter(
        (v) => !v.dimensions?.data || acceptable.includes(v.dimensions.data),
      );
      if (filtered.length > 0) variants = filtered;
    }
  }

  // 按交互筛选
  if (answers.interaction) {
    const interactionMap: Record<string, string[]> = {
      readonly: ['readonly'],
      'light-edit': ['modal-edit', 'drawer-edit', 'readonly'],
      'inline-edit': ['inline-edit', 'batch-edit'],
      batch: ['batch-edit', 'inline-edit'],
    };
    const acceptable = interactionMap[answers.interaction] ?? [];
    if (acceptable.length > 0) {
      const filtered = variants.filter(
        (v) => !v.dimensions?.interaction || acceptable.includes(v.dimensions.interaction),
      );
      if (filtered.length > 0) variants = filtered;
    }
  }

  // 按视觉风格
  if (answers.visualStyle) {
    const filtered = variants.filter(
      (v) => !v.dimensions?.visual || v.dimensions.visual === answers.visualStyle,
    );
    if (filtered.length > 0) variants = filtered;
  }

  // 按移动端适配
  if (answers.mobile === 'required') {
    const filtered = variants.filter(
      (v) =>
        v.accessibility === 'excellent' ||
        v.accessibility === 'good' ||
        (v.tags?.some((t) => t.includes('响应式')) ?? false),
    );
    if (filtered.length > 0) variants = filtered;
  }

  // 按推荐指数排序
  return variants.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}

export function SelectionGuidePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);

  const progress = useMemo(
    () => ((finished ? questions.length : currentStep) / questions.length) * 100,
    [currentStep, finished],
  );

  const results = useMemo(() => (finished ? filterVariants(answers) : []), [answers, finished]);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setFinished(true);
    }
  };

  const handleBack = () => {
    if (finished) {
      setFinished(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setFinished(false);
  };

  const currentQuestion = questions[currentStep];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <CheckCircleOutlined style={{ marginRight: 8 }} />
          选型向导
        </Title>
        <Text type="secondary">回答几个问题，帮你找到最合适的组件形态</Text>
      </div>

      <Progress percent={progress} style={{ marginBottom: 32 }} />

      {!finished && currentQuestion ? (
        <>
          <Card>
            <Title level={4}>{currentQuestion.title}</Title>
            {currentQuestion.description && (
              <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                {currentQuestion.description}
              </Text>
            )}
            <Radio.Group
              value={answers[currentQuestion.id]}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              style={{ width: '100%', marginTop: 16 }}
            >
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {currentQuestion.options.map((opt) => (
                  <Radio.Button
                    key={opt.value}
                    value={opt.value}
                    style={{
                      width: '100%',
                      height: 'auto',
                      padding: '12px 16px',
                      textAlign: 'left',
                      whiteSpace: 'normal',
                    }}
                  >
                    <div>{opt.label}</div>
                    {opt.description && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {opt.description}
                      </Text>
                    )}
                  </Radio.Button>
                ))}
              </Space>
            </Radio.Group>
          </Card>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack} disabled={currentStep === 0}>
              上一步
            </Button>
            <Text type="secondary">
              {currentStep + 1} / {questions.length}
            </Text>
            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              重新开始
            </Button>
          </div>
        </>
      ) : (
        <>
          {results.length === 0 ? (
            <Result
              status="warning"
              title="没有找到完全匹配的形态"
              subTitle="尝试调整你的选择，或浏览全部目录"
              extra={
                <Space>
                  <Button onClick={handleReset}>重新选择</Button>
                  <Button type="primary" onClick={() => navigate('/catalog')}>
                    浏览全部目录
                  </Button>
                </Space>
              }
            />
          ) : (
            <>
              <Card
                title={
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <span>推荐 {results.length} 个形态</span>
                  </Space>
                }
              >
                {results.slice(0, 8).map((v, idx) => (
                  <div
                    key={v.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom:
                        idx < Math.min(results.length, 8) - 1 ? '1px solid #f0f0f0' : 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/catalog/v/${v.id}`)}
                  >
                    <div>
                      <Space>
                        <Tag color={idx === 0 ? 'gold' : 'blue'}>
                          {idx === 0 ? '🏆 最佳推荐' : `#${idx + 1}`}
                        </Tag>
                        <Text code>{v.id}</Text>
                        <Text strong>{v.name}</Text>
                      </Space>
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary">{v.tagline}</Text>
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <Space size={4}>
                          {(v.tags ?? []).slice(0, 3).map((t) => (
                            <Tag key={t} style={{ fontSize: 11 }}>
                              {t}
                            </Tag>
                          ))}
                          <Rate
                            disabled
                            defaultValue={v.rating ?? 0}
                            count={5}
                            style={{ fontSize: 12 }}
                          />
                        </Space>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>

              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                  返回修改
                </Button>
                <Space>
                  <Button onClick={handleReset} icon={<ReloadOutlined />}>
                    重新开始
                  </Button>
                  <Button
                    type="primary"
                    icon={<SwapOutlined />}
                    onClick={() => navigate('/catalog/compare')}
                  >
                    对比推荐结果
                  </Button>
                </Space>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
