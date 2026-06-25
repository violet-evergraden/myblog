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

  if (headings.length < 1) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="w-full">
      <p className="font-bold text-fg mb-5" style={{ fontSize: "25px" }}>目录</p>
      <div className="flex flex-col gap-1.5 border-l-2 border-accent/30 pl-4">
        {headings.map((h) => (
          <button
            key={h.id}
            onClick={() => scrollTo(h.id)}
            className={`block w-full text-left py-2 leading-snug transition-colors duration-200 hover:text-accent ${
              activeId === h.id ? "text-accent font-semibold" : "text-fg/60"
            }`}
            style={{
              paddingLeft: `${(h.level - 1) * 14}px`,
              fontSize: "25px",
            }}
          >
            {h.text}
          </button>
        ))}
      </div>
    </nav>
  );
}
