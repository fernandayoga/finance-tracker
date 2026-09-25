import React from 'react';
import { ArrowDown, ArrowUp, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * FlowBadge — Clean, modern directional badge for Inflow, Outflow, and Net Cash Flow.
 * Features elegant multi-stop gradients and clean borders without glowing edge auras.
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
    md: 'w-9.5 h-9.5 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
  };

  const iconSizes = {
    sm: 15,
    md: 18,
    lg: 20,
  };

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${sizeClasses[size]} ${
        isPositive
          ? 'bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-dark-800 border border-emerald-500/30 text-emerald-300 shadow-xs'
          : 'bg-gradient-to-br from-rose-500/20 via-pink-500/10 to-dark-800 border border-rose-500/30 text-rose-300 shadow-xs'
      } ${className}`}
    >
      {/* Directional Glyphs with Clean Strokes and Dynamic Motion */}
      {isIncome && (
        <ArrowDown
          size={iconSizes[size]}
          strokeWidth={2.4}
          className="transition-transform duration-200 group-hover:translate-y-0.5"
        />
      )}

      {isExpense && (
        <ArrowUp
          size={iconSizes[size]}
          strokeWidth={2.4}
          className="transition-transform duration-200 group-hover:-translate-y-0.5"
        />
      )}

      {isNet && (
        isPositive ? (
          <TrendingUp
            size={iconSizes[size]}
            strokeWidth={2.4}
            className="transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <TrendingDown
            size={iconSizes[size]}
            strokeWidth={2.4}
            className="transition-transform duration-200 group-hover:scale-105"
          />
        )
      )}
    </div>
  );
};

export default FlowBadge;
