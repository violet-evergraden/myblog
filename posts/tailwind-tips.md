---
title: "Tailwind CSS 实用技巧"
date: "2026-06-20"
description: "分享一些 Tailwind CSS 的实用技巧和最佳实践。"
tags: ["CSS", "Tailwind", "前端"]
---

## 响应式设计

Tailwind CSS 提供了强大的响应式工具。使用 `sm:`、`md:`、`lg:` 等前缀可以轻松实现响应式布局：

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 在小屏幕显示1列，中屏幕2列，大屏幕3列 -->
</div>
```

## 暗色模式

Tailwind 内置暗色模式支持。在配置中启用后，使用 `dark:` 前缀：

```html
<div class="bg-white dark:bg-zinc-900 text-black dark:text-white">
  自动适配亮色和暗色主题
</div>
```

## 动画效果

结合 Tailwind 的动画工具类，可以实现简单的过渡效果：

```html
<button class="transition-all duration-300 hover:scale-105 hover:shadow-lg">
  悬停时放大并显示阴影
</button>
```

## 自定义主题

在 `globals.css` 中使用 `@theme` 指令自定义主题变量：

```css
@theme inline {
  --color-primary: #3b82f6;
  --color-accent: #8b5cf6;
}
```

## 最佳实践

1. **使用语义化类名** — 通过组件封装，避免在多个地方重复相同的类名组合
2. **合理使用间距** — 保持一致的间距节奏
3. **注意可访问性** — 确保颜色对比度满足 WCAG 标准
4. **利用 JIT 模式** — Tailwind 4 的 JIT 编译器只生成实际使用的 CSS，体积更小

## 总结

Tailwind CSS 是一个非常强大的 CSS 框架，掌握这些技巧可以让你的开发效率大幅提升。
