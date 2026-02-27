import React from 'react';
import { Typography, ColorPicker, Divider, Slider, Input, Tooltip } from 'antd';
import {
  BgColorsOutlined,
  FontSizeOutlined,
  BorderOutlined,
} from '@ant-design/icons';
import type { Settings } from '../types';

const { Text } = Typography;

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Partial<Settings>) => void;
}

// 预设背景颜色 - 精简常用色
const presetColors = [
  // 基础色
  { value: 'transparent', label: '透明' },
  { value: '#ffffff', label: '纯白' },
  { value: '#f5f5f5', label: '浅灰' },
  { value: '#faf8f5', label: '米白' },
  // 深色系
  { value: '#000000', label: '纯黑' },
  { value: '#1a1a1a', label: '深灰' },
  { value: '#1e1e2e', label: '深蓝灰' },
  { value: '#282a36', label: '暗夜' },
  // 暖色系
  { value: '#fff8e1', label: '暖黄' },
  { value: '#fff1f0', label: '浅粉' },
  { value: '#ffece6', label: '蜜桃' },
  { value: '#fef3c7', label: '奶油' },
  // 冷色系
  { value: '#e6f4ff', label: '天蓝' },
  { value: '#f0f5ff', label: '雾蓝' },
  { value: '#f0fdf4', label: '薄荷' },
  { value: '#faf5ff', label: '薰衣草' },
];

// 字体大小档位
const fontSizeMarks = {
  12: '12',
  14: '14',
  16: '16',
  18: '18',
  20: '20',
  24: '24',
};

// 边距档位
const marginMarks = {
  0: '0',
  24: '24',
  48: '48',
  72: '72',
  96: '96',
};

// 获取有效的颜色值（确保是有效的 hex 颜色）
const getValidColor = (color: string | undefined | null): string => {
  if (!color || color === 'transparent') {
    return '#ffffff';
  }
  if (typeof color === 'object') {
    return '#ffffff';
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(color) || /^#[0-9A-Fa-f]{3}$/.test(color)) {
    return color;
  }
  return '#ffffff';
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  const backgroundColor = typeof settings.backgroundColor === 'string'
    ? settings.backgroundColor
    : 'transparent';

  return (
    <div style={{ padding: '0 4px' }}>
      {/* 字体大小 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FontSizeOutlined style={{ color: '#1677ff' }} />
            <Text strong style={{ fontSize: 13 }}>字体大小</Text>
          </div>
          <div style={{
            background: '#f0f5ff',
            padding: '2px 10px',
            borderRadius: 12,
            border: '1px solid #d6e4ff',
          }}>
            <Text style={{ fontSize: 13, fontWeight: 600, color: '#1677ff' }}>{settings.fontSize}px</Text>
          </div>
        </div>
        <div style={{ padding: '0 4px' }}>
          <Slider
            value={settings.fontSize}
            onChange={(value) => onSettingsChange({ fontSize: value })}
            min={12}
            max={24}
            step={1}
            marks={fontSizeMarks}
            tooltip={{ formatter: (value) => `${value}px` }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 4 }}>
          {[14, 15, 16].map((size) => (
            <div
              key={size}
              onClick={() => onSettingsChange({ fontSize: size })}
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 12,
                transition: 'all 0.2s',
                background: settings.fontSize === size ? '#1677ff' : '#f5f5f5',
                color: settings.fontSize === size ? '#fff' : '#666',
                border: `1px solid ${settings.fontSize === size ? '#1677ff' : '#e8e8e8'}`,
              }}
            >
              {size === 14 ? '小' : size === 15 ? '中' : '大'}
            </div>
          ))}
        </div>
      </div>

      {/* 边距 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BorderOutlined style={{ color: '#1677ff' }} />
            <Text strong style={{ fontSize: 13 }}>边距</Text>
          </div>
          <div style={{
            background: '#f0f5ff',
            padding: '2px 10px',
            borderRadius: 12,
            border: '1px solid #d6e4ff',
          }}>
            <Text style={{ fontSize: 13, fontWeight: 600, color: '#1677ff' }}>{settings.margin}px</Text>
          </div>
        </div>
        <div style={{ padding: '0 4px' }}>
          <Slider
            value={settings.margin}
            onChange={(value) => onSettingsChange({ margin: value })}
            min={0}
            max={96}
            step={4}
            marks={marginMarks}
            tooltip={{ formatter: (value) => `${value}px` }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 4 }}>
          {[
            { value: 12, label: '紧凑' },
            { value: 24, label: '适中' },
            { value: 48, label: '宽松' },
          ].map((item) => (
            <div
              key={item.value}
              onClick={() => onSettingsChange({ margin: item.value })}
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 12,
                transition: 'all 0.2s',
                background: settings.margin === item.value ? '#1677ff' : '#f5f5f5',
                color: settings.margin === item.value ? '#fff' : '#666',
                border: `1px solid ${settings.margin === item.value ? '#1677ff' : '#e8e8e8'}`,
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* 背景颜色 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <BgColorsOutlined style={{ color: '#1677ff' }} />
          <Text strong style={{ fontSize: 13 }}>背景颜色</Text>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
          {presetColors.map((color) => (
            <Tooltip key={color.value} title={color.label}>
              <div
                onClick={() => onSettingsChange({ backgroundColor: color.value })}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: 8,
                  backgroundColor: color.value === 'transparent' ? 'transparent' : color.value,
                  cursor: 'pointer',
                  border: backgroundColor === color.value
                    ? '2px solid #1677ff'
                    : '1px solid #d9d9d9',
                  transition: 'all 0.2s',
                  position: 'relative',
                  boxShadow: backgroundColor === color.value ? '0 0 0 2px rgba(22, 119, 255, 0.2)' : 'none',
                  transform: backgroundColor === color.value ? 'scale(1.05)' : 'scale(1)',
                  ...(color.value === 'transparent' ? {
                    backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                  } : {}),
                }}
              />
            </Tooltip>
          ))}
        </div>
        {/* 自定义颜色 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: '#fafafa',
          borderRadius: 8,
          border: '1px solid #f0f0f0',
        }}>
          <ColorPicker
            value={getValidColor(backgroundColor)}
            onChange={(color) => onSettingsChange({ backgroundColor: color.toHexString() })}
            size="small"
          />
          <Input
            value={backgroundColor === 'transparent' ? 'transparent' : backgroundColor}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'transparent' || /^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                onSettingsChange({ backgroundColor: value });
              }
            }}
            placeholder="#ffffff"
            size="small"
            style={{
              flex: 1,
              fontSize: 12,
              fontFamily: 'monospace',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
