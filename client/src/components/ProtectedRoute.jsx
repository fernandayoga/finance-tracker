import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/UseAuth.js';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Tunggu sampai pengecekan token selesai
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Belum login? redirect ke login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;