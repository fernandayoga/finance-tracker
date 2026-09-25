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
} from 'lucide-react';

const iconComponentMap = {
  // FontAwesome alias mappings to Lucide
  'fa-money-bill-wave': { comp: Banknote, name: 'Banknote', duotone: true },
  'fa-money-bill': { comp: Banknote, name: 'Banknote', duotone: true },
  'fa-laptop-code': { comp: Laptop, name: 'Laptop', duotone: true },
  'fa-laptop': { comp: Laptop, name: 'Laptop', duotone: true },
  'fa-chart-line': { comp: TrendingUp, name: 'TrendingUp', duotone: false },
  'fa-gift': { comp: Gift, name: 'Gift', duotone: true },
  'fa-circle-plus': { comp: PlusCircle, name: 'PlusCircle', duotone: true },
  'fa-utensils': { comp: Utensils, name: 'Utensils', duotone: true },
  'fa-car': { comp: Car, name: 'Car', duotone: true },
  'fa-bag-shopping': { comp: ShoppingBag, name: 'ShoppingBag', duotone: true },
  'fa-shopping-bag': { comp: ShoppingBag, name: 'ShoppingBag', duotone: true },
  'fa-file-invoice': { comp: Receipt, name: 'Receipt', duotone: true },
  'fa-receipt': { comp: Receipt, name: 'Receipt', duotone: true },
  'fa-heart-pulse': { comp: HeartPulse, name: 'HeartPulse', duotone: true },
  'fa-gamepad': { comp: Gamepad2, name: 'Gamepad2', duotone: true },
  'fa-book': { comp: BookOpen, name: 'BookOpen', duotone: true },
  'fa-circle-minus': { comp: MinusCircle, name: 'MinusCircle', duotone: true },
  'fa-tag': { comp: Tag, name: 'Tag', duotone: true },
  'fa-tags': { comp: Tag, name: 'Tag', duotone: true },
  'fa-wallet': { comp: Wallet, name: 'Wallet', duotone: true },
  'fa-coffee': { comp: Coffee, name: 'Coffee', duotone: true },
  'fa-mug-saucer': { comp: Coffee, name: 'Coffee', duotone: true },
  'fa-plane': { comp: Plane, name: 'Plane', duotone: true },
  'fa-home': { comp: Home, name: 'Home', duotone: true },
  'fa-house': { comp: Home, name: 'Home', duotone: true },
  'fa-bus': { comp: Bus, name: 'Bus', duotone: true },
  'fa-film': { comp: Film, name: 'Film', duotone: true },
  'fa-music': { comp: Music, name: 'Music', duotone: true },
  'fa-wifi': { comp: Wifi, name: 'Wifi', duotone: false },
  'fa-cart-shopping': { comp: ShoppingCart, name: 'ShoppingCart', duotone: true },
  'fa-shopping-cart': { comp: ShoppingCart, name: 'ShoppingCart', duotone: true },
  'fa-piggy-bank': { comp: PiggyBank, name: 'PiggyBank', duotone: true },
  'fa-credit-card': { comp: CreditCard, name: 'CreditCard', duotone: true },
  'fa-phone': { comp: Phone, name: 'Phone', duotone: true },
  'fa-store': { comp: Store, name: 'Store', duotone: true },
  'fa-wrench': { comp: Wrench, name: 'Wrench', duotone: true },
  'fa-shield': { comp: Shield, name: 'Shield', duotone: true },
  'fa-key': { comp: Key, name: 'Key', duotone: true },
  'fa-graduation-cap': { comp: GraduationCap, name: 'GraduationCap', duotone: true },
  'fa-shirt': { comp: Shirt, name: 'Shirt', duotone: true },
  'fa-briefcase': { comp: Briefcase, name: 'Briefcase', duotone: true },

  // Direct word names
  car: { comp: Car, name: 'Car', duotone: true },
  transport: { comp: Car, name: 'Car', duotone: true },
  utensils: { comp: Utensils, name: 'Utensils', duotone: true },
  food: { comp: Utensils, name: 'Utensils', duotone: true },
  makan: { comp: Utensils, name: 'Utensils', duotone: true },
  shopping: { comp: ShoppingBag, name: 'ShoppingBag', duotone: true },
  belanja: { comp: ShoppingBag, name: 'ShoppingBag', duotone: true },
  bills: { comp: Receipt, name: 'Receipt', duotone: true },
  tagihan: { comp: Receipt, name: 'Receipt', duotone: true },
  salary: { comp: Banknote, name: 'Banknote', duotone: true },
  gaji: { comp: Banknote, name: 'Banknote', duotone: true },
  freelance: { comp: Laptop, name: 'Laptop', duotone: true },
  gift: { comp: Gift, name: 'Gift', duotone: true },
  hadiah: { comp: Gift, name: 'Gift', duotone: true },
  health: { comp: HeartPulse, name: 'HeartPulse', duotone: true },
  kesehatan: { comp: HeartPulse, name: 'HeartPulse', duotone: true },
  game: { comp: Gamepad2, name: 'Gamepad2', duotone: true },
  hiburan: { comp: Gamepad2, name: 'Gamepad2', duotone: true },
  education: { comp: BookOpen, name: 'BookOpen', duotone: true },
  pendidikan: { comp: BookOpen, name: 'BookOpen', duotone: true },
  investasi: { comp: TrendingUp, name: 'TrendingUp', duotone: false },
};

