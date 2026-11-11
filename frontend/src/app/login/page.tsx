'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      router.push('/studio');
    } else {
      setError(result.error || 'Invalid email or password.');
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setSubmitting(true);
    const result = await demoLogin();
    setSubmitting(false);

    if (result.success) {
      router.push('/studio');
    } else {
      setError(result.error || 'Failed to authenticate demo account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/studio" className="inline-flex items-center gap-2 mb-2 group">
          <div className="w-10 h-10 rounded-xl bg-[#0070BA] flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:bg-[#005ea6] transition-colors">
            P
          </div>
          <span className="font-extrabold text-2xl text-gray-900 tracking-tight">
            PayPilot <span className="text-[#0070BA]">AI</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-3">
          Log in to your account
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Intelligent purchasing agent with user-controlled financial authorization
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-200/80 sm:px-10">
          {/* Quick Evaluator Demo Login Pill */}
          <div className="mb-6 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0070BA] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#0070BA]" />
                Hackathon Evaluator?
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                Pre-Configured
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2.5">
              Skip registration and log in with the verified single-tenant demo session (<strong>Abhishek UthukotaSriram</strong>).
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={submitting || isLoading}
              className="w-full py-2 px-3 bg-[#0070BA] hover:bg-[#005ea6] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>1-Click Demo Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400 font-semibold">Or use credentials</span>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@paypilot.ai"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50/50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0070BA]/20 focus:border-[#0070BA] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50/50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0070BA]/20 focus:border-[#0070BA] transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-gray-500 text-[11px]">Secure HTTP-Only Cookies</span>
              </div>
              <span className="text-[11px] text-gray-400 font-mono">7-Day Session</span>
            </div>

            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Nav */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Don&apos;t have an account?</span>
            <Link
              href="/signup"
              className="font-bold text-[#0070BA] hover:underline"
            >
              Create Account →
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-4">
          <Link
            href="/studio"
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            ← Return to Studio as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}
