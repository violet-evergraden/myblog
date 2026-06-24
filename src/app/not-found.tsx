import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      <h1 className="text-6xl font-bold text-accent/30">404</h1>
      <p className="text-muted">
        页面不存在
      </p>
      <Link
        href="/"
        className="px-5 py-2 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors duration-200"
      >
        返回首页
      </Link>
    </div>
  );
}