// Rich Category Theme Presets with Multi-Tone Radiant Gradients, Duotone Fill, and Glowing Halos
const categoryThemeMap = {
  // Transport & Vehicles -> Electric Sky Blue & Cobalt Cyan
  Car: {
    bg: 'bg-gradient-to-br from-sky-400/25 via-blue-500/15 to-indigo-950/40',
    border: 'border border-sky-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-sky-300',
    ambient: 'bg-sky-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(56,189,248,0.4),0_0_14px_rgba(56,189,248,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(56,189,248,0.65)]',
    motion: 'group-hover:translate-x-1 group-hover:scale-105',
    duotone: true,
  },
  Bus: {
    bg: 'bg-gradient-to-br from-sky-400/25 via-blue-500/15 to-indigo-950/40',
    border: 'border border-sky-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-sky-300',
    ambient: 'bg-sky-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(56,189,248,0.4),0_0_14px_rgba(56,189,248,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(56,189,248,0.65)]',
    motion: 'group-hover:translate-x-0.5',
    duotone: true,
  },
  Plane: {
    bg: 'bg-gradient-to-br from-sky-400/25 via-blue-500/15 to-indigo-950/40',
    border: 'border border-sky-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-sky-300',
    ambient: 'bg-sky-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(56,189,248,0.4),0_0_14px_rgba(56,189,248,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(56,189,248,0.65)]',
    motion: 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
    duotone: true,
  },

  // Food & Dining -> Warm Golden Amber & Tangerine
  Utensils: {
    bg: 'bg-gradient-to-br from-amber-400/25 via-orange-500/15 to-amber-950/40',
    border: 'border border-amber-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-amber-300',
    ambient: 'bg-amber-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(245,158,11,0.4),0_0_14px_rgba(245,158,11,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(245,158,11,0.65)]',
    motion: 'group-hover:rotate-6 group-hover:scale-105',
    duotone: true,
  },
  Coffee: {
    bg: 'bg-gradient-to-br from-amber-400/25 via-orange-500/15 to-amber-950/40',
    border: 'border border-amber-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-amber-300',
    ambient: 'bg-amber-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(245,158,11,0.4),0_0_14px_rgba(245,158,11,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(245,158,11,0.65)]',
    motion: 'group-hover:-translate-y-0.5',
    duotone: true,
  },

  // Shopping & Lifestyle -> Vibrant Magenta & Hot Rose
  ShoppingBag: {
    bg: 'bg-gradient-to-br from-pink-400/25 via-rose-500/15 to-fuchsia-950/40',
    border: 'border border-pink-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-pink-300',
    ambient: 'bg-pink-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(244,63,94,0.4),0_0_14px_rgba(244,63,94,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(244,63,94,0.65)]',
    motion: 'group-hover:-translate-y-0.5 group-hover:scale-105',
    duotone: true,
  },
  ShoppingCart: {
    bg: 'bg-gradient-to-br from-pink-400/25 via-rose-500/15 to-fuchsia-950/40',
    border: 'border border-pink-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-pink-300',
    ambient: 'bg-pink-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(244,63,94,0.4),0_0_14px_rgba(244,63,94,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(244,63,94,0.65)]',
    motion: 'group-hover:translate-x-0.5',
    duotone: true,
  },
  Shirt: {
    bg: 'bg-gradient-to-br from-pink-400/25 via-rose-500/15 to-fuchsia-950/40',
    border: 'border border-pink-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-pink-300',
    ambient: 'bg-pink-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(244,63,94,0.4),0_0_14px_rgba(244,63,94,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(244,63,94,0.65)]',
    motion: 'group-hover:scale-105',
    duotone: true,
  },

  // Bills, Invoices, Utilities -> Electric Indigo & Cyber Violet
  Receipt: {
    bg: 'bg-gradient-to-br from-indigo-400/25 via-purple-500/15 to-indigo-950/40',
    border: 'border border-indigo-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-indigo-300',
    ambient: 'bg-indigo-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(99,102,241,0.4),0_0_14px_rgba(99,102,241,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(99,102,241,0.65)]',
    motion: 'group-hover:-translate-y-0.5',
    duotone: true,
  },
  Wifi: {
    bg: 'bg-gradient-to-br from-indigo-400/25 via-purple-500/15 to-indigo-950/40',
    border: 'border border-indigo-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-indigo-300',
    ambient: 'bg-indigo-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(99,102,241,0.4),0_0_14px_rgba(99,102,241,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(99,102,241,0.65)]',
    motion: 'group-hover:scale-105',
    duotone: false,
  },
  Phone: {
    bg: 'bg-gradient-to-br from-indigo-400/25 via-purple-500/15 to-indigo-950/40',
    border: 'border border-indigo-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-indigo-300',
    ambient: 'bg-indigo-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(99,102,241,0.4),0_0_14px_rgba(99,102,241,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(99,102,241,0.65)]',
    motion: 'group-hover:rotate-6',
    duotone: true,
  },

  // Health & Medical -> Radiant Coral & Ruby Pulse
  HeartPulse: {
    bg: 'bg-gradient-to-br from-rose-500/25 via-red-500/15 to-rose-950/40',
    border: 'border border-rose-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-rose-300',
    ambient: 'bg-rose-500/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(244,63,94,0.4),0_0_14px_rgba(244,63,94,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(244,63,94,0.65)]',
    motion: 'group-hover:scale-115',
    duotone: true,
  },

  // Entertainment & Gaming -> Royal Purple & Electric Fuchsia
  Gamepad2: {
    bg: 'bg-gradient-to-br from-purple-400/25 via-violet-500/15 to-purple-950/40',
    border: 'border border-purple-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-purple-300',
    ambient: 'bg-purple-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(168,85,247,0.4),0_0_14px_rgba(168,85,247,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(168,85,247,0.65)]',
    motion: 'group-hover:scale-105 group-hover:rotate-3',
    duotone: true,
  },
  Film: {
    bg: 'bg-gradient-to-br from-purple-400/25 via-violet-500/15 to-purple-950/40',
    border: 'border border-purple-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-purple-300',
    ambient: 'bg-purple-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(168,85,247,0.4),0_0_14px_rgba(168,85,247,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(168,85,247,0.65)]',
    motion: 'group-hover:scale-105',
    duotone: true,
  },
  Music: {
    bg: 'bg-gradient-to-br from-purple-400/25 via-violet-500/15 to-purple-950/40',
    border: 'border border-purple-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-purple-300',
    ambient: 'bg-purple-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(168,85,247,0.4),0_0_14px_rgba(168,85,247,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(168,85,247,0.65)]',
    motion: 'group-hover:-translate-y-0.5',
    duotone: true,
  },

  // Education & Books -> Ocean Teal & Clean Cyan
  BookOpen: {
    bg: 'bg-gradient-to-br from-teal-400/25 via-cyan-500/15 to-teal-950/40',
    border: 'border border-teal-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-teal-300',
    ambient: 'bg-teal-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(20,184,166,0.4),0_0_14px_rgba(20,184,166,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(20,184,166,0.65)]',
    motion: 'group-hover:scale-105',
    duotone: true,
  },
  GraduationCap: {
    bg: 'bg-gradient-to-br from-teal-400/25 via-cyan-500/15 to-teal-950/40',
    border: 'border border-teal-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-teal-300',
    ambient: 'bg-teal-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(20,184,166,0.4),0_0_14px_rgba(20,184,166,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(20,184,166,0.65)]',
    motion: 'group-hover:-translate-y-0.5',
    duotone: true,
  },

  // Income / Money / Salary -> Luminous Soft Mint & Emerald
  Banknote: {
    bg: 'bg-gradient-to-br from-emerald-400/25 via-teal-500/15 to-emerald-950/40',
    border: 'border border-emerald-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-emerald-300',
    ambient: 'bg-emerald-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(45,212,191,0.4),0_0_14px_rgba(45,212,191,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(45,212,191,0.65)]',
    motion: 'group-hover:scale-105',
    duotone: true,
  },
  Laptop: {
    bg: 'bg-gradient-to-br from-emerald-400/25 via-cyan-500/15 to-teal-950/40',
    border: 'border border-emerald-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-emerald-300',
    ambient: 'bg-emerald-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(45,212,191,0.4),0_0_14px_rgba(45,212,191,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(45,212,191,0.65)]',
    motion: 'group-hover:-translate-y-0.5',
    duotone: true,
  },
  TrendingUp: {
    bg: 'bg-gradient-to-br from-cyan-400/25 via-emerald-500/15 to-teal-950/40',
    border: 'border border-cyan-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-cyan-300',
    ambient: 'bg-cyan-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(6,182,212,0.4),0_0_14px_rgba(6,182,212,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(6,182,212,0.65)]',
    motion: 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
    duotone: false,
  },
  Gift: {
    bg: 'bg-gradient-to-br from-emerald-400/25 via-teal-500/15 to-emerald-950/40',
    border: 'border border-emerald-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-emerald-300',
    ambient: 'bg-emerald-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(45,212,191,0.4),0_0_14px_rgba(45,212,191,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(45,212,191,0.65)]',
    motion: 'group-hover:scale-110',
    duotone: true,
  },
  PiggyBank: {
    bg: 'bg-gradient-to-br from-emerald-400/25 via-teal-500/15 to-emerald-950/40',
    border: 'border border-emerald-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-emerald-300',
    ambient: 'bg-emerald-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(45,212,191,0.4),0_0_14px_rgba(45,212,191,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(45,212,191,0.65)]',
    motion: 'group-hover:scale-105',
    duotone: true,
  },
  PlusCircle: {
    bg: 'bg-gradient-to-br from-emerald-400/25 via-teal-500/15 to-emerald-950/40',
    border: 'border border-emerald-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-emerald-300',
    ambient: 'bg-emerald-400/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(45,212,191,0.4),0_0_14px_rgba(45,212,191,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(45,212,191,0.65)]',
    motion: 'group-hover:scale-105 group-hover:rotate-45',
    duotone: true,
  },

  // Other Expense Fallback -> Ruby Rose & Crimson Depth
  MinusCircle: {
    bg: 'bg-gradient-to-br from-rose-500/25 via-pink-500/15 to-rose-950/40',
    border: 'border border-rose-400/40 ring-1 ring-inset ring-white/15',
    color: 'text-rose-300',
    ambient: 'bg-rose-500/20',
    glow: 'shadow-[0_4px_16px_-2px_rgba(251,113,133,0.4),0_0_14px_rgba(251,113,133,0.18)]',
    dropShadow: 'drop-shadow-[0_2px_8px_rgba(251,113,133,0.65)]',
    motion: 'group-hover:scale-105 group-hover:rotate-[-6deg]',
    duotone: true,
  },
  Tag: {
    bg: 'bg-gradient-to-br from-slate-600/30 via-dark-700/80 to-dark-850',
    border: 'border border-slate-500/35 ring-1 ring-inset ring-white/15',
    color: 'text-slate-300',
    ambient: 'bg-slate-400/15',
    glow: 'shadow-[0_4px_16px_-2px_rgba(0,0,0,0.4)]',
    dropShadow: 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]',
    motion: 'group-hover:scale-105',
    duotone: true,
  },
};

