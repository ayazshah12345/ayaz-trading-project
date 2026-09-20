import React from 'react';

/**
 * RoyalAmbiance
 * Ultra-prestigious, royal institutional trading floor background.
 * - Same color palette: deep obsidian (#060813), royal sapphire (#1e3a8a, #0284c7), glowing cyan (#38bdf8), and emerald highlights (#34d399).
 * - Clean, sovereign, professional aesthetics without water, ship, or stars.
 * - Geometric institutional grid, royal radial ambient illumination halos, and regal light sweeps.
 */
export const RoyalAmbiance: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 bg-[#060813]">
      {/* 1. Deep Royal Gradient Atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 10%, rgba(14, 165, 233, 0.12) 0%, rgba(30, 58, 138, 0.08) 40%, rgba(6, 8, 19, 1) 90%), radial-gradient(circle at 85% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 60%), radial-gradient(circle at 15% 70%, rgba(14, 165, 233, 0.06) 0%, transparent 50%)',
        }}
      />

      {/* 2. Royal Institutional Perspective Matrix Grid (Subtle, Regal, Precision Engineered) */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, black 40%, transparent 85%)',
        }}
      />

      {/* 3. Royal Guilloche & Geometric Institutional Concentric Rings (Subtle High-Finance Motif) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[750px] pointer-events-none opacity-[0.12]">
        <svg viewBox="0 0 1100 750" className="w-full h-full" fill="none">
          <ellipse cx="550" cy="375" rx="520" ry="340" stroke="url(#royalGoldCyan)" strokeWidth="1" strokeDasharray="4 8" />
          <ellipse cx="550" cy="375" rx="420" ry="260" stroke="#38bdf8" strokeWidth="1" strokeDasharray="1 5" />
          <ellipse cx="550" cy="375" rx="320" ry="190" stroke="#2563eb" strokeWidth="1" />
          <ellipse cx="550" cy="375" rx="200" ry="120" stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="6 12" />
          
          {/* Subtle Crosshairs & Coordinates */}
          <line x1="550" y1="20" x2="550" y2="730" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="4 6" />
          <line x1="20" y1="375" x2="1080" y2="375" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="4 6" />
          
          <defs>
            <linearGradient id="royalGoldCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 4. Royal Sapphire & Cyan Ambient Spotlights (Executive Lighting Halos) */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-[550px] h-[450px] rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none" />

      {/* 5. Regal Top & Bottom Horizon Glow Bars */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#060813] via-[#060813]/80 to-transparent" />
    </div>
  );
};
