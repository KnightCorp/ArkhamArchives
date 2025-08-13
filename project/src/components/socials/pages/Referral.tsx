import React, { useState, useEffect } from 'react';
import { Share2, Users, DollarSign, Award, LogIn, UserPlus, Shield, Gift } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { AdminRegisterForm } from '../components/auth/AdminRegisterForm';
import ReferralDashboard from '../components/dashboard/ReferralDashboard';
import AdminDashboard from '../components/admin/AdminDashboard';
import { apiService } from '../services/api';

const Referral = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin'>('login');
  const [showAuth, setShowAuth] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setIsAdmin(user.is_admin || false);
        }
      }
    };
    
    // Check for referral code in URL
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      // Store the referral code in sessionStorage for registration
      sessionStorage.setItem('referralCode', refCode);
      console.log('Detected referral code:', refCode);
    }
    
    checkAuth();
  }, [searchParams]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuth(false);
    
    // Check if the logged-in user is an admin
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setIsAdmin(user.is_admin || false);
    }
  };

  const renderAuthForm = () => {
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

  // If user is authenticated and is admin, show admin dashboard
  if (isAuthenticated && isAdmin) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl text-zinc-200 font-mono tracking-wide">Admin Referral Dashboard</h1>
          <button
            onClick={() => {
              localStorage.clear();
              setIsAuthenticated(false);
              setIsAdmin(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  // If user is authenticated but not admin, show user dashboard
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl text-zinc-200 font-mono tracking-wide">Referral Program</h1>
          <button
            onClick={() => {
              localStorage.clear();
              setIsAuthenticated(false);
              setIsAdmin(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        <ReferralDashboard />
      </div>
    );
  }

  // If showing auth form
  if (showAuth) {
    const modeText = getModeText();
    
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-zinc-200 mb-2 font-light tracking-wide">The Archives</h1>
          <p className="text-zinc-400">Referral Program</p>
        </div>

        {renderAuthForm()}

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
          
          <div>
            <button
              onClick={() => setShowAuth(false)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
            >
              Back to Program Info
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: Show program overview with login/register options
  return (
    <div className="max-w-4xl mx-auto font-cormorant">
      {/* Referral Code Banner */}
      {referralCode && (
        <div className="bg-gradient-to-r from-green-900 to-emerald-800 rounded-lg p-6 border border-green-700 mb-8">
          <div className="flex items-center mb-4">
            <Gift className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <h2 className="text-2xl text-green-200 font-light tracking-wide">You've Been Invited!</h2>
              <p className="text-green-300 text-sm">Referral Code: <span className="font-mono font-bold">{referralCode}</span></p>
            </div>
          </div>
          <p className="text-green-200 mb-6">
            Someone has invited you to join The Archives! Register now to join the referral program and start earning.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setAuthMode('register');
                setShowAuth(true);
              }}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Join Now - Register
            </button>
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuth(true);
              }}
              className="flex items-center px-6 py-3 border border-green-400 text-green-200 rounded-lg hover:bg-green-800/30 transition-colors"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Already Have Account?
            </button>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-zinc-200 font-light tracking-wide">The Archives Referral Program</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setAuthMode('login');
              setShowAuth(true);
            }}
            className="flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setShowAuth(true);
            }}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              referralCode 
                ? 'bg-green-600 text-white hover:bg-green-700 font-medium' 
                : 'border border-zinc-600 text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Register
          </button>
          <button
            onClick={() => {
              setAuthMode('admin');
              setShowAuth(true);
            }}
            className="flex items-center px-4 py-2 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600/10 transition-colors"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin
          </button>
        </div>
      </div>
      
      {/* Program Overview */}
      <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800 mb-8">
        <h2 className="text-2xl text-zinc-200 mb-6 font-light tracking-wide">Earn While You Share</h2>
        <p className="text-zinc-400 mb-8 text-lg">
          Join our exclusive referral program and earn 5% commission on every successful referral. 
          Share the knowledge, expand The Archives network, and be rewarded for your contribution.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-800/50 rounded-lg">
            <Share2 className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg text-zinc-200 mb-2 font-light">Share</h3>
            <p className="text-zinc-400">Share your unique referral link with potential members</p>
          </div>
          
          <div className="p-6 bg-zinc-800/50 rounded-lg">
            <Users className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg text-zinc-200 mb-2 font-light">Connect</h3>
            <p className="text-zinc-400">New members join using your referral code</p>
          </div>
          
          <div className="p-6 bg-zinc-800/50 rounded-lg">
            <DollarSign className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg text-zinc-200 mb-2 font-light">Earn</h3>
            <p className="text-zinc-400">Receive 5% commission on their subscription</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800 mb-8">
        <h2 className="text-2xl text-zinc-200 mb-6 font-light tracking-wide">Get Started Today</h2>
        <p className="text-zinc-400 mb-6">
          Ready to start earning? Login to access your referral dashboard or register for a new account.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setAuthMode('login');
              setShowAuth(true);
            }}
            className="flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Login to Dashboard
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setShowAuth(true);
            }}
            className="flex items-center px-6 py-3 border border-zinc-600 text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Create Account
          </button>
        </div>
      </div>

      {/* Features Preview */}
      <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
        <h2 className="text-2xl text-zinc-200 mb-6 font-light tracking-wide">What You'll Get</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <Award className="w-6 h-6 text-white mb-3" />
            <h3 className="text-lg text-zinc-200 mb-2 font-light">Personal Dashboard</h3>
            <p className="text-zinc-400 text-sm">Track your referrals, earnings, and performance metrics</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <Share2 className="w-6 h-6 text-white mb-3" />
            <h3 className="text-lg text-zinc-200 mb-2 font-light">Unique Referral Link</h3>
            <p className="text-zinc-400 text-sm">Get a personalized link to share with your network</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <DollarSign className="w-6 h-6 text-white mb-3" />
            <h3 className="text-lg text-zinc-200 mb-2 font-light">Real-time Earnings</h3>
            <p className="text-zinc-400 text-sm">See your commission and balance update in real-time</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <Users className="w-6 h-6 text-white mb-3" />
            <h3 className="text-lg text-zinc-200 mb-2 font-light">Referral Analytics</h3>
            <p className="text-zinc-400 text-sm">Detailed insights into your referral performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;