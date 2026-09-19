import React, { useEffect, useRef } from 'react';
import logoImg from '../assets/logo.png';

/**
 * LiquidWaterSky
 * Features:
 * 1. Gorgeous Starry Celestial Sky: Twinkling diamond stars, starburst flares (✦), periodic shooting star meteors, and soft ethereal aurora mists.
 * 2. Neat, Beautifully Shaped Light Ash Clouds: Streamlined, elegant aerodynamic cloud contours that float and pass away seamlessly.
 * 3. Lively Liquid Water Waves: GPU-accelerated organic liquid wave swells with glowing caustics and radiant crests.
 * 4. Sailing Flagship: A luxury ship sailing gracefully across the water, riding the wave swells and tilting with the wave slope, proudly flying the Black FX company logo on its main sail & flag.
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

    // Preload Black FX Logo for the Ship's Flag
    const flagImage = new Image();
    flagImage.src = logoImg;
    let logoLoaded = false;
    flagImage.onload = () => {
      logoLoaded = true;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
      initNeatClouds();
    };

    window.addEventListener('resize', handleResize);

    // ================= 1. GORGEOUS CELESTIAL STARRY SKY =================
    interface Star {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      twinkleSpeed: number;
      phase: number;
      color: string;
      isFlare: boolean;
    }

    let stars: Star[] = [];
    const starColors = ['#ffffff', '#bae6fd', '#38bdf8', '#7dd3fc', '#e0f2fe'];

    const initStars = () => {
      stars = [];
      const starCount = Math.floor(width / 16); // Rich, dense, gorgeous starfield
      for (let i = 0; i < starCount; i++) {
        const isFlare = Math.random() < 0.12; // 12% are sparkling diamond flares
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.62), // Sky region
          radius: isFlare ? Math.random() * 1.8 + 1.2 : Math.random() * 1.2 + 0.5,
          alpha: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.035 + 0.012,
          phase: Math.random() * Math.PI * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          isFlare,
        });
      }
    };
    initStars();

    // Shooting Star (Meteor Trail)
    interface Meteor {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
      active: boolean;
      timer: number;
    }

    const meteor: Meteor = {
      x: -100,
      y: -100,
      length: 120,
      speed: 18,
      angle: (Math.PI / 180) * 32, // 32 degrees downward swoop
      alpha: 0,
      active: false,
      timer: 100,
    };

    // ================= 2. NEAT, BEAUTIFULLY SHAPED LIGHT ASH CLOUDS =================
    // Clean, streamlined, elegant cumulus-cirrus shapes that float and pass away
    interface NeatCloud {
      x: number;
      y: number;
      width: number;
      height: number;
      speedX: number;
      alpha: number;
    }

    let neatClouds: NeatCloud[] = [];
    const initNeatClouds = () => {
      neatClouds = [
        { x: width * 0.05, y: height * 0.08, width: 380, height: 75, speedX: 0.18, alpha: 0.22 },
        { x: width * 0.45, y: height * 0.16, width: 480, height: 95, speedX: 0.14, alpha: 0.26 },
        { x: width * 0.78, y: height * 0.06, width: 340, height: 65, speedX: 0.22, alpha: 0.19 },
        { x: -280, y: height * 0.25, width: 440, height: 85, speedX: 0.16, alpha: 0.24 },
        { x: width * 0.22, y: height * 0.34, width: 390, height: 70, speedX: 0.12, alpha: 0.18 },
      ];
    };
    initNeatClouds();

    // Helper to draw a neat, aerodynamic cloud with smooth rounded lobes
    const drawNeatCloud = (
      x: number,
      y: number,
      w: number,
      h: number,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(x, y);

      const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
      // Clean, elegant light ash / silver-slate tones
      grad.addColorStop(0, `rgba(226, 232, 240, ${alpha * 1.3})`); // light ash top
      grad.addColorStop(0.5, `rgba(148, 163, 184, ${alpha * 0.95})`); // soft ash slate
      grad.addColorStop(1, `rgba(15, 23, 42, 0)`); // fades seamlessly into dark background

      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(148, 163, 184, 0.25)';
      ctx.shadowBlur = 24;

      ctx.beginPath();
      // Sleek, neat, aerodynamic cumulus contour
      ctx.moveTo(-w * 0.45, h * 0.25);
      // Bottom flat edge
      ctx.lineTo(w * 0.45, h * 0.25);
      // Right curved lobe
      ctx.bezierCurveTo(w * 0.52, h * 0.25, w * 0.52, -h * 0.1, w * 0.38, -h * 0.15);
      // Middle upper puff
      ctx.bezierCurveTo(w * 0.3, -h * 0.55, w * 0.05, -h * 0.6, -w * 0.05, -h * 0.3);
      // Left high puff
      ctx.bezierCurveTo(-w * 0.18, -h * 0.45, -w * 0.38, -h * 0.35, -w * 0.42, -h * 0.05);
      // Left curved lobe
      ctx.bezierCurveTo(-w * 0.55, -h * 0.02, -w * 0.55, h * 0.25, -w * 0.45, h * 0.25);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // ================= 3. SAILING FLAGSHIP (WITH BLACK FX LOGO FLAG) =================
    let shipX = width * 0.18; // Current horizontal position
    const shipBaseSpeed = 0.38; // Elegant sailing velocity

    // Wave height calculator at any point X
    const getWaveY = (xPos: number, timeStep: number, baseY: number) => {
      return (
        baseY +
        Math.sin(xPos * 0.0055 - timeStep * 1.1) * 22 +
        Math.cos(xPos * 0.0038 + timeStep * 0.7) * 16 +
        Math.sin(xPos * 0.008 + timeStep * 1.3) * 6
      );
    };

    // ================= 4. MAIN ANIMATION LOOP =================
    let step = 0;

    const render = () => {
      step += 0.02;
      ctx.clearRect(0, 0, width, height);

      // ---------------- A. RENDER GORGEOUS CELESTIAL STARRY SKY ----------------
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const currentAlpha =
          0.3 + 0.7 * (0.5 + 0.5 * Math.sin(step * s.twinkleSpeed * 60 + s.phase));

        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = s.color;

        if (s.isFlare) {
          // Draw 4-point diamond starburst flare
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.shadowBlur = 8;
          ctx.shadowColor = s.color;
          ctx.fill();

          // Horizontal & Vertical sparkle spikes
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(s.x - s.radius * 2.8, s.y);
          ctx.lineTo(s.x + s.radius * 2.8, s.y);
          ctx.moveTo(s.x, s.y - s.radius * 2.8);
          ctx.lineTo(s.x, s.y + s.radius * 2.8);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      // Shooting Star / Meteor Handler
      meteor.timer -= 1;
      if (meteor.timer <= 0 && !meteor.active) {
        meteor.active = true;
        meteor.x = Math.random() * (width * 0.7);
        meteor.y = Math.random() * (height * 0.25) + 20;
        meteor.alpha = 1.0;
        meteor.timer = Math.floor(Math.random() * 320) + 240; // Every 5-9 seconds
      }

      if (meteor.active) {
        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

        const meteorGrad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        meteorGrad.addColorStop(0, `rgba(255, 255, 255, ${meteor.alpha})`);
        meteorGrad.addColorStop(0.25, `rgba(56, 189, 248, ${meteor.alpha * 0.8})`);
        meteorGrad.addColorStop(1, 'rgba(6, 8, 19, 0)');

        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        meteor.alpha -= 0.016;

        if (meteor.alpha <= 0 || meteor.x > width + 100 || meteor.y > height) {
          meteor.active = false;
        }
      }

      // ---------------- B. RENDER NEAT, ELEGANT LIGHT ASH CLOUDS ----------------
      for (let i = 0; i < neatClouds.length; i++) {
        const c = neatClouds[i];
        c.x += c.speedX;

        // When cloud floats and passes away past the right edge, wrap smoothly to the left
        if (c.x - c.width * 0.6 > width) {
          c.x = -c.width * 0.65;
          c.y = Math.random() * (height * 0.38) + 30;
          c.speedX = Math.random() * 0.12 + 0.14;
        }

        drawNeatCloud(c.x, c.y, c.width, c.height, c.alpha);
      }

      // ---------------- C. RENDER LIVELY LIQUID WATER WAVES ----------------
      const waterBaseY = height * 0.62;

      // WAVE LAYER 1: Deep rolling swell
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 6) {
        const y =
          waterBaseY +
          Math.sin(x * 0.0035 + step * 0.8) * 30 +
          Math.cos(x * 0.007 - step * 0.5) * 16 +
          Math.sin(x * 0.0015 + step * 0.3) * 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const deepGradient = ctx.createLinearGradient(0, waterBaseY - 20, 0, height);
      deepGradient.addColorStop(0, 'rgba(2, 132, 199, 0.22)');
      deepGradient.addColorStop(0.35, 'rgba(30, 58, 138, 0.28)');
      deepGradient.addColorStop(1, 'rgba(6, 8, 19, 0.85)');
      ctx.fillStyle = deepGradient;
      ctx.fill();

      // WAVE LAYER 2: Lively mid-level surge (Where the ship sails!)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 5) {
        const y = getWaveY(x, step, waterBaseY);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const midGradient = ctx.createLinearGradient(0, waterBaseY, 0, height);
      midGradient.addColorStop(0, 'rgba(14, 165, 233, 0.32)');
      midGradient.addColorStop(0.4, 'rgba(2, 132, 199, 0.2)');
      midGradient.addColorStop(1, 'rgba(6, 8, 19, 0.9)');
      ctx.fillStyle = midGradient;
      ctx.fill();

      // ---------------- D. RENDER THE SAILING FLAGSHIP WITH COMPANY LOGO FLAG ----------------
      shipX += shipBaseSpeed;
      if (shipX > width + 140) {
        shipX = -150; // Wrap back to the left horizon
      }

      // Calculate ship's height on the water and pitch angle to match the wave slope
      const curWaveY = getWaveY(shipX, step, waterBaseY);
      const nextWaveY = getWaveY(shipX + 8, step, waterBaseY);
      const waveSlopeAngle = Math.atan2(nextWaveY - curWaveY, 8); // Pitch with wave

      ctx.save();
      ctx.translate(shipX, curWaveY - 4); // Sit right in the water crest
      ctx.rotate(waveSlopeAngle * 0.85); // Realistic buoyant wave rocking

      // Scale ship proportionally for visual grandeur
      const sScale = width < 640 ? 0.75 : 1.0;
      ctx.scale(sScale, sScale);

      // 1. Water Wake & Bow Spray under the ship
      ctx.beginPath();
      ctx.moveTo(-45, 12);
      ctx.quadraticCurveTo(-15, 6, 40, 10);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#38bdf8';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 2. Ship Hull (Sleek Obsidian/Sapphire Luxury Yacht)
      ctx.beginPath();
      ctx.moveTo(-42, 0); // Stern
      ctx.lineTo(38, 0); // Deck towards bow
      ctx.lineTo(48, 4); // Bow tip cutting the water
      ctx.quadraticCurveTo(35, 14, 20, 15); // Hull curvature
      ctx.lineTo(-30, 14); // Hull keel
      ctx.quadraticCurveTo(-45, 10, -42, 0); // Transom
      ctx.closePath();

      const hullGrad = ctx.createLinearGradient(-40, 0, 40, 15);
      hullGrad.addColorStop(0, '#0c1224');
      hullGrad.addColorStop(0.5, '#1e293b');
      hullGrad.addColorStop(1, '#080c1d');
      ctx.fillStyle = hullGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Neon Cyan Waterline Trim on Hull
      ctx.beginPath();
      ctx.moveTo(-36, 6);
      ctx.lineTo(42, 6);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Cabin / Bridge structure
      ctx.beginPath();
      ctx.rect(-16, -9, 24, 9);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Glowing Cabin Windows
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.fillRect(-12, -6, 5, 3.5);
      ctx.fillRect(-4, -6, 5, 3.5);
      ctx.fillRect(4, -6, 5, 3.5);
      ctx.shadowBlur = 0;

      // 3. Main Mast
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -68);
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.9)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Forward Mast
      ctx.beginPath();
      ctx.moveTo(22, 0);
      ctx.lineTo(22, -48);
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.75)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Rigging Stays (Fine silver cables)
      ctx.beginPath();
      ctx.moveTo(0, -66);
      ctx.lineTo(-38, 0);
      ctx.moveTo(0, -66);
      ctx.lineTo(22, -48);
      ctx.moveTo(22, -48);
      ctx.lineTo(46, 2);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // 4. Glowing Main Sail
      ctx.beginPath();
      ctx.moveTo(0, -65);
      ctx.quadraticCurveTo(24, -38, 2, -12); // Billowing sail curve
      ctx.lineTo(0, -12);
      ctx.closePath();

      const sailGrad = ctx.createLinearGradient(0, -65, 24, -12);
      sailGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      sailGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.65)');
      sailGrad.addColorStop(1, 'rgba(56, 189, 248, 0.3)');
      ctx.fillStyle = sailGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 5. Jib Sail (Forward Sail)
      ctx.beginPath();
      ctx.moveTo(22, -46);
      ctx.quadraticCurveTo(38, -25, 24, -8);
      ctx.lineTo(22, -8);
      ctx.closePath();
      ctx.fillStyle = 'rgba(186, 230, 253, 0.55)';
      ctx.fill();

      // 6. MAIN FLAG AT MASTHEAD WITH BLACK FX COMPANY LOGO
      const flagWaveOffset = Math.sin(step * 3) * 3;
      const flagW = 26;
      const flagH = 16;
      const flagX = -flagW;
      const flagY = -78;

      // Flag fabric fluttering in the ocean breeze
      ctx.beginPath();
      ctx.moveTo(0, -68);
      ctx.lineTo(0, -84);
      ctx.quadraticCurveTo(-flagW * 0.5, -84 + flagWaveOffset, -flagW, -84);
      ctx.lineTo(-flagW + 4, -68 + flagWaveOffset);
      ctx.quadraticCurveTo(-flagW * 0.5, -68, 0, -68);
      ctx.closePath();

      const flagGrad = ctx.createLinearGradient(0, -84, -flagW, -68);
      flagGrad.addColorStop(0, '#0f172a');
      flagGrad.addColorStop(0.5, '#0369a1');
      flagGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = flagGrad;
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Render Black FX Company Logo inside Flag
      if (logoLoaded && flagImage.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(flagX + 3, flagY - 3, flagW - 6, flagH - 2);
        ctx.clip();
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.drawImage(flagImage, flagX + 4, flagY - 3, flagW - 8, flagH - 2);
        ctx.restore();
      } else {
        // Crisp golden emblem fallback if image is still parsing
        ctx.beginPath();
        ctx.arc(-13, -75, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
      }

      ctx.restore();

      // WAVE LAYER 3: Surface Liquid Foam & Radiant Crest Line
      ctx.beginPath();
      const crestPoints: { x: number; y: number }[] = [];
      for (let x = 0; x <= width; x += 4) {
        const y =
          waterBaseY +
          24 +
          Math.sin(x * 0.007 + step * 1.4) * 20 +
          Math.sin(x * 0.012 - step * 1.8) * 8 +
          Math.cos(x * 0.004 + step * 0.9) * 12;
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
      ctx.lineWidth = 2.4;
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#38bdf8';
      ctx.stroke();
      ctx.shadowBlur = 0;

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
      {/* Dynamic Canvas: Starry Sky, Shooting Stars, Neat Ash Clouds, Sailing Flagship, and Liquid Water */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Aurora Borealis Shimmer Veil across Upper Sky */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl animate-sky-shimmer" />

      {/* Deep Ocean Bottom Fade to blend with footer */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#060813] via-[#060813]/60 to-transparent" />
    </div>
  );
};
