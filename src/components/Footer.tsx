export default function Footer() {
  return (
    <footer className="mt-auto transition-colors duration-300">
      <div className="mx-auto max-w-3xl px-6 py-8 text-center text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
        <p>&copy; {new Date().getFullYear()} Konataの小站 &middot; Built with Next.js + Tailwind CSS</p>
      </div>
    </footer>
  );
}
