import React from 'react';
import { Radio, Typography, Space, Card } from 'antd';
import type { Template, OutputFormat } from '../types';
import { getTemplatesByFormat } from '../templates';

const { Text } = Typography;

interface TemplateSelectorProps {
  format: OutputFormat;
  selectedTemplateId: string;
  onFormatChange: (format: OutputFormat) => void;
  onTemplateChange: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  format,
  selectedTemplateId,
  onTemplateChange,
}) => {
  // 获取当前格式的模板列表
  const templates = getTemplatesByFormat(format);

  return (
    <div className="template-selector">
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
        主题风格
      </Text>
      <Radio.Group
        value={selectedTemplateId}
        onChange={(e) => onTemplateChange(e.target.value)}
        style={{ width: '100%' }}
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {templates.map((template: Template) => (
            <Card
              key={template.id}
              size="small"
              hoverable
              style={{
                cursor: 'pointer',
                border: selectedTemplateId === template.id ? '1.5px solid #1677ff' : '1px solid #d9d9d9',
                background: selectedTemplateId === template.id ? '#e6f4ff' : undefined,
                transition: 'all 0.2s',
              }}
              styles={{ body: { padding: 12 } }}
              onClick={() => onTemplateChange(template.id)}
            >
              <Radio value={template.id} style={{ display: 'none' }}>
                <Text strong>{template.name}</Text>
              </Radio>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: 14 }}>
                  {template.name}
                </Text>
                <div style={{ display: 'flex', gap: 4 }}>
                  {template.themeColors.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        backgroundColor: color,
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </Space>
      </Radio.Group>
    </div>
  );
};

export default TemplateSelector;
