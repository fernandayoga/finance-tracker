import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

const menuItems = [
  { label: 'Overview',     icon: 'gauge',            path: '/dashboard' },
  { label: 'Transactions', icon: 'arrow-right-arrow-left', path: '/transactions' },
  { label: 'Analytics',    icon: 'chart-pie',        path: '/analytics' },
  { label: 'Categories',   icon: 'tag',              path: '/categories' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-56 h-screen bg-dark-800 border-r border-dark-600 flex flex-col fixed left-0 top-0 z-20">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-dark-600">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center glow-green"
            style={{ backgroundColor: '#22c55e' }}>
            <i className="fa-solid fa-chart-line text-dark-900 text-sm" />
          </div>
          <span className="font-bold text-text-primary text-sm">Finance Tracker</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-dark-600">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
            <span className="text-primary-400 text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-text-primary text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-text-muted text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="text-text-muted text-xs font-semibold uppercase tracking-widest px-2 mb-2">
          Menu
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <i className={`fa-solid fa-${item.icon} w-4 text-center text-xs`} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-dark-600">
        <button
          onClick={handleLogout}
          className="nav-item w-full text-expense-400 hover:bg-expense-500/10 hover:text-expense-400"
        >
          <i className="fa-solid fa-right-from-bracket w-4 text-center text-xs" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;