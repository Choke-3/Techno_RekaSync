import React, { useState } from 'react';
import { ViewType } from '../types';

interface SignInProps {
  onNavigate: (view: ViewType) => void;
  onSignInSuccess: (user: { name: string; email: string; avatarUrl: string }) => void;
  onNotify: (msg: string, title?: string) => void;
}

export default function SignIn({ onNavigate, onSignInSuccess, onNotify }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      onNotify('Please supply your email address.', 'Input required');
      return;
    }
    
    // Perform standard signin
    const name = email.split('@')[0];
    const friendlyName = name.charAt(0).toUpperCase() + name.slice(1);
    
    onSignInSuccess({
      name: friendlyName || 'Alexander Morgan',
      email: email,
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR3ShdSe3XCmjYV0bcDQuSudSlNvQL-Y9u5NfaZOg2RdciLLS99iLZrNmSHaoEH9iPC6oz48jpOyKbCSIKJGV6mS8bLFuZ5exJIcHaNnP-UPvkUTCVkZD1NBIhLQZQPSCcGdcNu3G78FRmirs8Pj6m1xU-r8RC3t_4G-XC6JPOkjvcwfyAcKr__sSwlOS3CpMEVWua0KpOZK05gGG8C3yjkAUiY9ahs9jrIBl6mz90ObxFeeajXUaLVuTL89gtpmxmBlWyBAeIz_w'
    });
    
    onNotify(`Welcome back, ${friendlyName}! You are signed in to your workspace.`, 'Sign In Successful');
    onNavigate('dashboard');
  };

  const handleGoogleSignIn = () => {
    onSignInSuccess({
      name: 'Alexander Morgan',
      email: 'alexander.morgan@rekasync.io',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR3ShdSe3XCmjYV0bcDQuSudSlNvQL-Y9u5NfaZOg2RdciLLS99iLZrNmSHaoEH9iPC6oz48jpOyKbCSIKJGV6mS8bLFuZ5exJIcHaNnP-UPvkUTCVkZD1NBIhLQZQPSCcGdcNu3G78FRmirs8Pj6m1xU-r8RC3t_4G-XC6JPOkjvcwfyAcKr__sSwlOS3CpMEVWua0KpOZK05gGG8C3yjkAUiY9ahs9jrIBl6mz90ObxFeeajXUaLVuTL89gtpmxmBlWyBAeIz_w'
    });
    onNotify('Signed in with Google standard single sign-on.', 'Google Auth Complete');
    onNavigate('dashboard');
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 pb-12 text-on-surface">
      {/* Decorative environment background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary opacity-5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary opacity-[0.03] blur-[120px] rounded-full" />
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[440px] glass-card p-8 md:p-10 rounded-2xl z-10 transition-all duration-300 transform hover:translate-y-[-2px] animate-fade-in space-y-6">
        <div className="flex flex-col items-center text-center space-y-1">
          <h1 className="font-headline font-black text-3xl text-on-surface tracking-tight">
            RekaSync
          </h1>
          <p className="text-xs text-on-surface-variant font-medium">Enter your credentials to access your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant ml-1">Email Address</label>
            <input 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com" 
              type="email"
              className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline text-sm font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-on-surface-variant">Password</label>
              <button 
                type="button" 
                onClick={() => onNotify('Password recovery email has been sent to your registered address.', 'Reset Link Dispatched')}
                className="text-primary text-[11px] font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <input 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              type="password"
              className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline text-sm font-sans"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-on-primary font-bold text-xs py-3.5 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-primary/10"
          >
            Sign In
          </button>
        </form>

        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/60" />
          </div>
          <span className="relative px-3 bg-surface-container text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Or continue with
          </span>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border border-outline-variant rounded-xl py-2.5 text-xs font-bold hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer"
        >
          {/* Flat SVG Google Logo */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path d="M12 5.04c1.94 0 3.51.68 4.75 1.74l3.59-3.59C17.85 1.19 15.11 0 12 0 7.31 0 3.25 2.67 1.21 6.6l4.21 3.27C6.43 6.96 8.99 5.04 12 5.04z" fill="#EA4335" />
            <path d="M23.49 12.27c0-.86-.07-1.68-.22-2.48H12v4.69h6.48c-.28 1.48-1.11 2.73-2.36 3.58l3.66 2.84c2.14-1.98 3.37-4.89 3.37-8.63z" fill="#4285F4" />
            <path d="M5.42 15.13c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18L1.21 7.5c-.77 1.51-1.21 3.21-1.21 5s.44 3.49 1.21 5l4.21-3.37z" fill="#FBBC05" />
            <path d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.66-2.84c-1.11.75-2.53 1.19-4.29 1.19-3.01 0-5.57-2.03-6.48-4.77l-4.21 3.37C3.25 21.33 7.31 24 12 24z" fill="#34A853" />
          </svg>
          Google
        </button>
      </div>

      <p className="mt-6 text-on-surface-variant text-xs font-semibold z-10">
        Don&apos;t have an account? 
        <button 
          onClick={() => onNavigate('signup')} 
          className="text-primary font-bold hover:underline ml-1.5 cursor-pointer bg-transparent border-none"
        >
          Get Started Free
        </button>
      </p>
    </main>
  );
}
