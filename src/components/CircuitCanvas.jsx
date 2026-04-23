import { useEffect, useRef } from 'react';

/**
 * Animated circuit/grid background for dark hero sections.
 * Props:
 *  - opacity: 0..1 (default 0.45)
 *  - className: extra class
 *  - style: extra inline style
 */
export default function CircuitCanvas({ opacity = 0.45, className = '', style = {} }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    let W = 0;
    let H = 0;
    let nodes = [];
    let animReq = null;
    let t = 0;

    const buildNodes = () => {
      nodes = [];
      const cols = Math.floor(W / 90);
      const rows = Math.floor(H / 90);
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          if (Math.random() > 0.35) continue;
          nodes.push({
            x: c * 90 + (Math.random() - 0.5) * 20,
            y: r * 90 + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            radius: Math.random() * 2 + 1,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.006 + Math.random() * 0.006,
          });
        }
      }
    };

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      buildNodes();
    };

    const drawGrid = () => {
      const step = 90;
      ctx.strokeStyle = 'rgba(0,125,166,0.07)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x < W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = 0; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();
    };

    const drawTraces = () => {
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = Math.abs(a.x - b.x);
          const dy = Math.abs(a.y - b.y);
          if (dx + dy > 260) continue;
          const alpha = 0.09 * (1 - (dx + dy) / 260);
          ctx.strokeStyle = `rgba(0,167,225,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          const corner = (i + j) % 2 === 0
            ? { x: b.x, y: a.y }
            : { x: a.x, y: b.y };
          ctx.lineTo(corner.x, corner.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(corner.x, corner.y, 0.9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,167,225,${alpha * 2})`;
          ctx.fill();
        }
      }
    };

    const drawNodes = () => {
      nodes.forEach((n) => {
        const pulse = (Math.sin(t * n.pulseSpeed * 60 + n.pulsePhase) + 1) / 2;
        const alpha = 0.2 + pulse * 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,167,225,${alpha})`;
        ctx.fill();
        if (pulse > 0.7) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,167,225,${(pulse - 0.7) * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
      t++;
    };

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -50) n.x = W + 50;
        if (n.x > W + 50) n.x = -50;
        if (n.y < -50) n.y = H + 50;
        if (n.y > H + 50) n.y = -50;
      });
      drawTraces();
      drawNodes();
      animReq = requestAnimationFrame(frame);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      drawTraces();
      drawNodes();
    };

    const ro = new ResizeObserver(() => {
      if (animReq) cancelAnimationFrame(animReq);
      resize();
      if (prefersReducedMotion) drawStatic();
      else frame();
    });
    ro.observe(canvas);

    resize();
    if (prefersReducedMotion) drawStatic();
    else frame();

    return () => {
      if (animReq) cancelAnimationFrame(animReq);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`ns-circuit-canvas ${className}`.trim()}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}
