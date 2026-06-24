import { getAllPosts } from "@/lib/mdx";
import PostCard from "@/components/PostCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "博客 - 我的博客",
  description: "所有博客文章列表",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold tracking-tight">全部文章</h1>
      {posts.length > 0 ? (
        <div className="flex flex-col divide-y divide-border">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-sm py-8 text-center">
          暂无文章。
        </p>
      )}
    </div>
  );
}
