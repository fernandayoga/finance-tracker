const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 select-none';

  const variants = {
    primary:   'btn-primary',
    secondary: 'bg-dark-750 text-text-primary border border-dark-600 hover:bg-dark-700 hover:border-dark-500 active:scale-[0.99]',
    danger:    'bg-expense-500/10 text-expense-400 border border-expense-500/30 hover:bg-expense-500/20 hover:border-expense-500/50 active:scale-[0.99]',
    ghost:     'text-text-secondary hover:bg-dark-750 hover:text-text-primary active:scale-[0.99]',
    income:    'bg-income-500/10 text-income-400 border border-income-500/30 hover:bg-income-500/20 hover:border-income-500/50 active:scale-[0.99]',
    subtle:    'bg-dark-750/70 text-text-secondary hover:text-text-primary hover:bg-dark-700 border border-dark-600/50 active:scale-[0.99]',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm font-semibold',
  };

  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <i className={`fa-solid fa-${icon} text-xs`} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;