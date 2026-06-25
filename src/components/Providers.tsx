"use client";

import { ThemeProvider } from "next-themes";
import { BgProvider } from "@/lib/bg-config";
import ClientEffects from "./ClientEffects";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BgProvider>
        <ClientEffects>
          {children}
        </ClientEffects>
      </BgProvider>
    </ThemeProvider>
  );
}
