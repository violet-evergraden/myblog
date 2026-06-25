"use client";

import { useEffect, useRef } from "react";

export default function GlowEffect() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(231, 76, 111, 0.06), transparent 40%)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none transition-background duration-300"
    />
  );
}
