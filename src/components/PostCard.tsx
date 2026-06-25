"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { PostMeta } from "@/lib/mdx";

export default function PostCard({ post }: { post: PostMeta }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.01)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  }, []);

  return (
    <article className="group" ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ transition: "transform 0.15s ease-out", willChange: "transform" }}>
      <Link
        href={`/blog/${post.slug}`}
        target="_blank"
        className="block p-4 rounded-xl border border-border/40 bg-card/40 hover:bg-card/80 hover:border-accent/30 transition-all duration-200"
      >
        <div className="flex flex-col gap-2">
          <time className="text-xs font-mono text-muted tracking-wide">
            {post.date}
          </time>
          <h2 className="text-lg font-semibold text-fg group-hover:text-accent transition-colors duration-200">
            {post.title}
          </h2>
          <p className="text-sm text-muted leading-relaxed line-clamp-2">
            {post.description}
          </p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
