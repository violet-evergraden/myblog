"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function ArticleToc() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h1, h2, h3");
    const items: TocItem[] = [];
    elements.forEach((el, i) => {
      const id = `heading-${i}`;
      el.id = id;
      items.push({
        id,
        text: el.textContent || "",
        level: parseInt(el.tagName[1]),
      });
    });
    setHeadings(items);

    // 监听滚动高亮
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length < 2) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="hidden xl:block fixed right-8 top-28 w-56 z-50">
      <div className="pl-4 border-l border-border/50">
        <p className="text-[11px] font-semibold text-muted/50 tracking-wider mb-3">目录</p>
        {headings.map((h) => (
          <button
            key={h.id}
            onClick={() => scrollTo(h.id)}
            className={`block w-full text-left py-1 text-[12px] leading-tight transition-colors duration-200 hover:text-accent ${
              activeId === h.id ? "text-accent font-medium" : "text-muted/60"
            }`}
            style={{ paddingLeft: `${(h.level - 1) * 12}px` }}
          >
            {h.text}
          </button>
        ))}
      </div>
    </nav>
  );
}
