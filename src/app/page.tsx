import { getAllPosts } from "@/lib/mdx";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  const posts = getAllPosts();
  return <HomeClient posts={posts} />;
}
