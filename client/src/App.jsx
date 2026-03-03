import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Analytics from './pages/Analytics.jsx';
import Categories from './pages/Categories.jsx';

// Wrapper biar tidak perlu tulis ProtectedRoute + MainLayout berulang
const PrivatePage = ({ children }) => (
  <ProtectedRoute>
    <MainLayout>{children}</MainLayout>
  </ProtectedRoute>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard"    element={<PrivatePage><Dashboard /></PrivatePage>} />
          <Route path="/transactions" element={<PrivatePage><Transactions /></PrivatePage>} />
          <Route path="/analytics"    element={<PrivatePage><Analytics /></PrivatePage>} />
          <Route path="/categories"   element={<PrivatePage><Categories /></PrivatePage>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;