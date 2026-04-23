import { useEffect, useRef } from 'react';

// ─── SolidworksScrollCanvas ─────────────────────────────────────────────────
//
// Scroll-driven frame animation for SolidWorks image sequences.
//
// HOW TO ADD REAL FRAMES:
//   1. In SolidWorks: Animation → Save Animation → PNG sequence (e.g. frame_000.png…)
//   2. Place all frames in /public/sw-frames/ (or import them as modules)
//   3. Build the array:
//        const FRAMES = Array.from({ length: 120 }, (_, i) =>
//          `/sw-frames/frame_${String(i).padStart(3, '0')}.png`
//        );
//   4. Pass to component:
//        <SolidworksScrollCanvas frames={FRAMES} scrollHeight={4} />
//
// The `scrollHeight` prop controls how many viewport-heights tall the scroll
// section is (default 3 → 300vh). More frames → increase scrollHeight.
// ────────────────────────────────────────────────────────────────────────────

export default function SolidworksScrollCanvas({ frames = [], scrollHeight = 3 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const progressRef = useRef(0);

  // Pre-load frames when provided
  useEffect(() => {
    if (!frames.length) { imagesRef.current = []; return; }
    const imgs = frames.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    imagesRef.current = imgs;
  }, [frames]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const setSize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(progressRef.current);
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);
    setSize();

    const drawPlaceholder = (p) => {
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      const cx = W / 2;
      const cy = H / 2;

      // Background
      ctx.fillStyle = '#071e30';
      ctx.fillRect(0, 0, W, H);

      // Grid
      const g = 60;
      ctx.strokeStyle = 'rgba(0,167,225,0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += g) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += g) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Cross-hair
      ctx.strokeStyle = 'rgba(18,166,204,0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 8]);
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
      ctx.setLineDash([]);

      // Glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140);
      glow.addColorStop(0, 'rgba(0,125,166,0.18)');
      glow.addColorStop(1, 'rgba(0,125,166,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(cx, cy, 140, 0, Math.PI * 2); ctx.fill();

      // Scroll-driven rotation angle
      const angle = p * Math.PI * 3;

      // Outer ring
      ctx.strokeStyle = 'rgba(18,166,204,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 110, 0, Math.PI * 2); ctx.stroke();

      // Rotating tick marks
      for (let i = 0; i < 16; i++) {
        const theta = angle + (i / 16) * Math.PI * 2;
        const major = i % 4 === 0;
        ctx.strokeStyle = major ? 'rgba(18,166,204,0.85)' : 'rgba(18,166,204,0.25)';
        ctx.lineWidth = major ? 2.5 : 1;
        const r1 = major ? 103 : 107;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(theta) * r1, cy + Math.sin(theta) * r1);
        ctx.lineTo(cx + Math.cos(theta) * 118, cy + Math.sin(theta) * 118);
        ctx.stroke();
      }

      // Mid ring (counter-rotates)
      ctx.strokeStyle = 'rgba(18,166,204,0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, 75, 0, Math.PI * 2); ctx.stroke();

      // Hexagon
      ctx.strokeStyle = 'rgba(18,166,204,0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const theta = -angle * 0.5 + (i / 6) * Math.PI * 2;
        const x = cx + Math.cos(theta) * 52;
        const y = cy + Math.sin(theta) * 52;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.stroke();

      // Inner ring
      ctx.strokeStyle = 'rgba(18,166,204,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.stroke();

      // Center dot
      const dotGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10);
      dotGlow.addColorStop(0, 'rgba(18,166,204,1)');
      dotGlow.addColorStop(1, 'rgba(18,166,204,0)');
      ctx.fillStyle = dotGlow;
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#12A6CC';
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();

      // Horizontal scan line
      const scanY = H * p;
      const sg = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      sg.addColorStop(0, 'rgba(18,166,204,0)');
      sg.addColorStop(0.5, 'rgba(18,166,204,0.1)');
      sg.addColorStop(1, 'rgba(18,166,204,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, Math.max(0, scanY - 50), W, 100);

      // Corner brackets
      const bS = 22, bP = 28;
      ctx.strokeStyle = 'rgba(18,166,204,0.3)';
      ctx.lineWidth = 2;
      [[bP, bP, 1, 1], [W - bP, bP, -1, 1], [bP, H - bP, 1, -1], [W - bP, H - bP, -1, -1]]
        .forEach(([x, y, dx, dy]) => {
          ctx.beginPath();
          ctx.moveTo(x, y + dy * bS); ctx.lineTo(x, y); ctx.lineTo(x + dx * bS, y);
          ctx.stroke();
        });

      // Frame counter
      ctx.fillStyle = 'rgba(18,166,204,0.55)';
      ctx.font = `11px "JetBrains Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.fillText(`FRAME  ${String(Math.round(p * 100)).padStart(3, '0')} / 100`, bP, H - bP);

      // Label bottom-right
      ctx.fillStyle = 'rgba(234,246,251,0.18)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('SolidWorks · Animación 3D', W - bP, H - bP);

      // Center placeholder text
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(234,246,251,0.2)';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('Animación SolidWorks', cx, cy + 148);
      ctx.fillStyle = 'rgba(234,246,251,0.1)';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('Secuencia de imágenes pendiente', cx, cy + 168);
      ctx.textAlign = 'left';
    };

    const render = (p) => {
      const imgs = imagesRef.current;
      if (imgs.length > 0) {
        const idx = Math.min(Math.round(p * (imgs.length - 1)), imgs.length - 1);
        const img = imgs[idx];
        if (img?.complete && img.naturalWidth > 0) {
          const W = canvas.width / dpr;
          const H = canvas.height / dpr;
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, W, H);
          const scale = Math.min(W / img.naturalWidth, H / img.naturalHeight);
          const w = img.naturalWidth * scale;
          const h = img.naturalHeight * scale;
          ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
          return;
        }
      }
      drawPlaceholder(p);
    };

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      if (scrollable <= 0) { render(0); return; }
      const p = Math.min(1, Math.max(0, -rect.top / scrollable));
      progressRef.current = p;
      render(p);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', height: `${scrollHeight * 100}vh` }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
        {/* Scroll hint */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          opacity: 0.45,
          pointerEvents: 'none',
          animation: 'ns-hero-pulse 2.4s ease-in-out infinite',
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(18,166,204,0.8)' }}>
            Desplaza para animar
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="rgba(18,166,204,0.8)" strokeWidth="1.5">
            <rect x="1" y="1" width="14" height="22" rx="7" />
            <line x1="8" y1="6" x2="8" y2="10" />
          </svg>
        </div>
      </div>
    </div>
  );
}
