import { useState } from 'react';

const Input = ({ label, error, hint, icon, type , className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Icon kiri */}
        {icon && (
          <i className={`fa-solid fa-${icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-xs`} />
        )}

        <input
          type={inputType}
          className={`
            w-full rounded-xl px-4 py-2.5 text-sm
            bg-dark-700 border text-text-primary
            outline-none transition-all duration-150
            placeholder:text-text-muted
            focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/60
            ${error
              ? 'border-expense-500/50 bg-expense-500/5'
              : 'border-dark-500 hover:border-dark-400'
            }
            ${icon ? 'pl-9' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Icon mata — hanya muncul kalau type password */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
          >
            <i className={`fa-solid fa-${showPassword ? 'eye-slash' : 'eye'} text-xs`} />
          </button>
        )}
      </div>

      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      {error && (
        <p className="text-xs text-expense-400 flex items-center gap-1">
          <i className="fa-solid fa-circle-exclamation" /> {error}
        </p>
      )}
    </div>
  );
};

export default Input;