const defaultExpenseTheme = {
  bg: 'bg-gradient-to-br from-rose-500/25 via-pink-500/15 to-rose-950/40',
  border: 'border border-rose-400/40 ring-1 ring-inset ring-white/15',
  color: 'text-rose-300',
  ambient: 'bg-rose-500/20',
  glow: 'shadow-[0_4px_16px_-2px_rgba(251,113,133,0.4),0_0_14px_rgba(251,113,133,0.18)]',
  dropShadow: 'drop-shadow-[0_2px_8px_rgba(251,113,133,0.65)]',
  motion: 'group-hover:scale-105 group-hover:rotate-[-6deg]',
  duotone: true,
};

const defaultIncomeTheme = {
  bg: 'bg-gradient-to-br from-emerald-400/25 via-teal-500/15 to-emerald-950/40',
  border: 'border border-emerald-400/40 ring-1 ring-inset ring-white/15',
  color: 'text-emerald-300',
  ambient: 'bg-emerald-400/20',
  glow: 'shadow-[0_4px_16px_-2px_rgba(45,212,191,0.4),0_0_14px_rgba(45,212,191,0.18)]',
  dropShadow: 'drop-shadow-[0_2px_8px_rgba(45,212,191,0.65)]',
  motion: 'group-hover:scale-105 group-hover:rotate-45',
  duotone: true,
};

