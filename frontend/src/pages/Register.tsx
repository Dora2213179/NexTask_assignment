import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Mail, Lock, User, AlertCircle, Loader2, CheckCircle2, Command } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({...validationErrors, [e.target.name]: ''});
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'EMPLOYEE'
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500 mb-4 animate-in zoom-in" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
          <p className="text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-3xl tracking-tight mb-4">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Command size={28} className="text-white" />
          </div>
          NexTask
        </div>
        <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 tracking-tight">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/40 sm:rounded-2xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={18} className="text-rose-500" />
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${validationErrors.name ? 'text-rose-400' : 'text-slate-400'}`} />
                </div>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-all sm:text-sm ${
                    validationErrors.name 
                      ? 'border-rose-300 text-rose-900 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {validationErrors.name && (
                <p className="mt-1.5 text-sm text-rose-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${validationErrors.email ? 'text-rose-400' : 'text-slate-400'}`} />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-all sm:text-sm ${
                    validationErrors.email 
                      ? 'border-rose-300 text-rose-900 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1.5 text-sm text-rose-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${validationErrors.password ? 'text-rose-400' : 'text-slate-400'}`} />
                </div>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-all sm:text-sm ${
                    validationErrors.password 
                      ? 'border-rose-300 text-rose-900 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {validationErrors.password && (
                <p className="mt-1.5 text-sm text-rose-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {validationErrors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${validationErrors.confirmPassword ? 'text-rose-400' : 'text-slate-400'}`} />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-all sm:text-sm ${
                    validationErrors.confirmPassword 
                      ? 'border-rose-300 text-rose-900 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1.5 text-sm text-rose-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
