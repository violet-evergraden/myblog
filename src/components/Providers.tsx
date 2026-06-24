"use client";

import { ThemeProvider } from "next-themes";
import { BgProvider } from "@/lib/bg-config";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BgProvider>
        {children}
      </BgProvider>
    </ThemeProvider>
  );
}
