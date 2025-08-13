import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Referrals as ReferralsComponent } from '../components/dashboard/Referrals';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { apiService } from '../services/api';

const Referrals = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(apiService.isAuthenticated());

  useEffect(() => {
    setIsAuthenticated(apiService.isAuthenticated());
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-zinc-200 mb-2 font-light tracking-wide">The Archives</h1>
          <p className="text-zinc-400">Referral Program - Please Login</p>
        </div>

        {authMode === 'login' ? (
          <LoginForm onSuccess={handleAuthSuccess} />
        ) : (
          <RegisterForm onSuccess={handleAuthSuccess} />
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {authMode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>

        <div className="text-center mt-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <p className="text-zinc-300 text-sm mb-2">For testing, you can use:</p>
          <p className="text-zinc-400 text-xs">Email: admin@thearchives.com</p>
          <p className="text-zinc-400 text-xs">Password: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-zinc-200 font-mono tracking-wide">Referral Program</h1>
        <button
          onClick={() => {
            apiService.logout();
            setIsAuthenticated(false);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
      <ReferralsComponent />
    </div>
  );
};

export default Referrals;