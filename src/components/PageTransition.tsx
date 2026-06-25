"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // 触发重排以重新播放动画
    el.classList.remove("animate-fade-in");
    void el.offsetWidth;
    el.classList.add("animate-fade-in");
  }, [pathname]);

  return <div ref={ref} className="animate-fade-in">{children}</div>;
}
