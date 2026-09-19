import React, { useEffect, useRef } from 'react';

/**
 * LiquidWaterSky
 * High-performance, GPU-accelerated canvas simulation featuring:
 * 1. Lively, organic liquid water waves that undulate and surge like real water.
 * 2. Glowing specular crests and bioluminescent caustics.
 * 3. A floating celestial sky with drifting nebula clouds, aurora veil, and twinkling stars.
 * Seamlessly adapts to the #060813 obsidian background.
 */
export const LiquidWaterSky: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
      initAshClouds();
    };

    window.addEventListener('resize', handleResize);

    // ================= CELESTIAL STARS (FLOATING SKY) =================
    interface Star {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      twinkleSpeed: number;
      phase: number;
      color: string;
    }

    let stars: Star[] = [];
    const starColors = ['#38bdf8', '#7dd3fc', '#ffffff', '#bae6fd', '#34d399'];

    const initStars = () => {
      stars = [];
      const starCount = Math.floor(width / 22);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.65), // Upper sky region
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.7 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          phase: Math.random() * Math.PI * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };
    initStars();

    // ================= LIGHT ASH CLOUDS THAT FLOAT AND PASS AWAY =================
    interface AshPuff {
      offsetX: number;
      offsetY: number;
      radius: number;
    }

    interface AshCloud {
      x: number;
      y: number;
      speedX: number;
      scale: number;
      alpha: number;
      puffs: AshPuff[];
    }

    let ashClouds: AshCloud[] = [];
    const initAshClouds = () => {
      ashClouds = [];
      const cloudCount = 5;
      for (let i = 0; i < cloudCount; i++) {
        const puffs: AshPuff[] = [];
        const puffCount = Math.floor(Math.random() * 5) + 8; // 8 to 12 overlapping cloud puffs
        const baseRadius = Math.random() * 35 + 60;
        for (let p = 0; p < puffCount; p++) {
          puffs.push({
            offsetX: (Math.random() - 0.5) * baseRadius * 3.2,
            offsetY: (Math.random() - 0.5) * baseRadius * 0.85,
            radius: Math.random() * baseRadius * 0.6 + baseRadius * 0.65,
          });
        }
        ashClouds.push({
          x: (i * (width / cloudCount)) + Math.random() * 80 - 120,
          y: Math.random() * (height * 0.42) + 40, // Floating gracefully across upper and mid sky
          speedX: Math.random() * 0.22 + 0.16, // Continuous gentle floating velocity
          scale: Math.random() * 0.45 + 0.85,
          alpha: Math.random() * 0.06 + 0.18, // Light ash transparency
          puffs,
        });
      }
    };
    initAshClouds();

    // ================= BIOLUMINESCENT WATER BUBBLES / CAUSTIC PARTICLES =================
    interface Droplet {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      driftSpeed: number;
      phase: number;
      alpha: number;
      maxAlpha: number;
    }

    const droplets: Droplet[] = [];
    for (let i = 0; i < 35; i++) {
      droplets.push({
        x: Math.random() * width,
        y: height * 0.5 + Math.random() * (height * 0.5),
        radius: Math.random() * 2 + 1,
        speedY: Math.random() * 0.6 + 0.3,
        driftSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.6 + 0.2,
        maxAlpha: Math.random() * 0.6 + 0.3,
      });
    }

    // ================= LIQUID WATER WAVE SIMULATION =================
    let step = 0;

    const render = () => {
      step += 0.022;
      ctx.clearRect(0, 0, width, height);

      // 1. RENDER FLOATING CELESTIAL SKY (Upper 65%)
      // Draw Twinkling Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const currentAlpha = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(step * s.twinkleSpeed * 60 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = s.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = s.color;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      // 1.5 RENDER LIGHT ASH CLOUDS THAT FLOAT AND PASS AWAY ACROSS THE SKY
      for (let i = 0; i < ashClouds.length; i++) {
        const c = ashClouds[i];
        c.x += c.speedX;

        // When cloud passes away off the right edge, wrap smoothly to the far left
        if (c.x - 300 > width) {
          c.x = -350;
          c.y = Math.random() * (height * 0.42) + 40;
          c.speedX = Math.random() * 0.22 + 0.16;
          c.alpha = Math.random() * 0.06 + 0.18;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.scale(c.scale, c.scale);

        for (let p = 0; p < c.puffs.length; p++) {
          const puff = c.puffs[p];
          const px = puff.offsetX;
          const py = puff.offsetY;
          const pr = puff.radius;

          const cloudGrad = ctx.createRadialGradient(px, py, 0, px, py, pr);
          // Light Ash & Silver Slate Tones that apt the #060813 background
          cloudGrad.addColorStop(0, `rgba(203, 213, 225, ${c.alpha * 1.35})`); // soft light ash core
          cloudGrad.addColorStop(0.35, `rgba(148, 163, 184, ${c.alpha * 0.9})`); // soft ash slate
          cloudGrad.addColorStop(0.7, `rgba(100, 116, 139, ${c.alpha * 0.35})`); // misty translucent rim
          cloudGrad.addColorStop(1, 'rgba(6, 8, 19, 0)'); // seamlessly blends into obsidian

          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fillStyle = cloudGrad;
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. RENDER LIVELY LIQUID WATER WAVES (Bottom half of viewport)
      const waterBaseY = height * 0.62; // Starts slightly below middle, rolls to bottom

      // WAVE LAYER 1: Deep rolling oceanic swell (Dark Sapphire / Deep Cyan)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 6) {
        const y =
          waterBaseY +
          Math.sin(x * 0.0035 + step * 0.8) * 32 +
          Math.cos(x * 0.007 - step * 0.5) * 18 +
          Math.sin(x * 0.0015 + step * 0.3) * 12;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const deepGradient = ctx.createLinearGradient(0, waterBaseY - 30, 0, height);
      deepGradient.addColorStop(0, 'rgba(2, 132, 199, 0.22)');
      deepGradient.addColorStop(0.35, 'rgba(30, 58, 138, 0.28)');
      deepGradient.addColorStop(1, 'rgba(6, 8, 19, 0.85)');
      ctx.fillStyle = deepGradient;
      ctx.fill();

      // WAVE LAYER 2: Lively mid-level surge (Vibrant Cyan & Electric Blue)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 5) {
        const y =
          waterBaseY +
          15 +
          Math.sin(x * 0.0055 - step * 1.1) * 26 +
          Math.cos(x * 0.0038 + step * 0.7) * 20 +
          Math.sin(x * 0.008 + step * 1.3) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const midGradient = ctx.createLinearGradient(0, waterBaseY, 0, height);
      midGradient.addColorStop(0, 'rgba(14, 165, 233, 0.28)');
      midGradient.addColorStop(0.4, 'rgba(2, 132, 199, 0.18)');
      midGradient.addColorStop(1, 'rgba(6, 8, 19, 0.9)');
      ctx.fillStyle = midGradient;
      ctx.fill();

      // WAVE LAYER 3: Surface Liquid Crest with Radiant Specular Gleam
      ctx.beginPath();
      const crestPoints: { x: number; y: number }[] = [];
      for (let x = 0; x <= width; x += 4) {
        const y =
          waterBaseY +
          30 +
          Math.sin(x * 0.007 + step * 1.4) * 22 +
          Math.sin(x * 0.012 - step * 1.8) * 10 +
          Math.cos(x * 0.004 + step * 0.9) * 14;
        crestPoints.push({ x, y });
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const surfaceGradient = ctx.createLinearGradient(0, waterBaseY + 10, 0, height);
      surfaceGradient.addColorStop(0, 'rgba(56, 189, 248, 0.32)');
      surfaceGradient.addColorStop(0.3, 'rgba(14, 165, 233, 0.15)');
      surfaceGradient.addColorStop(1, 'rgba(6, 8, 19, 0.95)');
      ctx.fillStyle = surfaceGradient;
      ctx.fill();

      // Specular Glowing Liquid Crest Line
      ctx.beginPath();
      for (let i = 0; i < crestPoints.length; i++) {
        const pt = crestPoints[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#38bdf8';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. RENDER BIOLUMINESCENT LIQUID PARTICLES / BUBBLES
      for (let i = 0; i < droplets.length; i++) {
        const d = droplets[i];
        d.y -= d.speedY;
        d.x += Math.sin(step + d.phase) * 0.6;

        // Reset if it rises too high
        if (d.y < waterBaseY - 40) {
          d.y = height + 10;
          d.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.globalAlpha = d.alpha * (0.6 + 0.4 * Math.sin(step * 2 + d.phase));
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#38bdf8';
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Dynamic HTML5 Canvas for Lively Organic Liquid Wave Physics & Celestial Stars */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Floating Sky Nebula Clouds (CSS Ethereal Drift) */}
      <div className="absolute -top-32 left-1/4 w-[750px] h-[480px] rounded-full bg-gradient-to-b from-blue-600/15 via-cyan-400/10 to-transparent blur-[140px] animate-sky-slow" />
      <div className="absolute top-12 right-12 w-[650px] h-[420px] rounded-full bg-gradient-to-bl from-cyan-500/12 via-indigo-600/8 to-transparent blur-[130px] animate-sky-reverse" />
      <div className="absolute -top-16 left-[-60px] w-[550px] h-[380px] rounded-full bg-blue-500/10 blur-[120px] animate-sky-slow" />

      {/* Aurora Borealis Shimmer Veil across Upper Sky */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl animate-sky-shimmer" />

      {/* ================= LIGHT ASH CLOUDS (FLOAT AND PASS AWAY) ================= */}
      {/* Upper Altitude Light Ash Cloud Passing Away */}
      <div className="absolute top-10 left-[-20%] w-[680px] h-[220px] rounded-full bg-gradient-to-r from-slate-400/16 via-slate-300/22 to-transparent blur-[60px] animate-ash-cloud-1" />
      
      {/* Mid Altitude Light Ash Cloud Drifting Across */}
      <div className="absolute top-36 left-[-30%] w-[780px] h-[260px] rounded-full bg-gradient-to-r from-transparent via-slate-400/18 to-slate-500/14 blur-[75px] animate-ash-cloud-2" />

      {/* Deep Ocean Bottom Fade to blend seamlessly with footer */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#060813] via-[#060813]/60 to-transparent" />
    </div>
  );
};
