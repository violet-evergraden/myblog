import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script, ZCOOL_XiaoWei } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const zcoolXiaoWei = ZCOOL_XiaoWei({
  variable: "--font-zcool",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Konataの小站",
  description: "一个使用 Next.js 和 Tailwind CSS 构建的个人博客",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} ${zcoolXiaoWei.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg text-fg transition-colors duration-300">
        <Providers>
          {/* 夜间模式暗色遮罩 */}
          <div id="bg-overlay" />
          <Header />
          <main className="relative z-10 flex-1 w-full px-6 pt-[56px]">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
