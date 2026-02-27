/**
 * 统计文本信息
 */
export interface TextStats {
  /** 字符数（包含空格） */
  chars: number;
  /** 字符数（不含空格） */
  charsNoSpaces: number;
  /** 单词数（中英文混合） */
  words: number;
  /** 行数 */
  lines: number;
  /** 段落数 */
  paragraphs: number;
  /** 预估阅读时间（分钟） */
  readTime: number;
}

/**
 * 计算文本统计信息
 * @param text 输入文本
 * @returns 统计信息
 */
export function getTextStats(text: string): TextStats {
  if (!text || text.trim().length === 0) {
    return {
      chars: 0,
      charsNoSpaces: 0,
      words: 0,
      lines: 0,
      paragraphs: 0,
      readTime: 0,
    };
  }

  // 字符数（包含空格）
  const chars = text.length;

  // 字符数（不含空格）
  const charsNoSpaces = text.replace(/\s/g, '').length;

  // 行数
  const lines = text.split('\n').length;

  // 段落数（非空行）
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

  // 单词数（中英文混合计算）
  // 中文按字符计算，英文按单词计算
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  const words = chineseChars + englishWords;

  // 预估阅读时间（中文 300 字/分钟，英文 200 词/分钟）
  const readTime = Math.max(1, Math.ceil(words / 300));

  return {
    chars,
    charsNoSpaces,
    words,
    lines,
    paragraphs,
    readTime,
  };
}

/**
 * 格式化统计信息显示
 */
export function formatStats(stats: TextStats): string {
  return `${stats.words} 字 · ${stats.lines} 行 · 约 ${stats.readTime} 分钟`;
}
