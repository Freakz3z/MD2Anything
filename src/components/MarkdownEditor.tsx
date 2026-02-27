import React, { useCallback } from 'react';
import { Input, Button, Space, Tooltip } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CodeOutlined,
  LinkOutlined,
  PictureOutlined,
  MessageOutlined,
  FontSizeOutlined,
  MinusOutlined,
  TableOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// 工具栏按钮配置
const toolbarButtons = [
  { icon: <FontSizeOutlined />, title: '标题', prefix: '## ', suffix: '' },
  { icon: <BoldOutlined />, title: '粗体', prefix: '**', suffix: '**' },
  { icon: <ItalicOutlined />, title: '斜体', prefix: '*', suffix: '*' },
  { icon: <MessageOutlined />, title: '引用', prefix: '> ', suffix: '' },
  { icon: <UnorderedListOutlined />, title: '无序列表', prefix: '- ', suffix: '' },
  { icon: <OrderedListOutlined />, title: '有序列表', prefix: '1. ', suffix: '' },
  { icon: <CodeOutlined />, title: '代码', prefix: '`', suffix: '`' },
  { icon: <LinkOutlined />, title: '链接', prefix: '[', suffix: '](url)' },
  { icon: <PictureOutlined />, title: '图片', prefix: '![alt](', suffix: ')' },
  { icon: <TableOutlined />, title: '表格', prefix: '| 列1 | 列2 |\n| --- | --- |\n| ', suffix: ' |' },
  { icon: <MinusOutlined />, title: '分割线', prefix: '\n---\n', suffix: '' },
];

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = '在此输入 Markdown 内容...',
}) => {
  // 处理工具栏按钮点击
  const handleToolbarClick = useCallback(
    (prefix: string, suffix: string) => {
      const textarea = document.querySelector('.md-editor-textarea') as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText =
        value.substring(0, start) +
        prefix +
        selectedText +
        suffix +
        value.substring(end);

      onChange(newText);

      // 恢复焦点和选区
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + prefix.length + selectedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [value, onChange]
  );

  // 处理文本变化
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  // 处理Tab键
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText =
          value.substring(0, start) + '  ' + value.substring(end);
        onChange(newText);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
      }
    },
    [value, onChange]
  );

  return (
    <div className="markdown-editor" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 工具栏 */}
      <div
        className="toolbar"
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #f0f0f0',
          background: 'transparent',
          flexShrink: 0,
        }}
      >
        <Space size={2} wrap>
          {toolbarButtons.map((btn, index) => (
            <Tooltip key={index} title={btn.title}>
              <Button
                type="text"
                size="small"
                icon={btn.icon}
                onClick={() => handleToolbarClick(btn.prefix, btn.suffix)}
                style={{ color: '#666' }}
              />
            </Tooltip>
          ))}
        </Space>
      </div>

      {/* 编辑区 */}
      <TextArea
        className="md-editor-textarea"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          flex: 1,
          width: '100%',
          fontSize: '14px',
          lineHeight: '1.7',
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", "Courier New", monospace',
          border: 'none',
          borderRadius: 0,
          resize: 'none',
          padding: '16px',
          background: 'transparent',
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
