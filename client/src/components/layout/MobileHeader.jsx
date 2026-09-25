import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

const pageTitles = {
  "/dashboard": "Overview",
  "/transactions": "Transactions",
  "/analytics": "Analytics",
  "/categories": "Categories",
};

const MobileHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || "Finance Tracker";

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-dark-850/90 backdrop-blur-md border-b border-dark-600/70 px-4 py-3 flex items-center justify-between">
      {/* Brand & Page Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-sm shadow-primary-500/20">
          <i className="fa-solid fa-wallet text-xs" />
        </div>
        <div>
          <span className="font-bold text-text-primary text-sm tracking-tight">{title}</span>
        </div>
      </div>

      {/* User profile dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-8 h-8 rounded-lg bg-primary-500/15 border border-primary-500/25 flex items-center justify-center transition-all hover:border-primary-500/50"
          aria-label="User menu"
        >
          <span className="text-primary-400 text-xs font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 top-11 w-56 rounded-xl bg-dark-800 border border-dark-600 shadow-2xl z-50 overflow-hidden divide-y divide-dark-600/60 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-4 py-3">
              <p className="text-text-primary text-xs font-semibold truncate">
                {user?.name || 'Account'}
              </p>
              <p className="text-text-muted text-[11px] truncate mt-0.5">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-expense-400 hover:bg-expense-500/10 transition-colors text-xs font-medium text-left"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-xs" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
