// 服务端模板定义 - 独立于前端模板

export interface Template {
  id: string;
  name: string;
  format: string;
  description: string;
  themeColors: string[];
  styles: Record<string, string>;
}

// 通用模板
const generalTemplates: Template[] = [
  {
    id: 'general-modern',
    name: '现代简约',
    format: 'general',
    description: '简洁现代的风格',
    themeColors: ['#1a1a1a', '#1677ff', '#f5f5f5'],
    styles: {
      container: 'max-width: 100%; padding: 24px; line-height: 1.8; color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
      h1: 'font-size: 2em; font-weight: 700; margin: 0.8em 0 0.5em; color: #1a1a1a; border-bottom: 2px solid #1677ff; padding-bottom: 0.3em;',
      h2: 'font-size: 1.5em; font-weight: 600; margin: 0.8em 0 0.4em; color: #1a1a1a;',
      h3: 'font-size: 1.25em; font-weight: 600; margin: 0.6em 0 0.3em; color: #333;',
      p: 'margin: 0.8em 0; color: #333;',
      blockquote: 'border-left: 4px solid #1677ff; padding: 0.5em 1em; margin: 1em 0; background: #f5f5f5; color: #666;',
      code: 'background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-family: SFMono-Regular, Consolas, monospace; font-size: 0.9em; color: #d73a49;',
      pre: 'background: #282c34; color: #abb2bf; padding: 1em; border-radius: 8px; overflow-x: auto; margin: 1em 0;',
      ul: 'padding-left: 1.5em; margin: 0.5em 0;',
      ol: 'padding-left: 1.5em; margin: 0.5em 0;',
      li: 'margin: 0.3em 0;',
      a: 'color: #1677ff; text-decoration: none;',
      table: 'width: 100%; border-collapse: collapse; margin: 1em 0;',
      th: 'background: #f5f5f5; padding: 0.5em; border: 1px solid #e8e8e8; text-align: left; font-weight: 600;',
      td: 'padding: 0.5em; border: 1px solid #e8e8e8;',
      hr: 'border: none; height: 1px; background: #e8e8e8; margin: 1.5em 0;',
    },
  },
  {
    id: 'general-github',
    name: 'GitHub 风格',
    format: 'general',
    description: 'GitHub README 风格',
    themeColors: ['#24292f', '#0366d6', '#f6f8fa'],
    styles: {
      container: 'max-width: 100%; padding: 24px; line-height: 1.6; color: #24292f; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
      h1: 'font-size: 2em; font-weight: 600; margin: 0.8em 0 0.5em; padding-bottom: 0.3em; border-bottom: 1px solid #d0d7de;',
      h2: 'font-size: 1.5em; font-weight: 600; margin: 0.8em 0 0.4em; padding-bottom: 0.3em; border-bottom: 1px solid #d0d7de;',
      h3: 'font-size: 1.25em; font-weight: 600; margin: 0.6em 0 0.3em;',
      p: 'margin: 0.8em 0;',
      blockquote: 'border-left: 4px solid #d0d7de; padding: 0.5em 1em; margin: 1em 0; color: #57606a;',
      code: 'background: rgba(175,184,193,0.2); padding: 2px 6px; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, monospace; font-size: 0.85em;',
      pre: 'background: #f6f8fa; padding: 1em; border-radius: 6px; overflow-x: auto; margin: 1em 0; border: 1px solid #d0d7de;',
      ul: 'padding-left: 1.5em; margin: 0.5em 0;',
      ol: 'padding-left: 1.5em; margin: 0.5em 0;',
      li: 'margin: 0.25em 0;',
      a: 'color: #0969da; text-decoration: none;',
      table: 'width: 100%; border-collapse: collapse; margin: 1em 0;',
      th: 'background: #f6f8fa; padding: 0.5em; border: 1px solid #d0d7de; text-align: left; font-weight: 600;',
      td: 'padding: 0.5em; border: 1px solid #d0d7de;',
      hr: 'border: none; height: 2px; background: #d0d7de; margin: 2em 0;',
    },
  },
];

