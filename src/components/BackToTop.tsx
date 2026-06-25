"use client";

export default function BackToTop() {
  return (
    <div className="flex justify-center pt-6 pb-4 border-t border-border/40 mt-8">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors duration-200 px-4 py-2 rounded-full border border-border/40 hover:border-accent/40 bg-bg/50 backdrop-blur-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
        返回顶部
      </button>
    </div>
  );
}
