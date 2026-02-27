# 架构设计文档

本文档介绍 MD2Anything 的整体架构设计。

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │   编辑器    │ │    预览     │ │   设置面板  │            │
│  │  (Editor)   │ │  (Preview)  │ │  (Settings) │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        状态管理层                            │
│                     Zustand Store                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  • markdownContent                                   │    │
│  │  • outputFormat                                      │    │
│  │  • selectedTemplateId                                │    │
│  │  • settings (fontSize, margin, backgroundColor)     │    │
│  │  • history[]                                         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        业务逻辑层                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  模板系统   │ │  导出功能   │ │  历史管理   │            │
│  │ (Templates) │ │  (Export)   │ │  (History)  │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              增强 Markdown 解析器                     │    │
│  │  • Prism.js 代码高亮 (20+ 语言)                      │    │
│  │  • KaTeX 数学公式                                    │    │
│  │  • Mermaid 图表                                      │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API 服务层                            │
│                     Express Server                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  POST /api/convert/html                              │    │
│  │  POST /api/convert/email                             │    │
│  │  POST /api/convert/wechat                            │    │
│  │  POST /api/convert/plain                             │    │
│  │  GET  /api/convert/templates                         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 核心模块

### 1. 前端架构

#### 状态管理 (Zustand)

```typescript
// src/store/useStore.ts
interface StoreState {
  // 内容
  markdownContent: string;

  // 格式
  outputFormat: OutputFormat;
  selectedTemplateId: string;

  // 设置
  settings: Settings;

  // 历史
  history: HistoryRecord[];

  // Actions
  setMarkdownContent: (content: string) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setSelectedTemplateId: (id: string) => void;
  setSettings: (settings: Partial<Settings>) => void;
  autoSave: () => void;
  loadFromHistory: (id: string) => void;
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
}
```

#### 模板系统

每个模板包含以下属性：

```typescript
interface Template {
  id: string;                    // 唯一标识
  name: string;                  // 显示名称
  format: OutputFormat;          // 格式类型
  description: string;           // 描述
  themeColors: string[];         // 主题颜色
  styles: Record<string, string>; // CSS 样式映射
}
```

### 2. 增强 Markdown 解析器

#### 解析流程

```
Markdown 输入
      │
      ▼
┌─────────────────┐
│    预处理       │ 提取特殊块（公式、Mermaid）
└─────────────────┘
      │
      ▼
┌─────────────────┐
│     marked      │ 解析标准 Markdown
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  代码块处理     │ Prism.js 语法高亮
└─────────────────┘
      │
      ▼
┌─────────────────┐
│    后处理       │ 恢复公式、Mermaid 图表
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Mermaid 渲染   │ 异步渲染 SVG 图表
└─────────────────┘
```

#### 代码高亮

```typescript
// src/utils/enhancedMarkdown.ts
function highlightCode(code: string, lang: string): string {
  const prismLang = getPrismLanguage(lang);
  if (isLanguageSupported(lang)) {
    return Prism.highlight(code, Prism.languages[prismLang], prismLang);
  }
  return escapeHtml(code);
}
```

支持的语言：JavaScript, TypeScript, Python, Java, C, C++, C#, Go, Rust, Bash, JSON, YAML, SQL, Markdown, Docker, Nginx, Shell 等。

#### 数学公式

```typescript
// 使用 KaTeX 渲染公式
function renderKatex(formula: string, displayMode: boolean): string {
  return katex.renderToString(formula, {
    displayMode,
    throwOnError: false,
    trust: true,
  });
}
```

- 行内公式：`$E = mc^2$` → `<span class="katex-inline">...</span>`
- 块级公式：`$$...$$` → `<div class="katex-block">...</div>`

#### Mermaid 图表

```typescript
// 初始化 Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

// 异步渲染图表
const { svg } = await mermaid.render(id, code);
```

### 3. 导出流程

```
Markdown 输入
      │
      ▼
┌─────────────┐
│   marked    │ 解析 Markdown
└─────────────┘
      │
      ▼
┌─────────────┐
│  样式引擎   │ 应用模板样式
└─────────────┘
      │
      ▼
┌─────────────┐
│  格式处理   │ 根据目标格式处理
└─────────────┘
      │
      ├──▶ 微信：生成内联样式 HTML
      ├──▶ 邮件：生成 table 布局 HTML
      ├──▶ 图片：html2canvas → PNG
      ├──▶ PDF：jsPDF + html2canvas
      └──▶ HTML：完整 HTML 文件
```

### 4. API 服务