// 微信模板
const wechatTemplates: Template[] = [
  {
    id: 'wechat-tech',
    name: '技术文章',
    format: 'wechat',
    description: '适合技术博客、代码教程',
    themeColors: ['#24292e', '#0366d6', '#f6f8fa'],
    styles: {
      container: 'max-width: 100%; padding: 20px; line-height: 1.8; color: #24292e;',
      h1: 'font-size: 1.6em; font-weight: 600; margin: 1.2em 0 0.8em; color: #24292e; padding-bottom: 0.4em; border-bottom: 2px solid #eaecef;',
      h2: 'font-size: 1.4em; font-weight: 600; margin: 1em 0 0.6em; color: #24292e; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em;',
      h3: 'font-size: 1.2em; font-weight: 600; margin: 0.8em 0 0.5em; color: #24292e;',
      p: 'margin: 0.8em 0; text-align: justify; color: #24292e;',
      blockquote: 'border-left: 4px solid #dfe2e5; padding: 0.6em 1em; margin: 1em 0; background: #f6f8fa; color: #6a737d;',
      code: 'background: rgba(27,31,35,0.05); padding: 2px 6px; border-radius: 3px; font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace; font-size: 0.9em; color: #d73a49;',
      pre: 'background: #f6f8fa; color: #24292e; padding: 1em; border-radius: 6px; overflow-x: auto; margin: 1em 0; border: 1px solid #eaecef;',
      ul: 'padding-left: 1.5em; margin: 0.8em 0;',
      ol: 'padding-left: 1.5em; margin: 0.8em 0;',
      li: 'margin: 0.3em 0;',
      a: 'color: #0366d6; text-decoration: none;',
      table: 'width: 100%; border-collapse: collapse; margin: 1em 0;',
      th: 'background: #f6f8fa; padding: 0.6em 0.8em; border: 1px solid #dfe2e5; text-align: left; font-weight: 600;',
      td: 'padding: 0.6em 0.8em; border: 1px solid #dfe2e5;',
      hr: 'border: none; height: 2px; background: linear-gradient(to right, transparent, #eaecef, transparent); margin: 1.5em 0;',
    },
  },
];

// 邮件模板
const emailTemplates: Template[] = [
  {
    id: 'email-business',
    name: '商务简约',
    format: 'email',
    description: '专业商务邮件风格',
    themeColors: ['#2563eb', '#1e40af', '#f8fafc'],
    styles: {
      container: 'max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; line-height: 1.6; color: #374151;',
      h1: 'font-size: 28px; font-weight: 700; margin: 0 0 20px 0; color: #111827; text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 15px;',
      h2: 'font-size: 22px; font-weight: 600; margin: 25px 0 15px 0; color: #1e40af; border-left: 4px solid #2563eb; padding-left: 12px;',
      h3: 'font-size: 18px; font-weight: 600; margin: 20px 0 10px 0; color: #374151;',
      p: 'margin: 0 0 16px 0; color: #374151; font-size: 16px;',
      blockquote: 'border-left: 4px solid #2563eb; padding: 12px 20px; margin: 20px 0; background-color: #f8fafc; color: #4b5563; font-style: italic;',
      code: 'background-color: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-family: "SF Mono", Monaco, Consolas, monospace; font-size: 14px; color: #dc2626;',
      pre: 'background-color: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 20px 0; font-family: "SF Mono", Monaco, Consolas, monospace; font-size: 14px;',
      ul: 'padding-left: 25px; margin: 15px 0;',
      ol: 'padding-left: 25px; margin: 15px 0;',
      li: 'margin: 8px 0; color: #374151;',
      a: 'color: #2563eb; text-decoration: underline;',
      table: 'width: 100%; border-collapse: collapse; margin: 20px 0;',
      th: 'background-color: #2563eb; color: #ffffff; padding: 12px 15px; text-align: left; font-weight: 600;',
      td: 'padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #374151;',
      hr: 'border: none; height: 2px; background: linear-gradient(to right, transparent, #2563eb, transparent); margin: 30px 0;',
    },
  },
  {
    id: 'email-newsletter',
    name: '新闻简报',
    format: 'email',
    description: '适合邮件简报、周刊',
    themeColors: ['#059669', '#047857', '#ecfdf5'],
    styles: {
      container: 'max-width: 600px; margin: 0 auto; font-family: Georgia, "Times New Roman", serif; line-height: 1.7; color: #1f2937;',
      h1: 'font-size: 32px; font-weight: 700; margin: 0 0 10px 0; color: #059669; text-align: center; letter-spacing: -0.5px;',
      h2: 'font-size: 24px; font-weight: 600; margin: 30px 0 15px 0; color: #047857; padding-bottom: 8px; border-bottom: 2px solid #059669;',
      h3: 'font-size: 20px; font-weight: 600; margin: 25px 0 12px 0; color: #059669;',
      p: 'margin: 0 0 18px 0; color: #374151; font-size: 16px; text-align: justify;',
      blockquote: 'border-left: 4px solid #059669; padding: 15px 25px; margin: 25px 0; background-color: #ecfdf5; color: #065f46; font-style: italic;',
      code: 'background-color: #f0fdf4; padding: 3px 8px; border-radius: 4px; font-family: Monaco, Consolas, monospace; font-size: 14px; color: #059669;',
      pre: 'background-color: #1f2937; color: #f9fafb; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 20px 0; font-family: Monaco, Consolas, monospace; font-size: 14px;',
      ul: 'padding-left: 25px; margin: 18px 0;',
      ol: 'padding-left: 25px; margin: 18px 0;',
      li: 'margin: 10px 0; color: #374151;',
      a: 'color: #059669; text-decoration: underline; font-weight: 500;',
      table: 'width: 100%; border-collapse: collapse; margin: 20px 0;',
      th: 'background-color: #059669; color: #ffffff; padding: 14px 16px; text-align: left; font-weight: 600;',
      td: 'padding: 14px 16px; border-bottom: 1px solid #d1fae5; color: #374151;',
      hr: 'border: none; height: 1px; background: #059669; margin: 35px 0; opacity: 0.3;',
    },
  },
];

