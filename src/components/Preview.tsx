import { forwardRef, useMemo } from 'react';
import { marked } from 'marked';
import type { Template } from '../types';

// 配置marked选项
marked.setOptions({
  breaks: true,
  gfm: true,
});

interface PreviewProps {
  markdown: string;
  template: Template;
  fontSize?: number;
  backgroundColor?: string;
  margin?: number;
  fixedWidth?: number; // 固定宽度（用于小红书预览）
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(
  ({ markdown, template, fontSize = 15, backgroundColor = '#ffffff', margin = 24, fixedWidth }, ref) => {
    // 使用 marked 解析 markdown
    const htmlContent = useMemo(() => {
      return marked(markdown) as string;
    }, [markdown]);

    const styles = template.styles;

    // 背景颜色处理
    const bgColor = backgroundColor === 'transparent' ? 'transparent' : backgroundColor;

    // 从 container 样式中提取非背景色的样式
    const containerStyleWithoutBg = (styles.container || '').replace(/background-color:\s*[^;]+;?/gi, '').replace(/background:\s*[^;]+;?/gi, '');

    return (
      <div
        ref={ref}
        className="preview-container"
        style={{
          padding: `${margin}px`,
          minHeight: '100%',
          backgroundColor: bgColor,
          overflow: 'auto',
          transition: 'background-color 0.3s',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={fixedWidth ? { width: fixedWidth, maxWidth: '100%' } : undefined}>
        <style>
          {`
            .preview-content {
              font-size: ${fontSize}px !important;
              ${containerStyleWithoutBg}
            }
            /* 确保这些元素没有背景色 - 使用 !important 覆盖任何继承的背景 */
            .preview-content h1 { background: transparent !important; ${styles.h1 || ''} }
            .preview-content h2 { background: transparent !important; ${styles.h2 || ''} }
            .preview-content h3 { background: transparent !important; ${styles.h3 || ''} }
            .preview-content h4 { background: transparent !important; font-size: 1em; font-weight: bold; margin: 12px 0 8px; }
            .preview-content h5 { background: transparent !important; font-size: 0.9em; font-weight: bold; margin: 10px 0 6px; }
            .preview-content h6 { background: transparent !important; font-size: 0.85em; font-weight: bold; margin: 8px 0 4px; }
            .preview-content p { background: transparent !important; ${styles.p || ''} }
            .preview-content blockquote { ${styles.blockquote || ''} }
            .preview-content code { ${styles.code || ''} }
            .preview-content pre { ${styles.pre || ''} }
            .preview-content pre code {
              background: transparent !important;
              padding: 0;
              color: inherit;
            }
            .preview-content ul { background: transparent !important; ${styles.ul || ''} }
            .preview-content ol { background: transparent !important; ${styles.ol || ''} }
            .preview-content li { background: transparent !important; ${styles.li || ''} }
            .preview-content img { ${styles.img || ''} }
            .preview-content a { background: transparent !important; ${styles.a || ''} }
            .preview-content table { ${styles.table || ''} }
            .preview-content th { ${styles.th || ''} }
            .preview-content td { ${styles.td || ''} }
            .preview-content hr { ${styles.hr || 'border: none; height: 1px; background: #e8e8e8; margin: 16px 0;'} }
          `}
        </style>
        <div
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        </div>
      </div>
    );
  }
);

Preview.displayName = 'Preview';

export default Preview;
