"use client";

import { usePathname } from "next/navigation";
import ReadingProgress from "./ReadingProgress";
import GlowEffect from "./GlowEffect";

export default function ClientEffects({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isArticle = pathname.startsWith("/blog/");

  return (
    <>
      <GlowEffect />
      {isArticle && <ReadingProgress />}
      {children}
    </>
  );
}
