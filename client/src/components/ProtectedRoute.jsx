import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-3 select-none">
        <span className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-text-muted font-medium tracking-tight">Verifying secure session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;