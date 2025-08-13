import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { AdminRegisterForm } from '../components/auth/AdminRegisterForm';

const Auth = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin'>('login');
  const navigate = useNavigate();
  const { code } = useParams();

  useEffect(() => {
    // If there's a referral code in the URL, set it as a cookie
    if (code) {
      document.cookie = `referral_code=${code}; path=/; max-age=${30 * 24 * 60 * 60}`;
    }
  }, [code]);

  const handleAuthSuccess = () => {
    // Check if the logged-in user is an admin
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.is_admin) {
        // Route admin to admin dashboard
        navigate('/admin');
      } else {
        // Route regular user to referrals dashboard
        navigate('/referrals');
      }
    } else {
      // Fallback to referrals dashboard
      navigate('/referrals');
    }
  };

  const renderForm = () => {
    switch (authMode) {
      case 'login':
        return <LoginForm onSuccess={handleAuthSuccess} />;
      case 'register':
        return <RegisterForm onSuccess={handleAuthSuccess} />;
      case 'admin':
        return <AdminRegisterForm onSuccess={handleAuthSuccess} />;
      default:
        return <LoginForm onSuccess={handleAuthSuccess} />;
    }
  };

  const getModeText = () => {
    switch (authMode) {
      case 'login':
        return { title: 'Login', switchText: "Don't have an account? Register", switchAction: () => setAuthMode('register') };
      case 'register':
        return { title: 'Register', switchText: 'Already have an account? Login', switchAction: () => setAuthMode('login') };
      case 'admin':
        return { title: 'Admin Registration', switchText: 'Back to Login', switchAction: () => setAuthMode('login') };
      default:
        return { title: 'Login', switchText: "Don't have an account? Register", switchAction: () => setAuthMode('register') };
    }
  };

  const modeText = getModeText();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-zinc-200 mb-2 font-light tracking-wide">The Archives</h1>
          <p className="text-zinc-400">Referral Program</p>
        </div>

        {renderForm()}

        <div className="text-center mt-6 space-y-2">
          <button
            onClick={modeText.switchAction}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {modeText.switchText}
          </button>
          
          {authMode === 'login' && (
            <div>
              <button
                onClick={() => setAuthMode('admin')}
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                Register as Admin
              </button>
            </div>
          )}
          
          {authMode === 'register' && (
            <div>
              <button
                onClick={() => setAuthMode('admin')}
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                Register as Admin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth; 