import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useLoginMutation } from '@store/services/chatApi';
import { setCredentials } from '@store/slices/authSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error: apiError }] = useLoginMutation();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await login(formData).unwrap();
      
      // If successful, the response is in data.login
      if (response.data?.login) {
        const { token, username, id } = response.data.login;
        dispatch(setCredentials({ user: { username, id }, token }));
        navigate('/chat');
      } else if (response.errors) {
        setError(response.errors[0].message);
      }
    } catch (err) {
      setError(err.data?.message || 'Failed to login. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md p-8 relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 shadow-xl shadow-primary-500/20 mb-6 rotate-3">
            <span className="text-2xl font-black text-white -rotate-3 tracking-tighter">CD</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            ChatDesk
          </h1>
          <p className="text-slate-400 font-medium">
            Welcome back! Please sign in.
          </p>
        </div>

        {(error || apiError) && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-shake">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-400 font-medium">
              {error || 'An unexpected error occurred'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
            <Input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              icon={User}
              className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-primary-500/50 focus:ring-primary-500/20 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-primary-500/50 focus:ring-primary-500/20 rounded-xl"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-primary-600 focus:ring-offset-0 focus:ring-primary-500/20" />
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
            </label>
            <button type="button" className="text-xs font-bold text-primary-500 hover:text-primary-400 transition-colors">
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-black py-4 rounded-xl shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>SIGNING IN...</span>
              </div>
            ) : (
              'SIGN IN'
            )}
          </Button>
        </form>

      </div>
    </div>
  );
};


export default LoginForm;
