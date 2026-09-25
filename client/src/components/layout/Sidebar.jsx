import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Tag,
  Wallet,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard',    Icon: LayoutDashboard, label: 'Overview' },
  { path: '/transactions', Icon: ArrowLeftRight,   label: 'Transactions' },
  { path: '/analytics',    Icon: PieChart,         label: 'Analytics' },
  { path: '/categories',   Icon: Tag,              label: 'Categories' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex w-64 h-screen bg-dark-850 border-r border-dark-600/70 flex-col fixed left-0 top-0 z-20 select-none">

      {/* Brand Header */}
      <div className="p-5 border-b border-dark-600/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-sm shadow-primary-500/20">
            <Wallet size={18} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-text-primary text-sm tracking-tight">Finance</span>
              <span className="font-semibold text-primary-400 text-sm tracking-tight">Tracker</span>
            </div>
            <p className="text-[11px] text-text-muted font-medium tracking-wide uppercase">Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider px-3 py-2">
          Navigation
        </p>

        {menuItems.map(({ path, Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 font-semibold shadow-sm shadow-primary-500/5'
                  : 'text-text-secondary hover:text-text-primary hover:bg-dark-750/70'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={`transition-colors ${
                    isActive ? 'text-primary-400' : 'text-text-muted group-hover:text-text-secondary'
                  }`}
                />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shadow-sm shadow-primary-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info & Logout */}
      <div className="p-3 border-t border-dark-600/60 bg-dark-900/40">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-dark-800/80 border border-dark-600/50">
          <div className="w-9 h-9 rounded-lg bg-primary-500/15 border border-primary-500/25 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-400 text-xs font-bold tracking-tight">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-xs font-semibold truncate leading-tight">
              {user?.name || 'Account'}
            </p>
            <p className="text-text-muted text-[11px] truncate leading-tight mt-0.5">
              {user?.email || 'Logged in'}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-expense-400 hover:bg-expense-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;