---
title: "Hello World — 博客开张"
date: "2026-06-24"
description: "这是我的第一篇博客文章，记录博客搭建的过程。"
tags: ["博客", "Next.js", "技术"]
---

## 开始

你好，世界！这是我个人博客的第一篇文章。

在搭建这个博客的过程中，我选择了 **Next.js 15** + **TypeScript** + **Tailwind CSS** 的技术栈。这个组合提供了出色的开发体验和优秀的性能。

## 为什么选择这个技术栈？

### Next.js 15

Next.js 是目前最流行的 React 框架之一，提供了：

- **App Router** — 基于文件系统的路由
- **服务器组件** — 减少客户端 JavaScript 体积
- **静态生成 (SSG)** — 博客文章在构建时生成，加载速度极快
- **MDX 支持** — 可以在 Markdown 中使用 React 组件

### Tailwind CSS

Tailwind CSS 让我可以快速构建美观的界面：

```css
/* 不需要写自定义 CSS */
.card {
  @apply bg-white rounded-xl shadow-md p-6;
}
```

### TypeScript

TypeScript 提供类型安全，让代码更可靠、更易维护。

## 添加文章

只需要在 `posts/` 目录下创建 `.md` 文件即可：

```markdown
---
title: "文章标题"
date: "2026-06-24"
description: "文章描述"
tags: ["标签1", "标签2"]
---

这里是文章内容...
```

## 总结

搭建博客是一个很好的学习过程。我会持续在这里分享技术文章和生活随笔。

感谢你的阅读！
