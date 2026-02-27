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

### 2. 导出流程

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

### 3. API 服务

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

## 数据流

### 用户编辑流程

```
用户输入 Markdown
        │
        ▼
  MarkdownEditor 组件
        │
        ▼
  更新 Zustand Store (setMarkdownContent)
        │
        ▼
  Preview 组件监听变化
        │
        ▼
  marked 解析 + 模板样式应用
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

## 性能优化

1. **懒加载组件**：大型组件按需加载
2. **防抖处理**：编辑器输入防抖
3. **虚拟滚动**：长列表虚拟化（历史记录）
4. **缓存模板**：避免重复解析

## 安全考虑

1. **XSS 防护**：使用 `DOMPurify` 清理 HTML
2. **输入验证**：API 层验证所有输入参数
3. **CORS 配置**：正确配置跨域策略
4. **内容限制**：限制输入内容大小（10MB）