#### 请求处理流程

```
请求 → 路由层 → 参数验证 → 业务处理 → 响应
                         │
                         ▼
                   ┌──────────┐
                   │ 模板选择 │
                   └──────────┘
                         │
                         ▼
                   ┌──────────┐
                   │ 样式应用 │
                   └──────────┘
                         │
                         ▼
                   ┌──────────┐
                   │ 格式转换 │
                   └──────────┘
```

### 5. 文本统计

```typescript
// src/utils/stats.ts
export interface TextStats {
  chars: number;          // 字符数（包含空格）
  charsNoSpaces: number;  // 字符数（不含空格）
  words: number;          // 单词数（中英文混合）
  lines: number;          // 行数
  paragraphs: number;     // 段落数
  readTime: number;       // 预估阅读时间（分钟）
}

export function getTextStats(text: string): TextStats {
  // 中文按字符计算，英文按单词计算
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  const words = chineseChars + englishWords;

  // 预估阅读时间（中文 300 字/分钟）
  const readTime = Math.max(1, Math.ceil(words / 300));

  return { chars, charsNoSpaces, words, lines, paragraphs, readTime };
}
```

## 数据流

### 用户编辑流程

```
用户输入 Markdown
        │
        ▼
  MarkdownEditor 组件
        │
        ├──▶ 拖拽文件 → FileReader → onChange
        │
        ▼
  更新 Zustand Store (setMarkdownContent)
        │
        ▼
  Preview 组件监听变化
        │
        ▼
  parseEnhancedMarkdown() 解析
        │
        ├──▶ 代码块 → Prism.js 高亮
        ├──▶ 公式 → KaTeX 渲染
        └──▶ Mermaid → 异步渲染 SVG
        │
        ▼
  应用模板样式
        │
        ▼
  渲染预览
```

### 导出流程

```
用户点击导出
        │
        ▼
  exportContent(format, markdown, templateId, ...)
        │
        ▼
  根据 format 选择导出方式
        │
        ├──▶ wechat: copyMarkdownToClipboard
        ├──▶ xiaohongshu: exportAsXiaohongshuImage
        ├──▶ email: copyEmailToClipboard
        ├──▶ resume: exportAsPDF
        └──▶ general: 弹出选择菜单
```

## 关键技术点

### 1. 样式内联化

微信和邮件客户端不支持外部 CSS，需要将样式内联到 HTML 元素：

```typescript
// 将 CSS 类转换为内联样式
const applyInlineStyles = (html: string, styles: Record<string, string>) => {
  let result = html;
  for (const [tag, style] of Object.entries(styles)) {
    const regex = new RegExp(`<${tag}([^>]*)>`, 'gi');
    result = result.replace(regex, `<${tag}$1 style="${style}">`);
  }
  return result;
};
```

### 2. 邮件兼容性

邮件 HTML 需要特殊处理：

- 使用 `<table>` 布局代替 flexbox/grid
- 内联所有样式
- 添加 MSO 条件注释（Outlook 兼容）
- 使用 web 安全字体

### 3. 图片导出

使用 html2canvas 将 DOM 转换为图片：

```typescript
const canvas = await html2canvas(element, {
  scale: 2,           // 高清输出
  useCORS: true,      // 允许跨域图片
  backgroundColor,    // 指定背景色
});
```

### 4. 小红书多图分割

支持按分割线或自动高度分割：

```typescript
// 按 <hr> 分割
const sections = html.split('<hr>');

// 或按高度自动分割
const autoSplit = (element, maxHeight) => {
  // 计算元素高度，按 maxHeight 分割
};
```

### 5. 拖拽上传

```typescript
// 处理文件放置
const handleDrop = (e: DragEvent) => {
  const file = e.dataTransfer.files[0];
  if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(event.target.result as string);
    };
    reader.readAsText(file);
  }
};
```

## 性能优化

1. **懒加载组件**：大型组件按需加载
2. **防抖处理**：编辑器输入防抖
3. **虚拟滚动**：长列表虚拟化（历史记录）
4. **缓存模板**：避免重复解析
5. **Mermaid 异步渲染**：避免阻塞 UI
6. **useMemo 优化**：缓存计算结果（文本统计）

## 安全考虑

1. **XSS 防护**：使用 `DOMPurify` 清理 HTML
2. **输入验证**：API 层验证所有输入参数
3. **CORS 配置**：正确配置跨域策略
4. **内容限制**：限制输入内容大小（10MB）
5. **Mermaid 安全**：设置 `securityLevel: 'loose'`
