import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/mdx";
import MarkdownBody from "@/components/MarkdownBody";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} - violet的小站`,    
    description: post.description,
  };
}

export async function generateStaticParams() {
  const { getAllPosts } = await import("@/lib/mdx");
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-8 max-w-none">
      <header className="flex flex-col gap-3 border-b border-border pb-6">
        <time className="text-xs font-mono text-muted tracking-wide">
          {post.date}
        </time>
        <h1 className="text-3xl font-bold tracking-tight text-fg">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-muted leading-relaxed">
            {post.description}
          </p>
        )}
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
      </header>
      <MarkdownBody content={post.content} />
    </article>
  );
}
