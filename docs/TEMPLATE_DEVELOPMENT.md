# 模板开发详细指南

本文档详细介绍如何为 MD2Anything 开发自定义模板。

## 目录

- [模板基础](#模板基础)
- [模板类型](#模板类型)
- [样式系统](#样式系统)
- [开发流程](#开发流程)
- [最佳实践](#最佳实践)
- [示例模板](#示例模板)
- [调试技巧](#调试技巧)

---

## 模板基础

### 模板结构

每个模板都是一个包含以下字段的对象：

```typescript
interface Template {
  id: string;                        // 唯一标识符
  name: string;                      // 显示名称
  format: OutputFormat;              // 格式类型
  description: string;               // 描述
  themeColors: string[];             // 主题颜色 [主色, 辅色, 背景色]
  styles: Record<string, string>;    // CSS 样式映射
}
```

### 支持的样式元素

| 键名 | 描述 | 常用属性 |
|------|------|----------|
| `container` | 根容器 | max-width, padding, line-height, color, font-family |
| `h1` | 一级标题 | font-size, font-weight, margin, color, text-align |
| `h2` | 二级标题 | font-size, font-weight, margin, color, border-bottom |
| `h3` | 三级标题 | font-size, font-weight, margin, color |
| `h4` | 四级标题 | font-size, font-weight, margin, color |
| `h5` | 五级标题 | font-size, font-weight, margin, color |
| `h6` | 六级标题 | font-size, font-weight, margin, color |
| `p` | 段落 | margin, color, text-align, text-indent |
| `blockquote` | 引用块 | border-left, padding, margin, background, color |
| `code` | 行内代码 | background, padding, border-radius, font-size, color |
| `pre` | 代码块 | background, color, padding, border-radius, overflow-x |
| `ul` | 无序列表 | padding-left, margin, list-style |
| `ol` | 有序列表 | padding-left, margin, list-style |
| `li` | 列表项 | margin, line-height |
| `a` | 链接 | color, text-decoration |
| `table` | 表格 | width, border-collapse, margin |
| `th` | 表头单元格 | background, padding, border, text-align, font-weight |
| `td` | 表格单元格 | padding, border |
| `hr` | 分割线 | border, height, background, margin |
| `img` | 图片 | max-width, height, border-radius, margin |

---

## 模板类型

### 微信模板 (wechat)

微信模板需要特别注意：

1. **必须使用内联样式** - 微信公众号编辑器不支持 `<style>` 标签
2. **字体限制** - 使用系统字体，微信支持的字体有限
3. **宽度限制** - 建议宽度不超过 100%，适应手机屏幕

```typescript
{
  id: 'wechat-example',
  name: '示例微信模板',
  format: 'wechat',
  description: '适合技术文章',
  themeColors: ['#333333', '#1677ff', '#ffffff'],
  styles: {
    container: 'max-width: 100%; padding: 20px; line-height: 1.8; color: #333;',
    // ... 其他样式
  },
}
```

### 小红书模板 (xiaohongshu)

小红书模板特点：

1. **字体要大** - 图片尺寸小，需要大字体保证可读性
2. **视觉冲击力** - 使用鲜明的颜色对比
3. **边距充足** - 预留足够的 padding

```typescript
{
  id: 'xiaohongshu-example',
  name: '示例小红书模板',
  format: 'xiaohongshu',
  description: '适合工具分享',
  themeColors: ['#2d3436', '#74b9ff', '#f8f9fa'],
  styles: {
    container: 'max-width: 100%; padding: 40px 32px; line-height: 1.9; color: #2d3436;',
    h1: 'font-size: 1.8em; font-weight: 700; text-align: center;',
    // ... 其他样式
  },
}
```

### 邮件模板 (email)

邮件模板最复杂，需要：

1. **Table 布局** - 很多邮件客户端不支持 flexbox
2. **内联样式** - 所有样式必须内联
3. **MSO 兼容** - 添加 Outlook 兼容代码
4. **Web 安全字体** - 使用通用字体

```typescript
{
  id: 'email-example',
  name: '示例邮件模板',
  format: 'email',
  description: '专业商务邮件',
  themeColors: ['#2563eb', '#1e40af', '#f8fafc'],
  styles: {
    container: 'max-width: 600px; margin: 0 auto; font-family: -apple-system, Arial, sans-serif;',
    // ... 其他样式
  },
}
```

### 简历模板 (resume)

简历模板特点：

1. **专业感** - 使用商务色调
2. **层次清晰** - 通过颜色和大小区分信息层级
3. **适合打印** - PDF 导出效果要好

```typescript
{
  id: 'resume-example',
  name: '示例简历模板',
  format: 'resume',
  description: '专业简历风格',
  themeColors: ['#1e3a5f', '#2563eb', '#f1f5f9'],
  styles: {
    container: 'max-width: 800px; margin: 0 auto; line-height: 1.6;',
    h1: 'font-size: 2.2em; font-weight: 700; text-align: center;',
    // ... 其他样式
  },
}
```

### 通用模板 (general)

通用模板要求：

1. **全面支持** - 支持所有 Markdown 元素
2. **清晰易读** - 适合各种导出格式
3. **可定制性** - 易于调整

---

## 样式系统

### 颜色系统

每个模板定义三个主题色：

```typescript
themeColors: [
  '#1a1a1a',  // 主色 - 用于标题、重点文字
  '#1677ff',  // 强调色 - 用于链接、边框、高亮
  '#ffffff',  // 背景色 - 用于容器背景
]
```

### 排版系统

建议的字体大小比例：

```
h1: 2em ~ 2.5em
h2: 1.5em ~ 2em
h3: 1.25em ~ 1.5em
h4: 1.1em ~ 1.25em
p:  1em (基准)
code: 0.85em ~ 0.95em
```

行高建议：

```
标题: 1.2 ~ 1.4
正文: 1.6 ~ 2.0
代码: 1.4 ~ 1.6
```

### 间距系统

```
段落间距: 0.6em ~ 1em
标题上边距: 0.8em ~ 1.2em
标题下边距: 0.3em ~ 0.6em
列表项间距: 0.2em ~ 0.4em
容器内边距: 20px ~ 40px
```

---

## 开发流程

### 1. 规划设计

- 确定模板用途和目标平台
- 选择配色方案（2-3 色）
- 规划字体大小层级

### 2. 编写模板

```typescript
// src/templates/wechat.ts (或其他模板文件)

export const wechatTemplates: Template[] = [
  // ... 现有模板

  {
    id: 'wechat-my-template',
    name: '我的模板',
    format: 'wechat',
    description: '自定义模板描述',
    themeColors: ['#主色', '#强调色', '#背景色'],
    styles: {
      // 从 container 开始
      container: '...',

      // 然后是标题
      h1: '...',
      h2: '...',
      h3: '...',

      // 正文元素
      p: '...',
      blockquote: '...',

      // 代码
      code: '...',
      pre: '...',

      // 列表
      ul: '...',
      ol: '...',
      li: '...',

      // 其他
      a: '...',
      table: '...',
      th: '...',
      td: '...',
      hr: '...',
      img: '...',
    },
  },
];
```

### 3. 导出模板

确保在 `src/templates/index.ts` 中导出：

```typescript
export { wechatTemplates } from './wechat';
```

### 4. 测试

```bash
# 启动开发服务器
npm run dev

# 在浏览器中测试
# 1. 选择对应格式
# 2. 选择新模板
# 3. 输入测试内容
# 4. 测试导出功能
```

---

## 最佳实践

### 1. 样式一致性

```typescript
// ✅ 好的做法 - 使用变量或注释保持一致
styles: {
  container: 'color: #333; /* 主文字颜色 */',
  h1: 'color: #333;', // 与容器一致
  p: 'color: #333;',  // 与容器一致
}

// ❌ 不好的做法 - 颜色不一致
styles: {
  container: 'color: #333;',
  h1: 'color: #3a3a3a;', // 略有差异
  p: 'color: #2d2d2d;',  // 又不一样
}
```

### 2. 响应式考虑

```typescript
// 使用相对单位
h1: 'font-size: 2em;'  // ✅ 相对于容器
h1: 'font-size: 32px;' // ❌ 固定像素

// 使用百分比宽度
container: 'max-width: 100%;' // ✅ 适应容器
container: 'width: 800px;'    // ❌ 可能溢出
```

### 3. 可读性

```typescript
// ✅ 好的做法 - 适当的行高和间距
p: 'margin: 0.8em 0; line-height: 1.8;'

// ❌ 不好的做法 - 过于紧凑
p: 'margin: 0; line-height: 1.2;'
```

### 4. 平台兼容

```typescript
// 微信/邮件：使用 web 安全字体
container: 'font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;'

// 避免：不常见的字体
container: 'font-family: "Some Fancy Font", sans-serif;'
```

---

## 示例模板

### 极简白模板

```typescript
{
  id: 'general-minimal-white',
  name: '极简白',
  format: 'general',
  description: '干净简洁的白色主题',
  themeColors: ['#333333', '#666666', '#ffffff'],
  styles: {
    container: 'max-width: 100%; padding: 32px; line-height: 1.8; color: #333; font-family: -apple-system, sans-serif;',
    h1: 'font-size: 2em; font-weight: 600; margin: 1em 0 0.5em; color: #333;',
    h2: 'font-size: 1.5em; font-weight: 600; margin: 0.8em 0 0.4em; color: #333;',
    h3: 'font-size: 1.25em; font-weight: 600; margin: 0.6em 0 0.3em; color: #333;',
    p: 'margin: 0.8em 0; color: #333;',
    blockquote: 'border-left: 3px solid #ddd; padding: 0.5em 1em; margin: 1em 0; background: #fafafa; color: #666;',
    code: 'background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; color: #c7254e;',
    pre: 'background: #f8f8f8; color: #333; padding: 1em; border-radius: 8px; overflow-x: auto; margin: 1em 0;',
    ul: 'padding-left: 1.5em; margin: 0.8em 0;',
    ol: 'padding-left: 1.5em; margin: 0.8em 0;',
    li: 'margin: 0.3em 0;',
    a: 'color: #333; text-decoration: underline;',
    table: 'width: 100%; border-collapse: collapse; margin: 1em 0;',
    th: 'background: #f5f5f5; padding: 0.6em; border: 1px solid #eee; text-align: left;',
    td: 'padding: 0.6em; border: 1px solid #eee;',
    hr: 'border: none; height: 1px; background: #eee; margin: 1.5em 0;',
    img: 'max-width: 100%; height: auto; margin: 1em 0;',
  },
}
```

### 暗黑主题模板

```typescript
{
  id: 'general-dark',
  name: '暗黑模式',
  format: 'general',
  description: '护眼暗色主题',
  themeColors: ['#e0e0e0', '#61afef', '#1e1e1e'],
  styles: {
    container: 'max-width: 100%; padding: 32px; line-height: 1.8; color: #e0e0e0; background: #1e1e1e;',
    h1: 'font-size: 2em; font-weight: 600; margin: 1em 0 0.5em; color: #fff;',
    h2: 'font-size: 1.5em; font-weight: 600; margin: 0.8em 0 0.4em; color: #fff;',
    h3: 'font-size: 1.25em; font-weight: 600; margin: 0.6em 0 0.3em; color: #61afef;',
    p: 'margin: 0.8em 0; color: #b0b0b0;',
    blockquote: 'border-left: 3px solid #61afef; padding: 0.5em 1em; margin: 1em 0; background: #2a2a2a; color: #b0b0b0;',
    code: 'background: #2a2a2a; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; color: #98c379;',
    pre: 'background: #282c34; color: #abb2bf; padding: 1em; border-radius: 8px; overflow-x: auto; margin: 1em 0;',
    ul: 'padding-left: 1.5em; margin: 0.8em 0;',
    ol: 'padding-left: 1.5em; margin: 0.8em 0;',
    li: 'margin: 0.3em 0;',
    a: 'color: #61afef; text-decoration: none;',
    table: 'width: 100%; border-collapse: collapse; margin: 1em 0;',
    th: 'background: #2a2a2a; padding: 0.6em; border: 1px solid #3a3a3a; text-align: left; color: #fff;',
    td: 'padding: 0.6em; border: 1px solid #3a3a3a;',
    hr: 'border: none; height: 1px; background: #3a3a3a; margin: 1.5em 0;',
    img: 'max-width: 100%; height: auto; margin: 1em 0;',
  },
}
```

---

## 调试技巧

### 1. 使用浏览器开发工具

在预览区域右键 → 检查元素，可以直接看到应用的样式。

### 2. 逐步调试

先确保 `container` 样式正确，然后逐个添加其他元素样式。

### 3. 测试边界情况

- 超长标题
- 多级嵌套列表
- 大段代码块
- 多个表格
- 空段落

### 4. 导出测试

每个模板都应该测试实际导出效果：

- 微信：粘贴到公众号编辑器
- 邮件：粘贴到邮件客户端
- 图片：检查分辨率和清晰度
- PDF：检查分页和打印效果

---

## 获取帮助

如果在开发模板时遇到问题：

1. 参考现有模板实现
2. 查阅 [CONTRIBUTING.md](../CONTRIBUTING.md)
3. 提交 [Issue](https://github.com/Freakz3z/Md2Everything/issues)

祝开发愉快！🎉
