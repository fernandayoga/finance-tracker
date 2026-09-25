import React from 'react';
import { ArrowDown, ArrowUp, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * FlowBadge — Ultra-premium fintech directional badge for Inflow, Outflow, and Net Cash Flow.
 * Features radiant multi-stop gradients, ambient neon glow, specular top glass glare,
 * drop-shadowed glyphs, and dynamic hover physics.
 */
const FlowBadge = ({
  type = 'income',
  size = 'md',
  netPositive = true,
  className = '',
}) => {
  const isIncome = type === 'income';
  const isExpense = type === 'expense';
  const isNet = type === 'net';
  const isPositive = isNet ? netPositive : isIncome;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const iconSizes = {
    sm: 15,
    md: 18,
    lg: 22,
  };

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 ${sizeClasses[size]} ${
        isPositive
          ? 'bg-gradient-to-br from-emerald-400/25 via-teal-500/15 to-emerald-950/40 border border-emerald-400/40 text-emerald-300 shadow-[0_4px_16px_-2px_rgba(45,212,191,0.4),0_0_16px_rgba(45,212,191,0.18)]'
          : 'bg-gradient-to-br from-rose-500/25 via-pink-500/15 to-rose-950/40 border border-rose-400/40 text-rose-300 shadow-[0_4px_16px_-2px_rgba(251,113,133,0.4),0_0_16px_rgba(251,113,133,0.18)]'
      } ring-1 ring-inset ring-white/15 ${className}`}
    >
      {/* Ambient backlight glow */}
      <span
        className={`absolute -inset-0.5 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          isPositive ? 'bg-emerald-400/20' : 'bg-rose-400/20'
        }`}
      />

      {/* Specular top glass glare highlight */}
      <span className="absolute inset-x-2 top-0.5 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full blur-[0.5px] pointer-events-none" />

      {/* Directional Glyphs with Luminous Drop Shadow & Motion */}
      {isIncome && (
        <ArrowDown
          size={iconSizes[size]}
          strokeWidth={2.6}
          className="relative z-10 drop-shadow-[0_2px_8px_rgba(45,212,191,0.7)] group-hover:translate-y-0.5 transition-transform duration-300"
        />
      )}

      {isExpense && (
        <ArrowUp
          size={iconSizes[size]}
          strokeWidth={2.6}
          className="relative z-10 drop-shadow-[0_2px_8px_rgba(251,113,133,0.7)] group-hover:-translate-y-0.5 transition-transform duration-300"
        />
      )}

      {isNet && (
        isPositive ? (
          <TrendingUp
            size={iconSizes[size]}
            strokeWidth={2.6}
            className="relative z-10 drop-shadow-[0_2px_8px_rgba(45,212,191,0.7)] group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <TrendingDown
            size={iconSizes[size]}
            strokeWidth={2.6}
            className="relative z-10 drop-shadow-[0_2px_8px_rgba(251,113,133,0.7)] group-hover:scale-110 transition-transform duration-300"
          />
        )
      )}
    </div>
  );
};

export default FlowBadge;
