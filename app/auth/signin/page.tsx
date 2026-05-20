'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Key, Lock, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError('Access denied. Check your credentials and try again.');
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="min-h-screen gradient-accent flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-black/80/60 border border-gray-700 rounded-3xl p-8 shadow-2xl shadow-black/40">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-accent text-white mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-white gradient-accent-text">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-400">Enter your credentials to open the admin dashboard.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-2xl border border-gray-700 bg-gray-800/50 py-3 pl-12 pr-4 text-white outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 placeholder-gray-400"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Key className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-2xl border border-gray-700 bg-gray-800/50 py-3 pl-12 pr-4 text-white outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-accent px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
