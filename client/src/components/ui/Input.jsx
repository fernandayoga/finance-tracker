import { useState } from 'react';

const Input = ({ label, error, hint, icon, type, className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-text-secondary tracking-tight">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Left icon */}
        {icon && (
          <i className={`fa-solid fa-${icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-xs pointer-events-none transition-colors`} />
        )}

        <input
          type={inputType}
          className={`
            w-full rounded-xl px-3.5 py-2.5 text-sm
            bg-dark-750/70 border text-text-primary
            outline-none transition-all duration-150
            placeholder:text-text-muted/70
            focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/60 focus:bg-dark-700/90
            ${error
              ? 'border-expense-500/60 bg-expense-500/5 focus:border-expense-500/80 focus:ring-expense-500/20'
              : 'border-dark-600/80 hover:border-dark-500'
            }
            ${icon ? 'pl-9' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Password reveal toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors p-1 rounded-md"
          >
            <i className={`fa-solid fa-${showPassword ? 'eye-slash' : 'eye'} text-xs`} />
          </button>
        )}
      </div>

      {hint && !error && <p className="text-[11px] text-text-muted">{hint}</p>}
      {error && (
        <p className="text-[11px] text-expense-400 flex items-center gap-1 font-medium mt-0.5">
          <i className="fa-solid fa-circle-exclamation text-[10px]" /> {error}
        </p>
      )}
    </div>
  );
};

export default Input;