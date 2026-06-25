import Link from "next/link";
import { PostMeta } from "@/lib/mdx";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group">
      <Link
        href={`/blog/${post.slug}`}
        target="_blank"
        className="block p-4 -mx-4 rounded-xl hover:bg-card/60 transition-all duration-200"
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
