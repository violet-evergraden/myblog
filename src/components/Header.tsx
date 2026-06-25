"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useBg, BgConfig, compressImage } from "@/lib/bg-config";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [bgSubmenu, setBgSubmenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const { config, setConfig } = useBg();
  const menuRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setBgSubmenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const isDark = mounted && theme === "dark";

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ease-in-out ${
      hidden ? "-translate-y-full" : "translate-y-0"
    }`}>
      <div className="mx-auto max-w-3xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-accent hover:text-accent-hover transition-colors">
          violet的小站
        </Link>
        <nav className="flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-1.5 text-sm text-accent hover:text-accent-hover rounded-lg transition-colors duration-200">
              {link.label}
            </Link>
          ))}

          {/* 设置按钮 */}
          <div className="ml-1.5 relative" ref={menuRef}>
            <button
              onClick={() => { setMenuOpen(!menuOpen); setBgSubmenu(false); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-fg/5 text-muted hover:text-fg transition-all duration-200"
              aria-label="设置"
            >
              <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {menuOpen && (
              <>
                {/* 遮罩 */}
                <div className="fixed inset-0 z-40" onClick={() => { setMenuOpen(false); setBgSubmenu(false); }} />

                {/* 菜单面板 */}
                <div className="absolute right-0 top-full mt-3 w-[280px] bg-bg/80 border border-border/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl z-50 overflow-hidden">
                  {!bgSubmenu ? (
                    <div className="p-1.5">
                      <div className="px-3 pt-2 pb-1.5">
                        <span className="text-[11px] font-semibold text-muted/50 tracking-wider">外观</span>
                      </div>

                      {/* 夜间模式 */}
                      <button
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-fg hover:bg-fg/5 active:bg-fg/8 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-fg/5 flex items-center justify-center flex-shrink-0">
                          {isDark ? (
                            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                          )}
                        </div>
                        <span className="flex-1 text-left">夜间模式</span>
                        <div className={`w-11 h-[24px] rounded-full transition-colors duration-300 flex items-center px-[2px] ${isDark ? "bg-accent" : "bg-border"}`}>
                          <div className={`w-[20px] h-[20px] rounded-full bg-white shadow transition-transform duration-300 ${isDark ? "translate-x-[20px]" : "translate-x-0"}`} />
                        </div>
                      </button>

                      {/* 自定义背景 */}
                      <button
                        onClick={() => setBgSubmenu(true)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-fg hover:bg-fg/5 active:bg-fg/8 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-fg/5 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                          </svg>
                        </div>
                        <span className="flex-1 text-left">自定义背景</span>
                        <svg className="w-4 h-4 text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>

                      {/* 当前背景预览 */}
                      <div className="mx-3 mt-2 mb-1">
                        <div className="w-full h-[60px] rounded-xl overflow-hidden border border-border/30">
                          {config.type === "none" ? (
                            <div className="w-full h-full bg-fg/3 flex items-center justify-center text-[10px] text-muted/50">无背景</div>
                          ) : config.type === "image" ? (
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${config.value})`, opacity: config.opacity / 100 }} />
                          ) : (
                            <div className="w-full h-full" style={{ background: config.value, opacity: config.opacity / 100 }} />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-1.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                      {/* 返回 */}
                      <div className="flex items-center px-3 pt-2 pb-1">
                        <button
                          onClick={() => setBgSubmenu(false)}
                          className="flex items-center gap-1 text-sm text-muted hover:text-fg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                          返回
                        </button>
                      </div>

                      <div className="px-3 pt-1 pb-1">
                        <span className="text-[11px] font-semibold text-muted/50 tracking-wider">背景类型</span>
                      </div>

                      {/* 类型切换 - iOS segmented */}
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
                                const patch: Partial<BgConfig> = { type: item.type };
                                if (item.type === "none") patch.opacity = 0;
                                else if (config.opacity === 0) patch.opacity = 40;
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

                      {/* 透明度 */}
                      {config.type !== "none" && (
                        <div className="px-3 py-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted">透明度</span>
                            <span className="text-[11px] text-muted/60 font-mono tabular-nums">{config.opacity}%</span>
                          </div>
                          <input
                            type="range"
                            min={5}
                            max={100}
                            value={config.opacity}
                            onChange={(e) => setConfig({ ...config, opacity: Number(e.target.value) })}
                            className="w-full h-[3px] rounded-full appearance-none bg-border/60 cursor-pointer accent-accent"
                          />
                        </div>
                      )}

                      {/* 图片 */}
                      {config.type === "image" && (
                        <div className="px-3 py-2">
                          <div className="px-0.5 pb-1">
                            <span className="text-[11px] font-semibold text-muted/50 tracking-wider">预设</span>
                          </div>
                          <button
                            onClick={() => setConfig({ ...config, value: "/backgrounds/default.png" })}
                            className={`w-full relative h-[72px] rounded-xl overflow-hidden border-2 transition-all ${
                              config.value === "/backgrounds/default.png" ? "border-accent" : "border-transparent"
                            }`}
                          >
                            <img src="/backgrounds/default.png" alt="默认" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1.5 left-1.5 text-[9px] px-2 py-0.5 rounded-full bg-black/40 text-white/90 backdrop-blur-sm font-medium">蓝色海洋</span>
                          </button>

                          {/* 上传本地图片 */}
                          <div className="px-0.5 pb-1 mt-2">
                            <span className="text-[11px] font-semibold text-muted/50 tracking-wider">上传图片</span>
                          </div>
                          <label className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border/60 hover:border-accent/40 bg-fg/[0.02] hover:bg-fg/[0.04] cursor-pointer transition-colors">
                            <svg className="w-4 h-4 text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="text-[11px] text-muted/50">点击选择本地图片</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const dataUrl = await compressImage(file);
                                  setConfig({ ...config, value: dataUrl });
                                } catch {
                                  // fallback: 直接读取
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setConfig({ ...config, value: ev.target?.result as string });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>

                          {/* URL 输入 */}
                          <div className="px-0.5 pb-1 mt-2">
                            <span className="text-[11px] font-semibold text-muted/50 tracking-wider">图片链接</span>
                          </div>
                          <input
                            type="text"
                            value={config.value.startsWith("data:") ? "" : config.value}
                            onChange={(e) => setConfig({ ...config, value: e.target.value })}
                            placeholder="输入图片 URL..."
                            className="w-full px-3 py-2 rounded-xl border border-border/40 bg-fg/[0.02] text-fg text-xs focus:outline-none focus:border-accent/40 placeholder:text-muted/30 transition-colors"
                          />
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
                                onClick={() => setConfig({ ...config, value: g.value })}
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
                        onClick={() => setConfig({ type: "image", value: "/backgrounds/default.png", opacity: 100 })}
                        className="w-full px-3 py-2 text-[11px] text-muted/60 hover:text-muted transition-colors text-left"
                      >
                        恢复默认
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
