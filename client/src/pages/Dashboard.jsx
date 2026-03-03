import useAuth from '../hooks/UseAuth.js';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Halo, {user?.name}! 👋</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
        <p className="text-gray-400">Dashboard akan diisi di Step 6...</p>
      </div>
    </div>
  );
};

export default Dashboard;