const CategoryIcon = ({ icon = 'fa-tag', type, size = 'md', className = '' }) => {
  const containerSizes = {
    xs: 'w-6 h-6 rounded-lg',
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const iconSizes = {
    xs: 12,
    sm: 15,
    md: 18,
    lg: 22,
  };

  // Determine icon component, theme and duotone capabilities
  let IconComponent = null;
  let themeName = null;
  let isDuotone = false;

  if (icon) {
    const cleanKey = icon.replace(/^fa-solid\s+/, '').replace(/^fa\s+/, '').trim();
    const entry = iconComponentMap[cleanKey] || iconComponentMap[`fa-${cleanKey}`];
    if (entry) {
      IconComponent = entry.comp;
      themeName = entry.name;
      isDuotone = entry.duotone ?? false;
    }
  }

  // Fallbacks if not recognized
  if (!IconComponent) {
    if (type === 'income') {
      IconComponent = PlusCircle;
      themeName = 'PlusCircle';
      isDuotone = true;
    } else {
      IconComponent = MinusCircle;
      themeName = 'MinusCircle';
      isDuotone = true;
    }
  }

  // Check if emoji
  const isFontAwesome = typeof icon === 'string' && (icon.startsWith('fa-') || icon.startsWith('fa '));
  const isEmoji = !isFontAwesome && icon && icon.length <= 4;

  // Resolve Theme
  const theme = themeName
    ? categoryThemeMap[themeName] || (type === 'income' ? defaultIncomeTheme : defaultExpenseTheme)
    : type === 'income' ? defaultIncomeTheme : defaultExpenseTheme;

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5 ${containerSizes[size]} ${theme.bg} ${theme.border} ${theme.glow} ${className}`}
    >
      {/* Ambient backlight glow aura */}
      <span
        className={`absolute -inset-0.5 rounded-xl ${theme.ambient} blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />

      {/* Radiant inner specular top glass highlight */}
      <span className="absolute inset-x-2 top-0.5 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full blur-[0.5px] pointer-events-none" />

      {/* Render emoji or Lucide component */}
      {isEmoji ? (
        <span
          className="relative z-10 leading-none select-none drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          style={{ fontSize: size === 'sm' ? '14px' : size === 'lg' ? '22px' : '17px' }}
        >
          {icon}
        </span>
      ) : (
        <IconComponent
          size={iconSizes[size]}
          strokeWidth={2.4}
          fill="currentColor"
          fillOpacity={isDuotone ? 0.22 : 0}
          className={`relative z-10 ${theme.color} ${theme.dropShadow} transition-all duration-300 ${theme.motion || 'group-hover:scale-105'}`}
        />
      )}
    </div>
  );
};

export default CategoryIcon;