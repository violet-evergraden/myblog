import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/mdx";
import MarkdownBody from "@/components/MarkdownBody";
import ArticleToc from "@/components/ArticleToc";
import ViewCounter from "@/components/ViewCounter";
import BackToTop from "@/components/BackToTop";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} - Konataの小站`,
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
    <div className="relative max-w-3xl mx-auto pt-4 pb-16 px-6">
      {/* 目录 - 绝对定位在文章左边 */}
      <div className="hidden xl:block absolute right-full top-0 mr-8 w-56">
        <ArticleToc />
      </div>
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-3 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <time className="text-xs font-mono text-muted tracking-wide">
              {post.date}
            </time>
            <span className="text-border">·</span>
            <ViewCounter slug={post.slug} />
          </div>
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
        <BackToTop />
      </article>
    </div>
  );
}
