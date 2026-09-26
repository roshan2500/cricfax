import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, User, KeyRound, Mail, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (authModalMode === 'login') {
        const res = await api.login(email, password);
        if (res.data) {
          setAuth(res.data.user, res.data.accessToken);
          closeAuthModal();
        }
      } else {
        const res = await api.register({
          email,
          password,
          full_name: fullName,
          username,
        });
        if (res.data) {
          setAuth(res.data.user, res.data.accessToken);
          closeAuthModal();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.login(demoEmail, demoPass);
      if (res.data) {
        setAuth(res.data.user, res.data.accessToken);
        closeAuthModal();
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 mb-3 border border-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            {authModalMode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {authModalMode === 'login'
              ? 'Sign in to access your cricket feed and comments'
              : 'Join the premier community of cricket enthusiasts'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="mb-6 p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span>⚡ Instant One-Click Demo Logins:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@CricFax.com', 'admin123')}
              className="py-1.5 px-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 rounded-lg text-xs font-medium transition-all text-center"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('harsha@CricFax.com', 'password123')}
              className="py-1.5 px-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-200 rounded-lg text-xs font-medium transition-all text-center"
            >
              ✍️ Author
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('reader@CricFax.com', 'password123')}
              className="py-1.5 px-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-200 rounded-lg text-xs font-medium transition-all text-center"
            >
              🏏 Reader
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Dravid"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="the_wall"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-8 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-900/30 disabled:opacity-50 mt-2"
          >
            {isLoading
              ? 'Authenticating...'
              : authModalMode === 'login'
              ? 'Sign In to CricFax'
              : 'Create My Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {authModalMode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Log in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
