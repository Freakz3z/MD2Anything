# 贡献指南

感谢你对 MD2Anything 的关注！本文档将帮助你了解如何为项目贡献代码，特别是如何开发新的模板。

## 📋 目录

- [开发环境搭建](#开发环境搭建)
- [项目结构](#项目结构)
- [开发新模板](#开发新模板)
- [模板开发指南](#模板开发指南)
- [提交代码](#提交代码)

---

## 开发环境搭建

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/Freakz3z/Md2Everything.git
cd Md2Everything

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动 API 服务（可选）
npm run server
```

---

## 项目结构

```
src/
├── components/           # React 组件
│   ├── DocsModal.tsx     # 文档弹窗
│   ├── HistoryPanel.tsx  # 历史记录面板
│   ├── MarkdownEditor.tsx# Markdown 编辑器
│   ├── Preview.tsx       # 预览组件
│   ├── SettingsPanel.tsx # 设置面板
│   └── TemplateSelector.tsx # 模板选择器
├── templates/            # 模板配置 ⭐
│   ├── index.ts          # 模板导出入口
│   ├── wechat.ts         # 微信模板
│   ├── xiaohongshu.ts    # 小红书模板
│   ├── email.ts          # 邮件模板
│   ├── resume.ts         # 简历模板
│   └── general.ts        # 通用模板
├── utils/
│   ├── export/           # 导出功能
│   │   ├── html.ts       # HTML 导出
│   │   ├── wechat.ts     # 微信导出
│   │   ├── email.ts      # 邮件导出
│   │   ├── image.ts      # 图片导出
│   │   └── pdf.ts        # PDF 导出
│   └── sampleContent.ts  # 示例内容
├── store/
│   └── useStore.ts       # Zustand 状态管理
├── types/
│   └── index.ts          # TypeScript 类型定义
└── App.tsx               # 主应用组件

server/                   # API 服务
├── index.ts              # 服务入口
├── routes/
│   └── convert.ts        # 转换路由
├── utils/
│   ├── styling.ts        # 样式工具
│   └── email.ts          # 邮件工具
└── templates.ts          # 服务端模板
```

---

## 开发新模板

### 模板类型

MD2Anything 支持以下格式的模板：

| 格式 | 用途 | 文件 |
|------|------|------|
| `wechat` | 微信公众号 | `src/templates/wechat.ts` |
| `xiaohongshu` | 小红书 | `src/templates/xiaohongshu.ts` |
| `email` | 邮件 | `src/templates/email.ts` |
| `resume` | 简历 | `src/templates/resume.ts` |
| `general` | 通用 | `src/templates/general.ts` |

### 模板接口定义

```typescript
// src/types/index.ts

interface Template {
  id: string;           // 唯一标识符，如 'wechat-tech'
  name: string;         // 显示名称，如 '技术文章'
  format: string;       // 格式类型：wechat | xiaohongshu | email | resume | general
  description: string;  // 描述文字
  themeColors: string[];// 主题颜色数组 [主色, 辅色, 背景色]
  styles: Record<string, string>; // CSS 样式对象
}
```

### 创建新模板

#### 步骤 1：选择模板文件

根据你的模板类型，选择对应的文件：

- 微信模板 → `src/templates/wechat.ts`
- 小红书模板 → `src/templates/xiaohongshu.ts`
- 邮件模板 → `src/templates/email.ts`
- 简历模板 → `src/templates/resume.ts`
- 通用模板 → `src/templates/general.ts`

#### 步骤 2：定义模板对象

```typescript
// 在对应的模板数组中添加新模板
{
  id: 'my-custom-template',        // 唯一 ID，格式建议：格式类型-风格名称
  name: '我的自定义模板',           // 显示名称
  format: 'general',               // 格式类型
  description: '这是一个示例模板',  // 描述
  themeColors: ['#1a1a1a', '#ff6b6b', '#ffffff'], // [主色, 辅色, 背景色]
  styles: {
    // 在这里定义样式...
  },
}
```

#### 步骤 3：定义样式

`styles` 对象支持以下元素：

```typescript
styles: {
  // 容器样式
  container: 'max-width: 100%; padding: 20px; line-height: 1.8; color: #333;',

  // 标题样式
  h1: 'font-size: 2em; font-weight: 700; margin: 0.8em 0 0.5em; color: #1a1a1a;',
  h2: 'font-size: 1.5em; font-weight: 600; margin: 0.8em 0 0.4em; color: #1a1a1a;',
  h3: 'font-size: 1.25em; font-weight: 600; margin: 0.6em 0 0.3em; color: #333;',

  // 段落样式
  p: 'margin: 0.8em 0; color: #333;',

  // 引用样式
  blockquote: 'border-left: 4px solid #1677ff; padding: 0.5em 1em; margin: 1em 0; background: #f5f5f5;',

  // 代码样式
  code: 'background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; color: #d73a49;',
  pre: 'background: #282c34; color: #abb2bf; padding: 1em; border-radius: 8px; overflow-x: auto;',

  // 列表样式
  ul: 'padding-left: 1.5em; margin: 0.5em 0;',
  ol: 'padding-left: 1.5em; margin: 0.5em 0;',
  li: 'margin: 0.3em 0;',

  // 链接样式
  a: 'color: #1677ff; text-decoration: none;',

  // 表格样式
  table: 'width: 100%; border-collapse: collapse; margin: 1em 0;',
  th: 'background: #f5f5f5; padding: 0.5em; border: 1px solid #e8e8e8; text-align: left;',
  td: 'padding: 0.5em; border: 1px solid #e8e8e8;',

  // 分割线样式
  hr: 'border: none; height: 1px; background: #e8e8e8; margin: 1.5em 0;',

  // 图片样式
  img: 'max-width: 100%; height: auto; border-radius: 4px;',
}
```

---

## 模板开发指南

### 样式编写原则

1. **使用内联样式格式**
   - 所有样式必须是有效的 CSS 字符串
   - 每个属性用分号结尾
   - 避免使用 CSS 变量（兼容性考虑）

2. **考虑目标平台**
   - **微信**：使用内联样式，避免外部 CSS
   - **邮件**：使用 table 布局，避免浮动和 flex
   - **小红书**：字体要大，视觉冲击力强

3. **颜色搭配**
   - `themeColors` 应与 `styles` 中的颜色保持一致
   - 建议使用对比度高的配色方案

### 示例：创建一个微信模板

```typescript
// src/templates/wechat.ts

export const wechatTemplates: Template[] = [
  // ... 现有模板

  {
    id: 'wechat-minimalist',
    name: '极简白',
    format: 'wechat',
    description: '极简白色风格，干净清爽',
    themeColors: ['#333333', '#666666', '#ffffff'],
    styles: {
      container: 'max-width: 100%; padding: 24px; line-height: 1.8; color: #333; font-family: -apple-system, sans-serif;',
      h1: 'font-size: 1.5em; font-weight: 600; margin: 1em 0 0.5em; color: #333; text-align: center;',
      h2: 'font-size: 1.25em; font-weight: 600; margin: 0.8em 0 0.4em; color: #333; border-bottom: 1px solid #eee; padding-bottom: 0.3em;',
      h3: 'font-size: 1.1em; font-weight: 600; margin: 0.6em 0 0.3em; color: #666;',
      p: 'margin: 0.8em 0; color: #333; text-align: justify;',
      blockquote: 'border-left: 3px solid #ddd; padding: 0.5em 1em; margin: 1em 0; background: #fafafa; color: #666;',
      code: 'background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; color: #c7254e;',
      pre: 'background: #f8f8f8; color: #333; padding: 1em; border-radius: 4px; overflow-x: auto; margin: 1em 0;',
      ul: 'padding-left: 1.5em; margin: 0.8em 0;',
      ol: 'padding-left: 1.5em; margin: 0.8em 0;',
      li: 'margin: 0.3em 0;',
      a: 'color: #333; text-decoration: underline;',
      table: 'width: 100%; border-collapse: collapse; margin: 1em 0;',
      th: 'background: #f5f5f5; padding: 0.5em; border: 1px solid #eee; text-align: left;',
      td: 'padding: 0.5em; border: 1px solid #eee;',
      hr: 'border: none; height: 1px; background: #eee; margin: 1.5em 0;',
      img: 'max-width: 100%; height: auto; margin: 1em 0;',
    },
  },
];
```

### 测试模板

1. 启动开发服务器：`npm run dev`
2. 在应用中选择对应格式
3. 选择你创建的模板
4. 输入示例内容测试效果
5. 使用导出功能验证最终效果

---

## 提交代码

### Git 提交规范

我们使用约定式提交：

```
feat: 添加新功能
fix: 修复 Bug
docs: 文档更新
style: 代码格式调整（不影响功能）
refactor: 代码重构
test: 测试相关
chore: 构建/工具链相关
```

### 提交流程

```bash
# 1. 创建新分支
git checkout -b feat/new-template

# 2. 提交更改
git add .
git commit -m "feat: 添加极简白微信模板"

# 3. 推送分支
git push origin feat/new-template

# 4. 创建 Pull Request
```

### PR 检查清单

- [ ] 代码通过 TypeScript 类型检查
- [ ] 新模板已测试导出功能
- [ ] 提交信息符合规范
- [ ] 更新了相关文档（如有必要）

---

## 快速开发模板

如果你使用 Claude Code，可以使用内置的 Skill 快速创建模板：

```
/create-template
```

这个 Skill 会通过交互式问答帮助你：
1. 选择模板类型
2. 设置模板名称和描述
3. 配置主题颜色
4. 自动生成模板代码并写入文件

## 获取帮助

如果你在开发过程中遇到问题：

1. 使用 `/create-template` Skill 快速生成模板
2. 查看现有模板作为参考
3. 阅读 [技术文档](docs/)
4. 提交 [Issue](https://github.com/Freakz3z/Md2Everything/issues)

感谢你的贡献！❤️
