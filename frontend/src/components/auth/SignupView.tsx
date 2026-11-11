'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  Cpu,
  Bot,
  CreditCard,
  Search,
  Check,
} from 'lucide-react';

interface SignupViewProps {
  initialMode?: 'signup' | 'login';
}

export function SignupView({ initialMode = 'signup' }: SignupViewProps) {
  const router = useRouter();
  const { user, signup, login, demoLogin, isLoading } = useAuth();

  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/studio');
    }
  }, [user, isLoading, router]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter your password.');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      setSubmitting(true);
      const result = await signup(name, email, password);
      setSubmitting(false);

      if (result.success) {
        router.push('/studio');
      } else {
        setError(result.error || 'Failed to create account. Please try again.');
      }
    } else {
      setSubmitting(true);
      const result = await login(email, password);
      setSubmitting(false);

      if (result.success) {
        router.push('/studio');
      } else {
        setError(result.error || 'Invalid email or password.');
      }
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsDemoLoading(true);
    const result = await demoLogin();
    setIsDemoLoading(false);

    if (result.success) {
      router.push('/studio');
    } else {
      setError(result.error || 'Failed to authenticate demo account.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#00142D] text-slate-900 flex flex-col lg:grid lg:grid-cols-12 overflow-x-hidden">
      {/* =========================================================================
          LEFT PANEL: Visual Brand & Architecture Showcase (Desktop) / Header (Mobile)
          ========================================================================= */}
      <div className="lg:col-span-5 bg-gradient-to-b from-[#00142D] via-[#002244] to-[#003B6F] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-blue-900/50">
        {/* Subtle Ambient Mesh Backdrops */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Brand Header */}
          <div className="flex items-center justify-between gap-3 mb-8">
            <Link href="/studio" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0070BA] to-[#00A6FF] flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                P
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                PayPilot <span className="text-[#00A6FF]">AI</span>
              </span>
            </Link>

            <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
              Buildathon 2026
            </span>
          </div>

          {/* Subheading & Event Badge */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google DeepMind × Google Cloud Startup Buildathon India</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Intelligent Purchasing with Human-Controlled Financial Authorization.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              An agentic commerce platform that researches, evaluates, and negotiates complex hardware purchases with deterministic server-side price locks and mandatory PayPal approval.
            </p>
          </div>

          {/* Architecture Pipeline Preview (Collapsible on mobile, full on desktop) */}
          <div className="space-y-2.5 mt-8 hidden sm:block">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300 mb-1 flex items-center gap-1.5">
              <span>Verified 4-Agent Execution Engine</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3 hover:bg-white/10 transition-colors">
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-[#00A6FF] shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Supervisor Agent</span>
                  <span className="text-[10px] font-mono text-blue-300 font-normal">Gemini 3.5 Flash</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  Parses user budget constraints, ML workload specifications, and purchase intent.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3 hover:bg-white/10 transition-colors">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Research Agent</span>
                  <span className="text-[10px] font-mono text-emerald-300 font-normal">Google Search Grounding</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  Queries real-time market specs, GPU TGP watts, and thermal performance benchmarks.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3 hover:bg-white/10 transition-colors">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 shrink-0 mt-0.5">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Product Analyst Agent</span>
                  <span className="text-[10px] font-mono text-purple-300 font-normal">Weighted Scoring</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  Scores hardware on an objective 0–100 scale (VRAM, memory bandwidth, budget fit).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3 hover:bg-white/10 transition-colors">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Purchase & Guardrail Agent</span>
                  <span className="text-[10px] font-mono text-amber-300 font-normal">PayPal REST v2</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  Cryptographically enforces server-side price locks. Zero charge without human sign-off.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Footer Seal */}
        <div className="relative z-10 pt-6 mt-6 border-t border-blue-800/60 hidden lg:flex items-center justify-between text-xs text-blue-200/80">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Institutional FinTech Sandbox</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Abhishek UthukotaSriram</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: Authentication Portal & Dynamic Form Container
          ========================================================================= */}
      <div className="lg:col-span-7 bg-[#F8FAFC] min-h-full flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-14 py-8 sm:py-12 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto">
          {/* Quick Evaluator Access Banner (Buildathon VIP Entry) */}
          <div className="mb-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-white border-2 border-[#0070BA]/30 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#0070BA] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0070BA]">
                  Hackathon Evaluator Fast-Track
                </span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
                1-Click Ready
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3.5">
              Testing for Google Buildathon judging? Skip the signup form and enter directly with the pre-authenticated single-tenant demo account (<strong>Abhishek UthukotaSriram</strong>) pre-linked to PayPal Sandbox rails.
            </p>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isDemoLoading || submitting}
              className="w-full py-2.5 px-4 bg-[#0070BA] hover:bg-[#005ea6] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isDemoLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Evaluator Session...</span>
                </>
              ) : (
                <>
                  <span>⚡ 1-Click Evaluator Sign-In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Title / Description */}
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {mode === 'signup' ? 'Register New Merchant Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'signup'
                  ? 'Access agentic purchase execution with authenticated cookie sessions.'
                  : 'Log in to continue managing agent negotiations and order authorizations.'}
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Dynamic Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Jane Smith"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0070BA]/20 focus:border-[#0070BA] transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Work / Developer Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0070BA]/20 focus:border-[#0070BA] transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  {mode === 'signup' && password && (
                    <span className="text-[10px] font-semibold text-slate-500">
                      Strength:{' '}
                      <strong className={strength.score >= 3 ? 'text-emerald-600' : 'text-amber-600'}>
                        {strength.label}
                      </strong>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0070BA]/20 focus:border-[#0070BA] transition-all text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator Bar (Signup Only) */}
                {mode === 'signup' && password && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          step <= strength.score ? strength.color : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0070BA]/20 focus:border-[#0070BA] transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Security Pill */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-[11px] text-slate-600">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Bcrypt 256-bit hashed credentials • Secure <code className="font-mono text-[10px] bg-slate-200 px-1 py-0.5 rounded">httpOnly</code> session cookies.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || isDemoLoading}
                className="w-full py-3 px-4 bg-[#0070BA] hover:bg-[#005ea6] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{mode === 'signup' ? 'Creating Account...' : 'Authenticating...'}</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Complete Registration & Open Studio' : 'Sign In to PayPilot Studio'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Switch Text */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {mode === 'signup' ? 'Already registered?' : 'Need a new account?'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signup' ? 'login' : 'signup');
                  setError(null);
                }}
                className="font-bold text-[#0070BA] hover:underline cursor-pointer"
              >
                {mode === 'signup' ? 'Sign In Instead →' : 'Register Here →'}
              </button>
            </div>
          </div>

          {/* Guest Sandbox Bypass Link */}
          <div className="text-center mt-5">
            <Link
              href="/studio"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              <span>Explore Studio as Guest Shopper</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
