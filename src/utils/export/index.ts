import type { OutputFormat, Settings, XiaohongshuSize, XiaohongshuSplitMode } from '../../types';
import { getTemplateById } from '../../templates';

// 导入各模块
export { markdownToStyledHTML, exportAsHTML } from './html';
export { getInlineStyledHTML, copyToClipboard, copyPreviewToClipboard, copyMarkdownToClipboard } from './wechat';
export { exportAsImage, exportAsXiaohongshuImage, xiaohongshuSizeOptions, xiaohongshuSplitOptions } from './image';
export { exportAsPDF } from './pdf';
export { markdownToEmailHTML, copyEmailToClipboard, downloadEmailHTML } from './email';

// 从各模块导入用于主导出函数
import { exportAsHTML, markdownToStyledHTML } from './html';
import { copyMarkdownToClipboard } from './wechat';
import { exportAsImage, exportAsXiaohongshuImage } from './image';
import { exportAsPDF } from './pdf';
import { copyEmailToClipboard } from './email';

// 导出格式类型（包含通用格式的子类型）
export type ExportType = OutputFormat | 'image' | 'pdf' | 'html' | 'copyHtml' | 'downloadHtml';

// 主导出函数
export const exportContent = async (
  format: ExportType,
  markdown: string,
  templateId: string,
  previewElement?: HTMLElement,
  filename?: string,
  settings?: Partial<Settings>,
  xiaohongshuSize?: XiaohongshuSize,
  xiaohongshuSplitMode?: XiaohongshuSplitMode
): Promise<{ success: boolean; message: string; data?: string }> => {
  const defaultFilename = filename || `md-export-${Date.now()}`;
  const margin = settings?.margin ?? 24;

  try {
    switch (format) {
      case 'wechat': {
        // 使用 copyMarkdownToClipboard 直接从 Markdown 生成带内联样式的 HTML
        // 这是确保样式正确复制到微信公众号编辑器的最佳方式
        const template = getTemplateById(templateId);
        if (!template) throw new Error('模板未找到');

        const copied = await copyMarkdownToClipboard(markdown, template, settings);
        return {
          success: copied,
          message: copied ? '已复制到剪贴板，可直接粘贴到微信公众号编辑器' : '复制失败',
        };
      }

      case 'xiaohongshu': {
        // 小红书导出为图片（支持多图）
        if (!previewElement) throw new Error('预览元素未找到');
        const xhsContent = previewElement.querySelector('.preview-content') as HTMLElement;
        if (!xhsContent) throw new Error('预览内容未找到');
        const xhsBgColor = settings?.backgroundColor || '#ffffff';
        const result = await exportAsXiaohongshuImage(
          xhsContent,
          defaultFilename,
          xhsBgColor,
          margin,
          xiaohongshuSize || 'vertical',
          xiaohongshuSplitMode || 'hr'
        );
        return { success: true, message: result.message };
      }

      case 'email': {
        // 邮件导出
        const template = getTemplateById(templateId);
        if (!template) throw new Error('模板未找到');
        const copied = await copyEmailToClipboard(markdown, template, settings);
        return {
          success: copied,
          message: copied ? '邮件HTML已复制到剪贴板，可直接粘贴到邮件编辑器' : '复制失败',
        };
      }

      case 'image': {
        if (!previewElement) throw new Error('预览元素未找到');
        // 获取预览内容区域（长图）
        const previewContent = previewElement.querySelector('.preview-content') as HTMLElement;
        if (!previewContent) throw new Error('预览内容未找到');
        const imgBgColor = settings?.backgroundColor || '#ffffff';
        await exportAsImage(previewContent, defaultFilename, 'high', imgBgColor, margin);
        return { success: true, message: '图片已导出' };
      }

      case 'pdf': {
        if (!previewElement) throw new Error('预览元素未找到');
        const pdfBgColor = settings?.backgroundColor || '#ffffff';
        await exportAsPDF(previewElement, defaultFilename, pdfBgColor, margin);
        return { success: true, message: 'PDF已导出' };
      }

      case 'html': {
        exportAsHTML(markdown, templateId, defaultFilename, settings);
        return { success: true, message: 'HTML文件已导出' };
      }

      case 'copyHtml': {
        const template = getTemplateById(templateId);
        if (!template) throw new Error('模板未找到');
        const html = markdownToStyledHTML(markdown, template, settings);
        await navigator.clipboard.writeText(html);
        return { success: true, message: 'HTML代码已复制到剪贴板' };
      }

      case 'downloadHtml': {
        exportAsHTML(markdown, templateId, defaultFilename, settings);
        return { success: true, message: 'HTML文件已导出' };
      }

      case 'resume': {
        // 简历导出为PDF
        if (!previewElement) throw new Error('预览元素未找到');
        const resumeContent = previewElement.querySelector('.preview-content') as HTMLElement;
        if (!resumeContent) throw new Error('预览内容未找到');
        const resumeBgColor = settings?.backgroundColor || '#ffffff';
        await exportAsPDF(resumeContent, defaultFilename, resumeBgColor, margin);
        return { success: true, message: '简历PDF已导出' };
      }

      case 'general': {
        // 通用格式不直接导出，需要选择具体的导出类型
        return { success: false, message: '请选择具体的导出格式' };
      }

      default:
        return { success: false, message: '不支持的导出格式' };
    }
  } catch (error) {
    return {
      success: false,
      message: `导出失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
};
