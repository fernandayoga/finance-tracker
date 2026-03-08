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
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:   'btn-primary',
    secondary: 'bg-dark-700 text-text-primary border border-dark-500 hover:bg-dark-600 hover:border-dark-400',
    danger:    'bg-transparent text-expense-400 border border-expense-500/40 hover:bg-expense-500/10',
    ghost:     'text-text-secondary hover:bg-dark-700 hover:text-text-primary',
    income:    'bg-transparent text-income-400 border border-income-500/40 hover:bg-income-500/10',
    subtle:    'bg-dark-700 text-text-secondary hover:text-text-primary hover:bg-dark-600',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
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