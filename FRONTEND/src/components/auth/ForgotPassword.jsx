import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import Button from '@components/common/Button';
import Input from '@components/common/Input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSent(true);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-4">
      <div className="max-w-md w-full space-y-8 bg-light-surface dark:bg-dark-surface p-8 rounded-2xl shadow-xl border border-light-border dark:border-dark-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text">Reset Password</h2>
          <p className="mt-2 text-light-muted dark:text-dark-muted">
            {isSent
              ? "We've sent a password reset link to your email."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {!isSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        ) : (
          <div className="mt-8">
            <Button
              className="w-full"
              onClick={() => setIsSent(false)}
            >
              Try another email
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
