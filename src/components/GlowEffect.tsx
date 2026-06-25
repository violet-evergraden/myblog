"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  vx: number;
  vy: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
  layer: number;
}

export default function GlowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petals = useRef<Petal[]>([]);
  const rafRef = useRef<number>(0);
  const petalTimer = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawPetal = (ctx: CanvasRenderingContext2D, p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      const s = p.size;
      const colors: [string, string][] = [
        ["rgba(255,182,193,1)", "rgba(255,105,140,0.9)"],
        ["rgba(255,170,190,1)", "rgba(245,80,120,0.85)"],
        ["rgba(255,192,203,1)", "rgba(255,100,130,0.9)"],
      ];
      const c = colors[p.layer] || colors[1];

      // 五瓣花
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        ctx.save();
        ctx.rotate(angle);

        const pw = s * 0.45;
        const ph = s * 0.9;
        const grad = ctx.createRadialGradient(0, -ph * 0.2, 0, 0, -ph * 0.2, ph * 0.6);
        grad.addColorStop(0, c[0]);
        grad.addColorStop(1, c[1]);
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(pw, -ph * 0.3, pw * 0.8, -ph * 0.8, 0, -ph);
        ctx.bezierCurveTo(-pw * 0.8, -ph * 0.8, -pw, -ph * 0.3, 0, 0);
        ctx.fill();
        ctx.restore();
      }

      // 花心
      ctx.fillStyle = "rgba(255, 220, 100, 0.8)";
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const addPetal = (width: number, height: number, burst?: { x: number; y: number }) => {
      const layer = Math.random() < 0.3 ? 0 : Math.random() < 0.5 ? 1 : 2;
      const base = burst ? { x: burst.x, y: burst.y } : { x: Math.random() * width * 1.2 - width * 0.1, y: -20 };
      const burstSpeed = burst ? 2 + Math.random() * 4 : 0;
      const burstAngle = burst ? Math.random() * Math.PI * 2 : 0;
      petals.current.push({
        x: base.x,
        y: base.y,
        size: layer === 0 ? 14 + Math.random() * 16 : layer === 1 ? 10 + Math.random() * 12 : 6 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.12,
        vx: burst ? Math.cos(burstAngle) * burstSpeed : (Math.random() - 0.5) * 1.2 + 0.3,
        vy: burst ? Math.sin(burstAngle) * burstSpeed - 2 : 0.8 + Math.random() * 2,
        opacity: layer === 0 ? 0.85 + Math.random() * 0.15 : layer === 1 ? 0.6 + Math.random() * 0.25 : 0.4 + Math.random() * 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.04,
        layer,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petalTimer.current++;
      // 持续大量生成花瓣（每2帧生成一批）
      if (petalTimer.current % 2 === 0) {
        const batchSize = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < batchSize; i++) {
          if (petals.current.length < 500) {
            addPetal(canvas.width, canvas.height);
          }
        }
      }

      const alive: Petal[] = [];
      for (const p of petals.current) {
        p.x += p.vx + Math.sin(p.wobble) * 1.2;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.wobble += p.wobbleSpeed;
        p.vy += 0.005;

        if (p.y > canvas.height + 30 || p.opacity <= 0) continue;
        drawPetal(ctx, p);
        alive.push(p);
      }
      petals.current = alive;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      aria-hidden="true"
    />
  );
}
