import React from 'react';
import {
  Banknote,
  Laptop,
  TrendingUp,
  Gift,
  PlusCircle,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  HeartPulse,
  Gamepad2,
  BookOpen,
  MinusCircle,
  Tag,
  Wallet,
  Coffee,
  Plane,
  Home,
  Bus,
  Film,
  Music,
  Wifi,
  ShoppingCart,
  PiggyBank,
  CreditCard,
  Phone,
  Store,
  Wrench,
  Shield,
  Key,
  GraduationCap,
  Shirt,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

const iconMap = {
  // Common FA aliases to Lucide components
  'fa-money-bill-wave': Banknote,
  'fa-money-bill': Banknote,
  'fa-laptop-code': Laptop,
  'fa-laptop': Laptop,
  'fa-chart-line': TrendingUp,
  'fa-gift': Gift,
  'fa-circle-plus': PlusCircle,
  'fa-utensils': Utensils,
  'fa-car': Car,
  'fa-bag-shopping': ShoppingBag,
  'fa-shopping-bag': ShoppingBag,
  'fa-file-invoice': Receipt,
  'fa-receipt': Receipt,
  'fa-heart-pulse': HeartPulse,
  'fa-gamepad': Gamepad2,
  'fa-book': BookOpen,
  'fa-circle-minus': MinusCircle,
  'fa-tag': Tag,
  'fa-tags': Tag,
  'fa-wallet': Wallet,
  'fa-coffee': Coffee,
  'fa-mug-saucer': Coffee,
  'fa-plane': Plane,
  'fa-home': Home,
  'fa-house': Home,
  'fa-bus': Bus,
  'fa-film': Film,
  'fa-music': Music,
  'fa-wifi': Wifi,
  'fa-cart-shopping': ShoppingCart,
  'fa-shopping-cart': ShoppingCart,
  'fa-piggy-bank': PiggyBank,
  'fa-credit-card': CreditCard,
  'fa-phone': Phone,
  'fa-store': Store,
  'fa-wrench': Wrench,
  'fa-shield': Shield,
  'fa-key': Key,
  'fa-graduation-cap': GraduationCap,
  'fa-shirt': Shirt,
  'fa-briefcase': Briefcase,
};

const CategoryIcon = ({ icon = 'fa-tag', type, size = 'md' }) => {
  const containerSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconSizes = {
    sm: 13,
    md: 17,
    lg: 21,
  };

  const colors = {
    income:  'bg-income-500/15 text-income-400 border border-income-500/20 shadow-sm shadow-income-500/5',
    expense: 'bg-expense-500/15 text-expense-400 border border-expense-500/20 shadow-sm shadow-expense-500/5',
  };

  const renderIcon = () => {
    if (!icon) {
      return <Tag size={iconSizes[size]} strokeWidth={2} />;
    }

    // Check if it's a known mapped key (with or without 'fa-' or 'fa-solid')
    const cleanKey = icon.replace(/^fa-solid\s+/, '').replace(/^fa\s+/, '').trim();
    const IconComponent = iconMap[cleanKey] || iconMap[`fa-${cleanKey}`];

    if (IconComponent) {
      return <IconComponent size={iconSizes[size]} strokeWidth={2} />;
    }

    // If it's an emoji or custom text
    const isFontAwesome = typeof icon === 'string' && (icon.startsWith('fa-') || icon.startsWith('fa '));
    if (!isFontAwesome && icon.length <= 4) {
      return (
        <span
          className="leading-none select-none"
          style={{ fontSize: size === 'sm' ? '12px' : size === 'lg' ? '18px' : '15px' }}
        >
          {icon}
        </span>
      );
    }

    // Fallback
    return <Tag size={iconSizes[size]} strokeWidth={2} />;
  };

  return (
    <div
      className={`rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${containerSizes[size]} ${
        colors[type] || colors.expense
      }`}
    >
      {renderIcon()}
    </div>
  );
};

export default CategoryIcon;