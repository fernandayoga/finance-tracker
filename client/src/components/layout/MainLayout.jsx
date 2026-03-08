import Sidebar from './Sidebar.jsx';
import BottomNav from './BottomNav.jsx';
import MobileHeader from './MobileHeader.jsx';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-900">

      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Mobile Header — mobile only */}
      <MobileHeader />

      {/* Main content */}
      <main className={`
        lg:ml-56
        pt-16 lg:pt-0
        pb-24 lg:pb-0
        px-4 lg:px-6
        py-4 lg:py-6
        min-h-screen
      `}>
        {children}
      </main>

      {/* Bottom Nav — mobile only */}
      <BottomNav />

    </div>
  );
};

export default AppLayout;