const Card = ({ children, className = '', padding = true }) => {
  return (
    <div className={`bg-white rounded-2xl border border-surface-200 ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;