// 微信公众号专用模板（需要内联样式）
const wechatInlineTemplates: Template[] = [
  {
    id: 'wechat-tech',
    name: '技术文章',
    format: 'wechat',
    description: '适合技术博客',
    themeColors: ['#24292e', '#0366d6', '#f6f8fa'],
    styles: {
      container: 'padding: 20px; line-height: 1.8; color: #24292e; font-family: -apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;',
      h1: 'margin: 1.2em 0 0.8em; padding-bottom: 0.4em; border-bottom: 2px solid #eaecef; font-size: 1.6em; font-weight: 600; color: #24292e;',
      h2: 'margin: 1em 0 0.6em; padding-bottom: 0.3em; border-bottom: 1px solid #eaecef; font-size: 1.4em; font-weight: 600; color: #24292e;',
      h3: 'margin: 0.8em 0 0.5em; font-size: 1.2em; font-weight: 600; color: #24292e;',
      p: 'margin: 0.8em 0; text-align: justify; color: #24292e; font-size: 16px;',
      blockquote: 'border-left: 4px solid #dfe2e5; padding: 0.6em 1em; margin: 1em 0; background: #f6f8fa; color: #6a737d;',
      code: 'background: rgba(27,31,35,0.05); padding: 2px 6px; border-radius: 3px; font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace; font-size: 14px; color: #d73a49;',
      pre: 'background: #f6f8fa; color: #24292e; padding: 1em; border-radius: 6px; overflow-x: auto; margin: 1em 0; border: 1px solid #eaecef;',
      ul: 'padding-left: 1.5em; margin: 0.8em 0;',
      ol: 'padding-left: 1.5em; margin: 0.8em 0;',
      li: 'margin: 0.3em 0; font-size: 16px;',
      a: 'color: #0366d6; text-decoration: none;',
      table: 'width: 100%; border-collapse: collapse; margin: 1em 0;',
      th: 'background: #f6f8fa; padding: 0.6em 0.8em; border: 1px solid #dfe2e5; text-align: left; font-weight: 600;',
      td: 'padding: 0.6em 0.8em; border: 1px solid #dfe2e5;',
      hr: 'border: none; height: 2px; background: #eaecef; margin: 1.5em 0;',
    },
  },
];

// 导出所有模板
export const templates: Template[] = [
  ...generalTemplates,
  ...wechatTemplates,
  ...emailTemplates,
  ...wechatInlineTemplates,
];

// 根据 ID 获取模板
export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

// 根据格式获取模板
export function getTemplatesByFormat(format: string): Template[] {
  return templates.filter((t) => t.format === format);
}
