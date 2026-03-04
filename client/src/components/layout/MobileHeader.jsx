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

  // Tutup dropdown kalau klik di luar
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
    <header
      className="lg:hidden fixed top-0 left-0 right-0 z-30 border-b border-dark-600 px-4 py-3 flex items-center justify-between"
      style={{ backgroundColor: "#161b26" }}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center glow-green"
          style={{ backgroundColor: "#22c55e" }}
        >
          <i className="fa-solid fa-chart-line text-dark-900 text-xs" />
        </div>
        <span className="font-bold text-text-primary text-sm">{title}</span>
      </div>

      {/* Avatar + Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {/* Avatar button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center transition-all hover:border-primary-500/60"
        >
          <span className="text-primary-400 text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute right-0 top-10 w-52 rounded-xl border border-dark-500 shadow-xl z-50 overflow-hidden"
            style={{ backgroundColor: "#1c2333" }}
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-dark-600">
              <p className="text-text-primary text-xs font-semibold truncate">
                {user?.name}
              </p>
              <p className="text-text-muted text-xs truncate mt-0.5">
                {user?.email}
              </p>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-expense-400 hover:bg-expense-500/10 transition-colors text-sm font-medium"
            >
              <i className="fa-solid fa-right-from-bracket text-xs" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
