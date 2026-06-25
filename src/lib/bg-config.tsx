"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface BgConfig {
  type: "none" | "image" | "gradient";
  value: string; // 图片路径或渐变 CSS
  opacity: number; // 0-100
}

const STORAGE_KEY = "blog-bg-config";

const defaultConfig: BgConfig = {
  type: "image",
  value: "/backgrounds/default.png",
  opacity: 100,
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

/** 压缩本地图片为 base64（限制宽度 1920px，质量 0.7） */
export function compressImage(file: File, maxWidth = 1920, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width;
      let h = img.height;
      if (w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      URL.revokeObjectURL(img.src);
      resolve(dataUrl);
    };
    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = URL.createObjectURL(file);
  });
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

function BackgroundLayer({ config }: { config: BgConfig }) {
  if (config.type === "none") return null;

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
    return (
      <div
        style={{
          ...bgStyle,
          backgroundImage: `url(${config.value})`,
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
