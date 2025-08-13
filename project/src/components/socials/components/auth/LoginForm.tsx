import React, { useState } from 'react';
import { apiService } from '../../services/api';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.login({ email, password });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-900 rounded-lg p-8 border border-zinc-800">
      <h2 className="text-2xl text-zinc-200 mb-6 font-light tracking-wide">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

    <form onSubmit={handleSubmit} className="space-y-4">
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
        />
      </div>

      <button
        type="submit"
        disabled={loading}
          className="w-full bg-white text-black py-2 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
    </div>
  );
};