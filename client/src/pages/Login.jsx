import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { Wallet, AlertCircle, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative">
      <div className="w-full max-w-sm relative z-10 space-y-6">

        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/20 mb-2">
            <Wallet size={24} strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs text-text-muted">
            Enter your credentials to access your financial dashboard
          </p>
        </div>

        {/* Form Card */}
        <div className="card bg-dark-800/90 border-dark-600/80 shadow-2xl p-6 sm:p-7">
          {error && (
            <div className="mb-4 p-3 rounded-xl text-expense-400 text-xs flex items-center gap-2 bg-expense-500/10 border border-expense-500/25">
              <AlertCircle size={14} strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              icon="envelope"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              icon="lock"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-dark-600/60 text-center">
            <p className="text-xs text-text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Security Trust Note */}
        <div className="text-center flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
          <ShieldCheck size={13} strokeWidth={2} className="text-primary-400" />
          <span>Encrypted Session • Privacy First</span>
        </div>

      </div>
    </div>
  );
};

export default Login;