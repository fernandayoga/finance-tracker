import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters');
      setLoading(false);
      return;
    }
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative">
      <div className="w-full max-w-sm relative z-10 space-y-6">

        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-dark-950 shadow-md shadow-primary-500/20 mb-2">
            <i className="fa-solid fa-wallet text-xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-text-muted">
            Start tracking your personal wealth and spending habits
          </p>
        </div>

        {/* Form Card */}
        <div className="card bg-dark-800/90 border-dark-600/80 shadow-2xl p-6 sm:p-7">
          {error && (
            <div className="mb-4 p-3 rounded-xl text-expense-400 text-xs flex items-center gap-2 bg-expense-500/10 border border-expense-500/25">
              <i className="fa-solid fa-circle-exclamation text-xs" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="Alex Johnson"
              icon="user"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="alex@example.com"
              icon="envelope"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              icon="lock"
              value={form.password}
              onChange={handleChange}
              hint="Must be at least 6 characters"
              required
            />

            <Button type="submit" loading={loading} className="w-full py-2.5 text-xs font-semibold shadow-md shadow-primary-500/10">
              Create Account
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-dark-600/60 text-center">
            <p className="text-xs text-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Note */}
        <div className="text-center flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
          <i className="fa-solid fa-shield-halved text-[10px] text-primary-400" />
          <span>Encrypted Session • Privacy First</span>
        </div>

      </div>
    </div>
  );
};

export default Register;