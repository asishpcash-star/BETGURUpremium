import React from 'react';
import { motion } from 'motion/react';

interface BetGuruLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BetGuruLogo: React.FC<BetGuruLogoProps> = ({
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl sm:text-4xl',
  };

  return (
    <div className="flex items-center gap-2.5 cursor-pointer group select-none">
      {/* Animated Glowing SVG Emblem */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
        transition={{ duration: 0.4 }}
        className={`relative flex ${iconSizes[size]} items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-[2px] shadow-lg shadow-amber-500/25`}
      >
        {/* Pulsing Backglow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 blur-sm opacity-50 group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none" />

        <div className="relative flex h-full w-full items-center justify-center rounded-[14px] bg-zinc-950 p-1.5 overflow-hidden">
          {/* Animated Golden Sweep */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-amber-300/30 to-transparent -skew-x-12 pointer-events-none"
            animate={{ x: ['-150%', '250%'] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
          />

          {/* Premium Custom SVG Crown & Star Emblem */}
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="betguruGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Shield Outer Line */}
            <path
              d="M50 8 L85 24 V50 C85 70 70 88 50 94 C30 88 15 70 15 50 V24 L50 8 Z"
              stroke="url(#betguruGold)"
              strokeWidth="4"
              fill="#09090b"
            />

            {/* Crown Spikes */}
            <path
              d="M30 58 L32 38 L42 46 L50 32 L58 46 L68 38 L70 58 Z"
              fill="url(#betguruGold)"
            />

            {/* Glowing Star in Center */}
            <path
              d="M50 42 L52 48 L58 50 L52 52 L50 58 L48 52 L42 50 L48 48 Z"
              fill="#FFFFFF"
              className="animate-pulse"
            />

            {/* Base Bar */}
            <rect x="28" y="62" width="44" height="6" rx="3" fill="url(#betguruGold)" />
          </svg>
        </div>
      </motion.div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1">
          <span
            className={`${titleSizes[size]} font-serif font-black tracking-wider bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]`}
          >
            BETGURU
          </span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-amber-400 text-xs font-black"
          >
            ✦
          </motion.span>
        </div>

        {showSubtitle && (
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-amber-400/90 font-bold -mt-1">
            OFFICIAL LOTTERY
          </span>
        )}
      </div>
    </div>
  );
};
