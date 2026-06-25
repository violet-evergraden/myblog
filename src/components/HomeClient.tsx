"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { PostMeta } from "@/lib/mdx";
import PostCard from "@/components/PostCard";

export default function HomeClient({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query, posts]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setShowResults(q.trim().length > 0);
    if (q.trim()) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      setShowResults(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setShowResults(false);
    inputRef.current?.focus();
  };

  // 下拉实时预览（输入时显示）
  const previewResults = useMemo(() => {
    if (!query.trim()) return [];
    return filteredPosts.slice(0, 5);
  }, [query, filteredPosts]);

  return (
    <div className="flex flex-col">
      {/* 搜索区 - 真正居中 */}
      <section className="h-screen flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-fg">
          我的博客
        </h1>
        <p className="text-muted text-center max-w-md text-sm leading-relaxed">
          记录技术、生活与思考的地方
        </p>

        {/* 搜索框 - 宽度限制 + 搜索 */}
        <div className="w-full max-w-lg mx-auto relative">
          <div className="flex items-center w-full rounded-full border border-border/50 bg-bg/30 backdrop-blur-md px-4 py-3 hover:border-border/80 focus-within:border-accent/40 focus-within:bg-bg/50 transition-all duration-300">
            <svg className="w-4 h-4 text-muted/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索文章名称或关键词"
              className="flex-1 ml-2.5 bg-transparent text-fg placeholder:text-muted/40 text-sm outline-none"
            />
            {query ? (
              <button onClick={clearSearch} className="text-muted/30 hover:text-muted transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <span className="text-[9px] text-muted/25 border border-border/30 rounded px-1.5 py-0.5 select-none font-mono">Enter</span>
            )}
          </div>

          {/* 输入时的实时下拉预览 */}
          {showResults && previewResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-bg/90 border border-border/50 rounded-2xl shadow-lg backdrop-blur-xl z-30 overflow-hidden">
              {previewResults.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-fg/5 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <svg className="w-4 h-4 text-muted/40 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-fg truncate">{post.title}</p>
                    <p className="text-xs text-muted/50 truncate mt-0.5">{post.description}</p>
                  </div>
                  <span className="text-[10px] text-muted/30 flex-shrink-0 mt-0.5">{post.date}</span>
                </a>
              ))}
              {filteredPosts.length > 5 && (
                <button
                  onClick={() => {
                    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="w-full text-center py-2.5 text-xs text-accent hover:bg-fg/5 transition-colors"
                >
                  查看全部 {filteredPosts.length} 条结果
                </button>
              )}
            </div>
          )}
          {showResults && query.trim() && filteredPosts.length === 0 && (
            <div className="absolute top-full mt-2 w-full bg-bg/90 border border-border/50 rounded-2xl shadow-lg backdrop-blur-xl z-30 p-6 text-center">
              <p className="text-sm text-muted/50">没有找到相关文章</p>
            </div>
          )}
        </div>
      </section>

      {/* 文章列表 */}
      <section ref={resultsRef} className="scroll-mt-16 pt-16">
        <div className="mx-auto max-w-3xl px-6 pb-10 rounded-none md:my-4">
          <h2 className="flex items-center font-bold border-b border-border/60 pt-4 pb-1 mb-3" style={{ fontSize: '30px' }}>
            {showResults && query.trim() ? `搜索结果 (${filteredPosts.length})` : "最新文章"}
          </h2>
          {(showResults ? filteredPosts : posts).length > 0 ? (
            <div className="flex flex-col divide-y divide-border/40">
              {(showResults && query.trim() ? filteredPosts : posts).map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm py-8 text-center">
              {query ? "没有找到相关文章，换个关键词试试？" : "暂无文章。"}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
