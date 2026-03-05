const CategoryIcon = ({ icon, type, size = 'md' }) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const colors = {
    income:  'bg-income-500/15 text-income-400',
    expense: 'bg-expense-500/15 text-expense-400',
  };

  return (
    <div className={`rounded-xl flex items-center justify-center flex-shrink-0
      ${sizes[size]} ${colors[type] || colors.expense}`}>
      <i className={`fa-solid ${icon}`} />
    </div>
  );
};

export default CategoryIcon;