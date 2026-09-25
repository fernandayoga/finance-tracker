import Sidebar from './Sidebar.jsx';
import BottomNav from './BottomNav.jsx';
import MobileHeader from './MobileHeader.jsx';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-900 text-text-primary selection:bg-primary-500/20 selection:text-primary-300">

      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Mobile Header — mobile only */}
      <MobileHeader />

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 py-6 min-h-screen transition-all">
        {children}
      </main>

      {/* Bottom Nav — mobile only */}
      <BottomNav />

    </div>
  );
};

export default AppLayout;