const CategoryIcon = ({ icon = 'fa-tag', type, size = 'md' }) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const colors = {
    income:  'bg-income-500/15 text-income-400',
    expense: 'bg-expense-500/15 text-expense-400',
  };

  const isFontAwesome = typeof icon === 'string' && (icon.startsWith('fa-') || icon.startsWith('fa '));
  const isPlainIconName = typeof icon === 'string' && /^[a-z0-9-]+$/i.test(icon) && !icon.includes(' ');

  const renderIcon = () => {
    if (!icon) {
      return <i className="fa-solid fa-tag" />;
    }
    if (isFontAwesome) {
      return <i className={`fa-solid ${icon}`} />;
    }
    if (isPlainIconName) {
      return <i className={`fa-solid fa-${icon}`} />;
    }
    return <span className="leading-none select-none text-base">{icon}</span>;
  };

  return (
    <div className={`rounded-xl flex items-center justify-center flex-shrink-0
      ${sizes[size]} ${colors[type] || colors.expense}`}>
      {renderIcon()}
    </div>
  );
};

export default CategoryIcon;