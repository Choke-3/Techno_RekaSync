import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { ViewType } from '../types';
import { registerUser } from '../lib/supabase';

interface SignUpProps {
  onNavigate: (view: ViewType) => void;
  onSignUpSuccess: (user: { name: string; email: string; avatarUrl: string }) => void;
  onNotify: (msg: string, title?: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function SignUp({ onNavigate, onSignUpSuccess, onNotify }: SignUpProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      onNotify('Please declare your Name, Email, and Password.', 'Form incomplete', 'warning');
      return;
    }
    if (!agreed) {
      onNotify('You must accept the terms of service to create your creative workspace.', 'Agreement Needed', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const data = await registerUser(email, password, fullName);
      
      if (data.session) {
        // If auto-authenticated (e.g. Email confirmation disabled)
        onSignUpSuccess({
          name: fullName,
          email: email,
          avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR3ShdSe3XCmjYV0bcDQuSudSlNvQL-Y9u5NfaZOg2RdciLLS99iLZrNmSHaoEH9iPC6oz48jpOyKbCSIKJGV6mS8bLFuZ5exJIcHaNnP-UPvkUTCVkZD1NBIhLQZQPSCcGdcNu3G78FRmirs8Pj6m1xU-r8RC3t_4G-XC6JPOkjvcwfyAcKr__sSwlOS3CpMEVWua0KpOZK05gGG8C3yjkAUiY9ahs9jrIBl6mz90ObxFeeajXUaLVuTL89gtpmxmBlWyBAeIz_w'
        });
        onNotify(`Account created successfully! Welcome to RekaSync, ${fullName}.`, 'Workspace Provisioned', 'success');
        onNavigate('dashboard');
      } else {
        // If email verification link is required by your Supabase project settings
        onNotify(`Registration completed! Please check your email inbox at ${email} to activate your workspace before signing in.`, 'Verification Sent', 'info');
        onNavigate('signin');
      }
    } catch (err: any) {
      console.error('Supabase Sign Up Error:', err);
      onNotify(err.message || 'Failed to create your credentials. Please try again.', 'Registration Failed', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    onSignUpSuccess({
      name: 'Alexander Morgan',
      email: 'alexander.morgan@rekasync.io',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR3ShdSe3XCmjYV0bcDQuSudSlNvQL-Y9u5NfaZOg2RdciLLS99iLZrNmSHaoEH9iPC6oz48jpOyKbCSIKJGV6mS8bLFuZ5exJIcHaNnP-UPvkUTCVkZD1NBIhLQZQPSCcGdcNu3G78FRmirs8Pj6m1xU-r8RC3t_4G-XC6JPOkjvcwfyAcKr__sSwlOS3CpMEVWua0KpOZK05gGG8C3yjkAUiY9ahs9jrIBl6mz90ObxFeeajXUaLVuTL89gtpmxmBlWyBAeIz_w'
    });
    onNotify('Workspace mapped to Google standard account credentials.', 'Google Sign Up Complete', 'success');
    onNavigate('dashboard');
  };


  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-24 pb-12 text-on-surface">
      {/* Decorative gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary opacity-5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary opacity-[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[480px] z-10 space-y-6">
        <div className="glass-card rounded-2xl p-8 shadow-2xl relative">
          <div className="text-center mb-6 space-y-1">
            <h1 className="font-headline font-black text-2.5xl md:text-3.5xl text-on-surface tracking-tight">
              Join RekaSync
            </h1>
            <p className="text-xs text-on-surface-variant font-medium">The professional playground for designers.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface block">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                <input 
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="John Doe" 
                  type="text"
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-colors text-xs font-sans"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                <input 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  type="email"
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-colors text-xs font-sans"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                <input 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  type="password"
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-colors text-xs font-sans"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5 py-1">
              <input 
                required
                id="terms" 
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4.5 h-4.5 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary focus:ring-offset-surface cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-on-surface-variant leading-relaxed select-none cursor-pointer">
                I agree to the <button type="button" onClick={() => onNavigate('privacy')} className="text-primary hover:underline bg-transparent border-none p-0 cursor-pointer">Terms and Privacy Policy</button>
              </label>
            </div>

            {/* Primary CTA */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-on-primary font-bold text-xs py-3.5 rounded-xl transition-all hover:translate-y-[-1px] active:scale-95 shadow-md shadow-primary/20 hover:brightness-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-on-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Provisioning Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            {/* Divider */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/60" />
              </div>
              <span className="bg-surface-container-high px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider relative">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Social Buttons */}
            <button 
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-2 border border-outline-variant py-2.5 rounded-xl hover:bg-surface-variant transition-colors text-xs font-bold text-on-surface cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="currentColor" />
              </svg>
              Google
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-on-surface-variant font-semibold">
              Already have an account? 
              <button 
                onClick={() => onNavigate('signin')} 
                className="text-primary font-bold hover:underline ml-1.5 cursor-pointer bg-transparent border-none"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
