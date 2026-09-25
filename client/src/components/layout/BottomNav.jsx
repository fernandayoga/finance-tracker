import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard',    icon: 'table-columns',          label: 'Overview' },
  { path: '/transactions', icon: 'arrow-right-arrow-left', label: 'Transactions' },
  { path: '/analytics',    icon: 'chart-pie',              label: 'Analytics' },
  { path: '/categories',   icon: 'tags',                   label: 'Categories' },
];

const BottomNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-dark-850/90 backdrop-blur-md border-t border-dark-600/70 py-1.5 px-3">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive ? 'text-primary-400 font-semibold' : 'text-text-muted hover:text-text-secondary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-9 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isActive ? 'bg-primary-500/15' : ''
                  }`}
                >
                  <i className={`fa-solid fa-${item.icon} text-sm ${isActive ? 'text-primary-400' : 'text-text-muted'}`} />
                </div>
                <span className="text-[11px] tracking-tight mt-0.5">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;