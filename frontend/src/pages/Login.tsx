import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Loader2, Command } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{email?: string, password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const validate = () => {
    const errors: {email?: string, password?: string} = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
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
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError(err.response?.data?.error || 'Failed to login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign up
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

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${validationErrors.email ? 'text-rose-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) setValidationErrors({...validationErrors, email: undefined});
                  }}
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
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) setValidationErrors({...validationErrors, password: undefined});
                  }}
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            
            <div className="mt-6 text-center text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="font-semibold text-slate-700 mb-1">Demo Credentials</p>
              <p>Admin: admin@ethara.com / password</p>
              <p>Manager: manager@ethara.com / password</p>
              <p>Employee: employee@ethara.com / password</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
