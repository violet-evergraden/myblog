export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto transition-colors duration-300">
      <div className="mx-auto max-w-3xl px-6 py-8 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} 我的博客 &middot; Built with Next.js + Tailwind CSS</p>
      </div>
    </footer>
  );
}
