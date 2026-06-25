import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于 - Konataの小站",
  description: "关于我",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8 max-w-none">
      <h1 className="text-2xl font-bold tracking-tight text-fg">关于我</h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-20">
        <p>
          你好！欢迎来到我的个人博客。
        </p>
        <p>
          我是一名开发者，热爱技术与创造。这个博客是我记录学习心得、技术探索和个人思考的空间。
        </p>
        <p>
          这个博客使用以下技术构建：
        </p>
        <ul>
          <li><strong>Next.js</strong> — React 框架，支持 SSR 和静态生成</li>
          <li><strong>React 19</strong> — 用户界面库</li>
          <li><strong>TypeScript</strong> — 类型安全的 JavaScript</li>
          <li><strong>Tailwind CSS</strong> — 原子化 CSS 框架</li>
          <li><strong>react-markdown</strong> — Markdown 内容渲染</li>
          <li><strong>next-themes</strong> — 暗色/亮色主题切换</li>
        </ul>
        <p>
          博客内容使用 Markdown 格式编写，存储在 <code>posts/</code> 目录下，构建时自动生成页面。
        </p>
      </div>
    </div>
  );
}
