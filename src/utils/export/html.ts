import { marked } from 'marked';
import type { Template, Settings } from '../../types';
import { getTemplateById } from '../../templates';

// 配置marked选项
marked.setOptions({
  breaks: true,
  gfm: true,
});

// 将Markdown转换为带样式的HTML
export const markdownToStyledHTML = (
  markdown: string,
  template: Template,
  settings?: Partial<Settings>
): string => {
  let rawHtml = marked(markdown) as string;

  // 移除空的表格行（可能由 markdown 解析产生）
  rawHtml = rawHtml.replace(/<tr>\s*<\/tr>/g, '');
  rawHtml = rawHtml.replace(/<tr>\s*<td>\s*<\/td>\s*<\/tr>/g, '');
  rawHtml = rawHtml.replace(/<tr>\s*<td\s*\/>\s*<\/tr>/g, '');
  // 移除空的 thead/tbody
  rawHtml = rawHtml.replace(/<thead>\s*<\/thead>/g, '');
  rawHtml = rawHtml.replace(/<tbody>\s*<\/tbody>/g, '');
  // 移除表格前可能存在的空段落
  rawHtml = rawHtml.replace(/<p>\s*<\/p>\s*<table/g, '<table');
  rawHtml = rawHtml.replace(/<p\s*\/>\s*<table/g, '<table');

  const styles = template.styles;

  // 添加字体大小、边距和背景颜色
  const fontSize = settings?.fontSize || 15;
  const margin = settings?.margin ?? 24;
  const bgColor = settings?.backgroundColor || '#ffffff';
  const bgStyle = bgColor === 'transparent' ? '' : `background-color: ${bgColor};`;

  const styledHtml = `
    <div style="font-size: ${fontSize}px; padding: ${margin}px; ${bgStyle} ${styles.container || ''}" class="md-content">
      ${rawHtml}
    </div>
  `;

  return styledHtml;
};

// 导出为HTML文件
export const exportAsHTML = (
  markdown: string,
  templateId: string,
  filename: string = 'export',
  settings?: Partial<Settings>
): void => {
  const template = getTemplateById(templateId);
  if (!template) return;

  const styledContent = markdownToStyledHTML(markdown, template, settings);
  const bgColor = settings?.backgroundColor || '#ffffff';
  const bgStyle = bgColor === 'transparent' ? '#f5f5f5' : bgColor;

  const fullHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: ${bgStyle};
    }
    .md-content img {
      max-width: 100%;
      height: auto;
    }
    .md-content pre {
      overflow-x: auto;
    }
  </style>
</head>
<body>
  ${styledContent}
</body>
</html>
  `.trim();

  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  a.click();
  URL.revokeObjectURL(url);
};
