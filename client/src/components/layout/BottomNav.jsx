import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard',    icon: 'gauge',                  label: 'Overview' },
  { path: '/transactions', icon: 'arrow-right-arrow-left', label: 'Transactions' },
  { path: '/analytics',    icon: 'chart-pie',              label: 'Analytics' },
  { path: '/categories',   icon: 'tag',                    label: 'Categories' },
];

const BottomNav = () => {
  return (
    // hanya muncul di mobile, hidden di lg ke atas
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-dark-600"
      style={{ backgroundColor: '#161b26' }}>
      <div className="flex items-center">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors
              ${isActive ? 'text-primary-400' : 'text-text-muted hover:text-text-secondary'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all
                  ${isActive ? 'bg-primary-500/20' : ''}`}>
                  <i className={`fa-solid fa-${item.icon} text-sm`} />
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-primary-400' : ''}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;