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
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 bg-[#f8fafc]">
      {/* 1. Light Institutional Gradient Atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(30, 58, 138, 0.06) 0%, rgba(23, 37, 84, 0.04) 40%, rgba(248, 250, 252, 1) 90%), radial-gradient(circle at 85% 45%, rgba(30, 58, 138, 0.04) 0%, transparent 60%), radial-gradient(circle at 15% 65%, rgba(23, 37, 84, 0.03) 0%, transparent 50%)',
        }}
      />

      {/* 2. Precision Institutional Matrix Grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(30, 58, 138, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 58, 138, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 45%, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 45%, black 40%, transparent 85%)',
        }}
      />

      {/* 3. Geometric Institutional Concentric Rings (Subtle High-Finance Motif) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[750px] pointer-events-none opacity-[0.20]">
        <svg viewBox="0 0 1100 750" className="w-full h-full" fill="none">
          <ellipse cx="550" cy="375" rx="520" ry="340" stroke="url(#royalDarkBlue)" strokeWidth="1" strokeDasharray="4 8" />
          <ellipse cx="550" cy="375" rx="420" ry="260" stroke="#1e3a8a" strokeWidth="0.8" strokeDasharray="1 5" />
          <ellipse cx="550" cy="375" rx="320" ry="190" stroke="#172554" strokeWidth="0.8" />
          <ellipse cx="550" cy="375" rx="200" ry="120" stroke="#1e3a8a" strokeWidth="0.6" strokeDasharray="6 12" />
          
          {/* Subtle Crosshairs & Coordinates */}
          <line x1="550" y1="20" x2="550" y2="730" stroke="#1e3a8a" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="4 6" />
          <line x1="20" y1="375" x2="1080" y2="375" stroke="#1e3a8a" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="4 6" />
          
          <defs>
            <linearGradient id="royalDarkBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#172554" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 4. Dark Blue Ambient Lighting Halos */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] rounded-full bg-blue-950/8 blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-[550px] h-[450px] rounded-full bg-blue-900/8 blur-[130px] pointer-events-none" />

      {/* 5. Regal Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#1e3a8a]/40 to-transparent" />
    </div>
  );
};
