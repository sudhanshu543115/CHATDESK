import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useRegisterMutation } from '@store/services/chatApi';
import { setCredentials } from '@store/slices/authSlice';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      if (response.data?.register) {
        const { token, username, id } = response.data.register;
        dispatch(setCredentials({ user: { username, id }, token }));
        navigate('/chat');
      } else if (response.errors) {
        setError(response.errors[0].message);
      }
    } catch (err) {
      setError(err.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md p-8 relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-secondary-600 to-primary-500 shadow-xl shadow-secondary-500/20 mb-6 -rotate-3">
            <span className="text-2xl font-black text-white rotate-3 tracking-tighter">CD</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            Join ChatDesk
          </h1>
          <p className="text-slate-400 font-medium">
            Start communicating with your team.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-shake">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
            <Input
              type="text"
              name="username"
              placeholder="Pick a unique username"
              value={formData.username}
              onChange={handleChange}
              icon={User}
              className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-secondary-500/50 focus:ring-secondary-500/20 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-secondary-500/50 focus:ring-secondary-500/20 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-secondary-500/50 focus:ring-secondary-500/20 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm</label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={Lock}
                className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-secondary-500/50 focus:ring-secondary-500/20 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-secondary-600 to-secondary-500 hover:from-secondary-500 hover:to-secondary-400 text-white font-black py-4 rounded-xl shadow-lg shadow-secondary-500/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>CREATING...</span>
                </div>
              ) : (
                'CREATE ACCOUNT'
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-secondary-500 hover:text-secondary-400 font-black transition-colors"
            >
              SIGN IN
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
