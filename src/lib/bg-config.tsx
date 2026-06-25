"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface BgConfig {
  type: "none" | "image" | "gradient";
  value: string;
  mobileValue?: string;
  opacity: number;
}

const STORAGE_KEY = "blog-bg-config";

const defaultConfig: BgConfig = {
  type: "image",
  value: "/backgrounds/default.png",
  mobileValue: "/backgrounds/default_phone.jpg",
  opacity: 70,
};

interface BgContextType {
  config: BgConfig;
  setConfig: (cfg: BgConfig) => void;
}

const BgContext = createContext<BgContextType>({
  config: defaultConfig,
  setConfig: () => {},
});

export function useBg() {
  return useContext(BgContext);
}

export function BgProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<BgConfig>(defaultConfig);
  const [loaded, setLoaded] = useState(false);

  // 从 localStorage 加载
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setConfigState(JSON.parse(saved));
      }
    } catch {}
    setLoaded(true);
  }, []);

  const setConfig = useCallback((cfg: BgConfig) => {
    setConfigState(cfg);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  }, []);

  return (
    <BgContext.Provider value={{ config, setConfig }}>
      {/* 背景层 */}
      {loaded && <BackgroundLayer config={config} />}
      {children}
    </BgContext.Provider>
  );
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

function BackgroundLayer({ config }: { config: BgConfig }) {
  if (config.type === "none") return null;

  const isMobile = useIsMobile();
  const opacity = config.opacity / 100;

  const bgStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: -1,
    opacity,
    pointerEvents: "none",
    transition: "opacity 0.4s ease",
  };

  if (config.type === "image") {
    // 优先使用手机端壁纸
    const bgUrl = isMobile && config.mobileValue
      ? config.mobileValue
      : config.value;

    return (
      <div
        style={{
          ...bgStyle,
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    );
  }

  // gradient
  return (
    <div
      style={{
        ...bgStyle,
        background: config.value,
      }}
    />
  );
}
