"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useBg, BgConfig } from "@/lib/bg-config";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "博客" },
  { href: "/about", label: "关于" },
];

const presetGradients = [
  { label: "日落橙粉", value: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #a1c4fd 100%)" },
  { label: "深蓝夜空", value: "linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 50%, #0c0c1e 100%)" },
  { label: "紫色梦幻", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { label: "森林绿意", value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
  { label: "樱花粉", value: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #e1bee7 100%)" },
];

export default function Header() {
  const [bgOpen, setBgOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { config, setConfig } = useBg();
  const bgRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 10) {
        setHidden(false);
      } else if (y > lastScrollY.current + 5) {
        setHidden(true);
      } else if (y < lastScrollY.current - 5) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 点击外部关闭
  useEffect(() => {
    if (!bgOpen) return;
    const handler = (e: MouseEvent) => {
      if (bgRef.current && !bgRef.current.contains(e.target as Node)) {
        setBgOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bgOpen]);

  const isDark = mounted && theme === "dark";

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ease-in-out ${
      hidden ? "-translate-y-full" : "translate-y-0"
    }`}>
      <div className="mx-auto max-w-3xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight hover:opacity-80 transition-opacity artistic-title" style={{ fontFamily: "var(--font-zcool), var(--font-dancing), cursive", fontSize: "20px" }}>
          Konataの小站
        </Link>
        <nav className="flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-1.5 text-sm text-fg/80 hover:text-accent rounded-lg transition-colors duration-200">
              {link.label}
            </Link>
          ))}

          {/* 夜间模式按钮 - 直接切换 */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="ml-1.5 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-fg/5 text-muted hover:text-fg transition-all duration-200"
            aria-label="切换主题"
          >
            {isDark ? (
              <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          {/* 背景设置按钮 */}
          <div className="ml-0.5 relative" ref={bgRef}>
            <button
              onClick={() => setBgOpen(!bgOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-fg/5 text-muted hover:text-fg transition-all duration-200"
              aria-label="背景"
            >
              <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
              </svg>
            </button>

            {bgOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setBgOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-[260px] bg-white/85 dark:bg-[#0f0a2a]/85 border border-border/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl z-50 overflow-hidden">
                  <div className="p-1.5 max-h-[65vh] overflow-y-auto custom-scrollbar">
                    {/* 背景类型 */}
                    <div className="px-3 pt-2 pb-1">
                      <span className="text-[11px] font-semibold text-muted/50 tracking-wider">背景类型</span>
                    </div>
                    <div className="px-3 py-1.5">
                      <div className="flex bg-fg/5 rounded-xl p-0.5">
                        {[
                          { type: "none" as const, label: "无" },
                          { type: "image" as const, label: "图片" },
                          { type: "gradient" as const, label: "渐变" },
                        ].map((item) => (
                          <button
                            key={item.type}
                            onClick={() => {
                              const patch: Partial<BgConfig> = { type: item.type, opacity: 70 };
                              setConfig({ ...config, ...patch });
                            }}
                            className={`flex-1 py-1.5 rounded-[10px] text-xs font-medium transition-all duration-200 ${
                              config.type === item.type
                                ? "bg-bg text-fg shadow-sm"
                                : "text-muted hover:text-fg"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 图片 */}
                    {config.type === "image" && (
                      <div className="px-3 py-2">
                        {/* 上传本地图片 */}
                        <label className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border/60 hover:border-accent/40 bg-fg/[0.02] hover:bg-fg/[0.04] cursor-pointer transition-colors">
                          <svg className="w-4 h-4 text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          <span className="text-[11px] text-muted/50">点击选择本地图片</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setConfig({ ...config, value: ev.target?.result as string, opacity: 70 });
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                      </div>
                    )}

                    {/* 渐变 */}
                    {config.type === "gradient" && (
                      <div className="px-3 py-2">
                        <div className="px-0.5 pb-1">
                          <span className="text-[11px] font-semibold text-muted/50 tracking-wider">预设</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {presetGradients.map((g) => (
                            <button
                              key={g.value}
                              onClick={() => setConfig({ ...config, value: g.value, opacity: 70 })}
                              className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                                config.value === g.value ? "bg-fg/5" : "hover:bg-fg/[0.03]"
                              }`}
                            >
                              <div className="w-9 h-6 rounded-lg flex-shrink-0" style={{ background: g.value }} />
                              <span className="text-xs text-fg">{g.label}</span>
                              {config.value === g.value && (
                                <svg className="w-3.5 h-3.5 text-accent ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 恢复默认 */}
                    <div className="mx-3 my-1 h-px bg-border/30" />
                    <button
                      onClick={() => setConfig({ type: "image" as const, value: "/backgrounds/default.png", mobileValue: "/backgrounds/default_phone.jpg", opacity: 70 })}
                      className="w-full px-3 py-2 text-[11px] text-muted/60 hover:text-muted transition-colors text-left"
                    >
                      恢复默认
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
