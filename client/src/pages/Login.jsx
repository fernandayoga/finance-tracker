import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.07), transparent 65%)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.05), transparent 65%)' }} />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 glow-green"
            style={{ backgroundColor: '#22c55e' }}>
            <i className="fa-solid fa-chart-line text-dark-900 text-lg" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Finance Tracker</h1>
          <p className="text-text-muted text-sm mt-1">Welcome back 👋</p>
        </div>

        {/* Card */}
        <div className="card">

          {error && (
            <div className="mb-4 p-3 rounded-lg text-expense-400 text-sm flex items-center gap-2"
              style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)' }}>
              <i className="fa-solid fa-triangle-exclamation text-xs" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="john@example.com"
              icon="envelope"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon="lock"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" loading={loading} className="w-full mt-1" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-dark-600 text-center">
            <p className="text-text-muted text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;