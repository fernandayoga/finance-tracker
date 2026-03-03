import Sidebar from './Sidebar.jsx';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-dark-900">
      <Sidebar />
      {/* ml-56 = lebar sidebar */}
      <main className="flex-1 ml-56 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;