import type { OutputFormat, Template } from '../types';

// 导入各类模板
import { wechatTemplates } from './wechat';
import { xiaohongshuTemplates } from './xiaohongshu';
import { emailTemplates } from './email';
import { resumeTemplates } from './resume';
import { generalTemplates } from './general';

// 重新导出各类模板
export { wechatTemplates } from './wechat';
export { xiaohongshuTemplates } from './xiaohongshu';
export { emailTemplates } from './email';
export { resumeTemplates } from './resume';
export { generalTemplates } from './general';

// 获取所有模板
export const getAllTemplates = (): Template[] => [
  ...wechatTemplates,
  ...xiaohongshuTemplates,
  ...emailTemplates,
  ...resumeTemplates,
  ...generalTemplates,
];

// 根据格式获取模板
export const getTemplatesByFormat = (format: OutputFormat): Template[] => {
  switch (format) {
    case 'wechat':
      return wechatTemplates;
    case 'xiaohongshu':
      return xiaohongshuTemplates;
    case 'email':
      return emailTemplates;
    case 'resume':
      return resumeTemplates;
    default:
      return generalTemplates;
  }
};

// 根据ID获取模板
export const getTemplateById = (id: string): Template | undefined => {
  return getAllTemplates().find((t) => t.id === id);
};
