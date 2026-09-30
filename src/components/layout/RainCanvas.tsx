import React, { useEffect, useRef } from 'react';
import { useResQStore, CHENNAI_AREAS } from '../../store/useResQStore';

interface RainDrop {
  x: number;
  y: number;
  len: number;
  speed: number;
  color: string;
  baseAlpha: number;
  width: number;
}

interface BottomSplash {
  x: number;
  y: number;
  rx: number;
  maxRx: number;
  alpha: number;
  expansionRate: number;
}

interface DropletParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  radius: number;
  alpha: number;
  color: string;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  ringCount?: number;
}

interface MistParticle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
}

export const RainCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { trackedAreaId, activeTab, rainEffectEnabled } = useResQStore();

  // Find risk level of tracked area (SAFE = light drizzle, PRONE = steady rain, DANGER = heavy rain)
  const currentArea = CHENNAI_AREAS.find((a) => a.id === trackedAreaId);
  const riskLevel = currentArea ? currentArea.risk : 'SAFE';
  const isRoutePage = activeTab === 'route';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isTabVisible = !document.hidden;

    // Check reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Canvas sizing with devicePixelRatio
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Target parameters based on risk level and route page
    // SAFE: light drizzle (~60-90 drops, slower speed, straight down)
    // PRONE: steady rain (~130-160 drops, medium speed, slight slant)
    // DANGER: heavy rain (~200-240 drops, fast speed, wind angle ~15-20deg)
    let targetDropCount = width < 768 ? 70 : 160;
    let targetSpeedMult = 1.0;
    let targetWindAngle = 0.05;
    let targetOpacity = 0.35;

    if (riskLevel === 'SAFE') {
      targetDropCount = width < 768 ? 55 : 110;
      targetSpeedMult = 0.75;
      targetWindAngle = 0.02;
      targetOpacity = 0.30;
    } else if (riskLevel === 'PRONE') {
      targetDropCount = width < 768 ? 75 : 160;
      targetSpeedMult = 1.05;
      targetWindAngle = 0.07;
      targetOpacity = 0.40;
    } else if (riskLevel === 'DANGER') {
      targetDropCount = width < 768 ? 100 : 220;
      targetSpeedMult = 1.45;
      targetWindAngle = 0.16;
      targetOpacity = 0.48;
    }

    // On /route, fade rain to 40% so map stays clear and readable
    if (isRoutePage) {
      targetOpacity *= 0.4;
      targetDropCount = Math.round(targetDropCount * 0.7);
    }

    // Current smooth lerp states
    let curSpeedMult = targetSpeedMult;
    let curWindAngle = targetWindAngle;
    let curOpacity = targetOpacity;

    // Palette: soft blue (#3B82F6 to #60A5FA)
    const rainColors = ['#3B82F6', '#60A5FA', '#93C5FD'];

    const createDrop = (): RainDrop => ({
      x: Math.random() * (width + 200) - 100,
      y: Math.random() * -height,
      len: Math.random() * 16 + 12,
      speed: (Math.random() * 7 + 10) * curSpeedMult,
      color: rainColors[Math.floor(Math.random() * rainColors.length)],
      baseAlpha: Math.random() * 0.25 + 0.25,
      width: Math.random() * 0.6 + 1.0,
    });

    const drops: RainDrop[] = [];
    for (let i = 0; i < targetDropCount; i++) {
      const d = createDrop();
      d.y = Math.random() * height; // Spread across screen initially
      drops.push(d);
    }

    // Mist particles for depth
    const mistParticles: MistParticle[] = [];
    const mistCount = width < 768 ? 8 : 16;
    for (let i = 0; i < mistCount; i++) {
      mistParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 40 + 25,
        vx: (Math.random() - 0.5) * 0.35 + 0.1,
        vy: Math.random() * 0.2 + 0.05,
        alpha: Math.random() * 0.04 + 0.03,
      });
    }

    // Splashes, jumping droplets, mouse ripple trail, click ripples
    const splashes: BottomSplash[] = [];
    const droplets: DropletParticle[] = [];
    const mouseRipples: WaterRipple[] = [];
    const clickRipples: WaterRipple[] = [];

    // Mouse / Touch tracking
    let mouseX = -9999;
    let mouseY = -9999;
    let lastMouseRippleTime = 0;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const now = performance.now();
      if (now - lastMouseRippleTime > 55) {
        lastMouseRippleTime = now;
        if (mouseRipples.length < 18) {
          mouseRipples.push({
            x: mouseX,
            y: mouseY,
            radius: 3,
            maxRadius: 26,
            alpha: 0.32,
            speed: 0.75,
          });
        }
      }
    };

    const handlePointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    // Click / Touch creates a larger water ripple + jumping droplets
    const handlePointerDown = (e: PointerEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;

      // Concentric primary & secondary ripples
      clickRipples.push({
        x: cx,
        y: cy,
        radius: 4,
        maxRadius: 75,
        alpha: 0.65,
        speed: 2.4,
      });
      clickRipples.push({
        x: cx,
        y: cy,
        radius: 2,
        maxRadius: 45,
        alpha: 0.45,
        speed: 1.6,
      });

      // 6 to 9 leaping droplets
      const dropCount = Math.floor(Math.random() * 4) + 6;
      for (let i = 0; i < dropCount; i++) {
        droplets.push({
          x: cx + (Math.random() - 0.5) * 10,
          y: cy + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 5.5,
          vy: -(Math.random() * 4.5 + 3.2),
          gravity: 0.22,
          radius: Math.random() * 1.4 + 1.2,
          alpha: 0.8,
          color: rainColors[Math.floor(Math.random() * rainColors.length)],
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Handle tab visibility to pause animation and save CPU
    const handleVisibility = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Frame capping at 60fps
    let lastFrameTime = performance.now();
    const frameInterval = 1000 / 60;

    const render = (time: number) => {
      animId = requestAnimationFrame(render);

      if (!isTabVisible || !rainEffectEnabled) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      const delta = time - lastFrameTime;
      if (delta < frameInterval - 1) return;
      lastFrameTime = time;

      ctx.clearRect(0, 0, width, height);

      // If user prefers reduced motion, draw very light static mist and exit
      if (prefersReducedMotion) {
        ctx.fillStyle = 'rgba(96, 165, 250, 0.05)';
        ctx.fillRect(0, 0, width, height);
        return;
      }

      // Smooth lerp toward target settings
      curSpeedMult += (targetSpeedMult - curSpeedMult) * 0.04;
      curWindAngle += (targetWindAngle - curWindAngle) * 0.04;
      curOpacity += (targetOpacity - curOpacity) * 0.04;

      // Ensure drop array matches target count smoothly
      if (drops.length < targetDropCount) {
        drops.push(createDrop());
      } else if (drops.length > targetDropCount) {
        drops.pop();
      }

      const windDx = Math.tan(curWindAngle) * 18;

      // 1. Render soft background mist particles
      mistParticles.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        if (m.x > width + m.radius) m.x = -m.radius;
        if (m.y > height + m.radius) m.y = -m.radius;

        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius);
        grad.addColorStop(0, `rgba(147, 197, 253, ${m.alpha * (curOpacity / 0.4)})`);
        grad.addColorStop(1, 'rgba(147, 197, 253, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Render and update rain streaks
      ctx.lineCap = 'round';
      drops.forEach((d) => {
        // Mouse avoidance: gently bend away near cursor (radius 85px)
        const dx = d.x - mouseX;
        const dy = d.y - mouseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < 7225) {
          // 85^2
          const dist = Math.sqrt(distSq);
          if (dist > 0.1) {
            const push = (1 - dist / 85) * 3.2;
            d.x += (dx / dist) * push;
            d.y += (dy / dist) * (push * 0.4);
          }
        }

        // Draw streak
        ctx.strokeStyle = d.color;
        ctx.globalAlpha = d.baseAlpha * curOpacity;
        ctx.lineWidth = d.width;

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + windDx, d.y + d.len);
        ctx.stroke();

        // Advance position
        d.x += windDx * 0.6;
        d.y += d.speed;

        // Bottom hit -> trigger splash
        if (d.y >= height) {
          if (splashes.length < 35 && Math.random() < 0.65) {
            splashes.push({
              x: d.x,
              y: height - 3,
              rx: 2,
              maxRx: Math.random() * 8 + 8,
              alpha: Math.random() * 0.25 + 0.25,
              expansionRate: Math.random() * 0.5 + 0.6,
            });
          }
          // Reset drop to top
          d.y = -d.len - Math.random() * 40;
          d.x = Math.random() * (width + 200) - 100;
          d.speed = (Math.random() * 7 + 10) * curSpeedMult;
        }

        // Wrap horizontal bounds
        if (d.x > width + 100) d.x = -80;
        else if (d.x < -100) d.x = width + 80;
      });

      ctx.globalAlpha = 1;

      // 3. Render bottom splashes (expanding water rings)
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.rx += s.expansionRate;
        s.alpha -= 0.022;

        if (s.alpha <= 0 || s.rx >= s.maxRx) {
          splashes.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.rx, s.rx * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(96, 165, 250, ${s.alpha * curOpacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 4. Render mouse ripple trail
      for (let i = mouseRipples.length - 1; i >= 0; i--) {
        const r = mouseRipples[i];
        r.radius += r.speed;
        r.alpha -= 0.016;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          mouseRipples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59, 130, 246, ${r.alpha * 0.75})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 5. Render click / touch ripples (concentric rings)
      for (let i = clickRipples.length - 1; i >= 0; i--) {
        const cr = clickRipples[i];
        cr.radius += cr.speed;
        cr.alpha -= 0.018;

        if (cr.alpha <= 0 || cr.radius >= cr.maxRadius) {
          clickRipples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(cr.x, cr.y, cr.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(37, 99, 235, ${cr.alpha})`;
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Inner soft echo ring
        if (cr.radius > 12) {
          ctx.beginPath();
          ctx.arc(cr.x, cr.y, cr.radius * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(14, 165, 233, ${cr.alpha * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // 6. Render leaping water droplets from click/touch
      for (let i = droplets.length - 1; i >= 0; i--) {
        const p = droplets[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= 0.018;

        if (p.alpha <= 0 || p.y >= height) {
          droplets.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [riskLevel, isRoutePage, rainEffectEnabled]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20"
      style={{
        opacity: rainEffectEnabled ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    />
  );
};
