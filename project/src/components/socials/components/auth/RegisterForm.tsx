import React, { useState } from 'react';
import { apiService } from '../../services/api';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralValid, setReferralValid] = useState<boolean | null>(null);

  // Get referral code from URL or sessionStorage on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlRefCode = urlParams.get('ref');
    const sessionRefCode = sessionStorage.getItem('referralCode');
    
    const refCode = urlRefCode || sessionRefCode;
    if (refCode) {
      setReferralCode(refCode);
      validateReferralCode(refCode);
      console.log('Using referral code for registration:', refCode);
    }
  }, []);

  const validateReferralCode = async (code: string) => {
    if (!code) {
      setReferralValid(null);
      return;
    }
    
    try {
      await apiService.validateReferralCode(code);
      setReferralValid(true);
    } catch (error) {
      setReferralValid(false);
    }
  };

  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setReferralCode(code);
    
    // Debounce validation
    setTimeout(() => {
      validateReferralCode(code);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.register({ name, email, password, referralCode: referralCode || undefined });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-900 rounded-lg p-8 border border-zinc-800">
      <h2 className="text-2xl text-zinc-200 mb-6 font-light tracking-wide">Register</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <label htmlFor="name" className="block text-zinc-300 mb-2">Name</label>
        <input
          type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200"
          required
        />
      </div>
      
      <div>
          <label htmlFor="email" className="block text-zinc-300 mb-2">Email</label>
        <input
          type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200"
          required
        />
      </div>
      
      <div>
          <label htmlFor="password" className="block text-zinc-300 mb-2">Password</label>
        <input
          type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200"
          required
          minLength={6}
        />
      </div>

      <div>
        <label htmlFor="referralCode" className="block text-zinc-300 mb-2">Referral Code (Optional)</label>
        <input
          type="text"
          id="referralCode"
          value={referralCode}
          onChange={handleReferralCodeChange}
          placeholder="Enter referral code if you have one"
          className={`w-full bg-zinc-800 border rounded-lg px-4 py-2 text-zinc-200 ${
            referralValid === true ? 'border-green-500' : 
            referralValid === false ? 'border-red-500' : 
            'border-zinc-700'
          }`}
        />
        {referralValid === true && (
          <p className="text-green-400 text-sm mt-1">✓ Valid referral code</p>
        )}
        {referralValid === false && (
          <p className="text-red-400 text-sm mt-1">✗ Invalid referral code</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
          className="w-full bg-white text-black py-2 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Register'}
      </button>
    </form>
    </div>
  );
};