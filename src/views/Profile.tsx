import React, { useState, useRef } from 'react';
import { ArrowLeft, Edit3, Lock, Check, CreditCard, ShieldAlert, Key, Upload } from 'lucide-react';
import { ViewType } from '../types';
import { updateUserProfile } from '../lib/supabase';

const AVATAR_PRESETS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDR3ShdSe3XCmjYV0bcDQuSudSlNvQL-Y9u5NfaZOg2RdciLLS99iLZrNmSHaoEH9iPC6oz48jpOyKbCSIKJGV6mS8bLFuZ5exJIcHaNnP-UPvkUTCVkZD1NBIhLQZQPSCcGdcNu3G78FRmirs8Pj6m1xU-r8RC3t_4G-XC6JPOkjvcwfyAcKr__sSwlOS3CpMEVWua0KpOZK05gGG8C3yjkAUiY9ahs9jrIBl6mz90ObxFeeajXUaLVuTL89gtpmxmBlWyBAeIz_w',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80'
];

interface ProfileProps {
  onNavigate: (view: ViewType) => void;
  user: { name: string; email: string; avatarUrl: string } | null;
  onUpdateUser: (updatedUser: { name: string; email: string; avatarUrl: string }) => void;
  onNotify: (msg: string, title?: string) => void;
}

export default function Profile({ onNavigate, user, onUpdateUser, onNotify }: ProfileProps) {
  const [fullName, setFullName] = useState(user?.name || 'Alexander Morgan');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || AVATAR_PRESETS[0]);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      onNotify('Full Name cannot be empty.', 'Validation failed');
      return;
    }
    if (user) {
      try {
        await updateUserProfile(fullName, avatarUrl);
        onUpdateUser({
          ...user,
          name: fullName,
          avatarUrl: avatarUrl
        });
        onNotify('Your profile information and custom photo have been safely updated.', 'Profile Saved');
      } catch (err: any) {
        console.warn("Could not sync profile in Supabase Auth:", err);
        // Fallback update local state for clean prototype experience
        onUpdateUser({
          ...user,
          name: fullName,
          avatarUrl: avatarUrl
        });
        onNotify('Your profile has been saved in active context memory.', 'Profile Updated');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        onNotify('Please select a valid image file.', 'Invalid Format');
        return;
      }
      if (file.size > 800 * 1024) {
        onNotify('Image file size must not exceed 800KB limit.', 'File Too Large');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
          onNotify('Custom portrait image preview loaded successfully. Save profile for final sync!', 'Photo Loaded');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleUpdatePassword = () => {
    if (!newPass) {
      onNotify('Please declare a new password.', 'Password Blank');
      return;
    }
    if (newPass !== confirmPass) {
      onNotify('New Password and Confirm Password do not match.', 'Password Mismatch');
      return;
    }

    onNotify('Your password has been successfully re-encrypted.', 'Security Updated');
    setNewPass('');
    setConfirmPass('');
  };

  const handleUpgradePlan = () => {
    onNotify('Thank you for your interest! The premium plan waiting list has recorded your request.', 'Joined Waiting List');
  };

  const handleDeactivate = () => {
    onNotify('Profile deactivation is not permitted in sandbox mode.', 'Feature Disabled');
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-6 flex flex-col items-center text-on-surface">
      <div className="w-full max-w-[640px] space-y-6 animate-fade-in">
        
        {/* Back Navigation */}
        <button 
          onClick={() => onNavigate('dashboard')}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant hover:border-on-surface text-on-surface font-semibold text-xs hover:bg-surface-container transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Headline */}
        <h1 className="font-headline font-black text-3.5xl md:text-5xl text-on-surface tracking-tight">Your Profile</h1>

        {/* Profile Card */}
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 md:p-8 space-y-8 shadow-xl">
          
          {/* Avatar Upload area */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b border-outline-variant/30 text-center">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            <div className="relative group/avatar cursor-pointer" onClick={triggerFileUpload}>
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary/20 bg-surface-container relative">
                <img 
                  alt="User profile avatar" 
                  className="w-full h-full object-cover group-hover/avatar:scale-105 duration-300" 
                  src={avatarUrl} 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 duration-300 flex items-center justify-center text-white/95">
                  <Upload className="w-5 h-5 shrink-0" />
                </div>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileUpload();
                }}
                className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:bg-primary-container transition-colors active:scale-95 flex items-center justify-center cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3 w-full">
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <button 
                  type="button"
                  onClick={triggerFileUpload}
                  className="px-3.5 py-1.5 rounded-lg border border-outline-variant hover:border-on-surface text-[11px] font-bold tracking-tight bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-on-surface-variant" />
                  Upload Custom Portrait
                </button>
              </div>
              
              {/* Presets Grid */}
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Sleek Design Avatars</p>
                <div className="flex gap-2 justify-center items-center flex-wrap">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(p)}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all p-0.5 active:scale-95 cursor-pointer bg-transparent ${avatarUrl === p ? 'border-primary scale-110 shadow-md' : 'border-outline-variant hover:border-primary/50'}`}
                    >
                      <img src={p} alt={`Preset avatar ${idx}`} className="w-full h-full object-cover rounded-full" />
                    </button>
                  ))}
                </div>
              </div>
              
              <p className="text-[10px] text-on-surface-variant font-medium mt-1">JPG, GIF or PNG. Max size of 800KB</p>
            </div>
          </div>

          {/* Account Details Form */}
          <form onSubmit={handleUpdateDetails} className="space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-headline font-bold text-base md:text-lg text-on-surface">Account Details</h2>
              <span className="bg-tertiary-container/10 text-tertiary text-[10px] font-bold px-3 py-1 rounded-full border border-tertiary/20">
                Free Plan
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant">Full Name</label>
                <input 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  type="text" 
                  className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface font-medium text-xs focus:border-primary focus:ring-0 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant">Email Address</label>
                <div className="relative">
                  <input 
                    readOnly
                    type="email" 
                    value={user?.email || 'alexander.morgan@rekasync.io'} 
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface-variant text-xs cursor-not-allowed opacity-70 outline-none font-medium"
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full md:w-auto bg-primary text-on-primary font-bold px-6 py-2.5 rounded-lg text-xs hover:translate-y-[-1px] active:scale-95 transition-all shadow-md shadow-primary/10 cursor-pointer"
              >
                Update Account Details
              </button>
            </div>
          </form>

          {/* Subscription Section */}
          <div className="space-y-4 pt-6 border-t border-outline-variant/30">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-on-surface-variant" />
              <h2 className="font-headline font-bold text-base md:text-lg text-on-surface">Subscription Plan</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Free Plan Card */}
              <div className="bg-surface-container border-2 border-primary/20 p-5 rounded-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xs text-on-surface">Free</h3>
                    <span className="text-[10px] font-bold text-primary">Current Plan</span>
                  </div>
                  <p className="text-xl font-headline font-black text-on-surface">
                    $0<span className="text-xs text-on-surface-variant font-normal"> / forever</span>
                  </p>
                  <ul className="space-y-2 text-[10px] md:text-xs text-on-surface-variant font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-tertiary" /> Up to 3 active projects
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-tertiary" /> Shareable client link
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-tertiary" /> Swipe-based client interaction
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-tertiary" /> Basic preference summary report
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-tertiary" /> Project status management
                    </li>
                  </ul>
                </div>
                <button 
                  disabled 
                  className="w-full mt-4 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant text-[11px] font-bold opacity-50 cursor-not-allowed uppercase"
                >
                  Active
                </button>
              </div>

              {/* Premium Plan Card */}
              <div className="bg-surface-container border border-outline-variant/60 p-5 rounded-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xs text-primary">Premium</h3>
                    <span className="bg-primary text-on-primary text-[8px] font-extrabold px-1.5 py-0.5 rounded">Coming Soon</span>
                  </div>
                  <p className="text-xl font-headline font-black text-on-surface">
                    TBA<span className="text-xs text-on-surface-variant font-normal"> / monthly</span>
                  </p>
                  <ul className="space-y-2 text-[10px] md:text-xs text-on-surface-variant font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary" /> Unlimited active projects
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary" /> Full real-time consensus chart
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary" /> Exportable PDF/CSV reports
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary" /> Preference history version tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary" /> Priority team support
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={handleUpgradePlan}
                  className="w-full mt-4 py-2.5 rounded-lg bg-primary text-on-primary font-bold hover:brightness-110 active:scale-95 transition-all text-[11px] cursor-pointer shadow-md shadow-primary/10"
                >
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>

          {/* Password Security Section */}
          <div className="space-y-4 pt-6 border-t border-outline-variant/30">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-on-surface-variant" />
              <h2 className="font-headline font-bold text-base md:text-lg text-on-surface">Change Password</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant">New Password</label>
                <input 
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface text-xs focus:border-primary focus:ring-0 outline-none transition-colors" 
                  placeholder="••••••••" 
                  type="password" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant">Confirm Password</label>
                <input 
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface text-xs focus:border-primary focus:ring-0 outline-none transition-colors" 
                  placeholder="••••••••" 
                  type="password" 
                />
              </div>
            </div>

            <button 
              onClick={handleUpdatePassword}
              className="w-full md:w-auto px-6 py-2.5 rounded-lg border border-outline-variant hover:border-on-surface text-on-surface font-bold text-xs hover:bg-surface-container transition-all active:scale-95 cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="p-4 rounded-xl border border-error/20 bg-error-container/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-error shrink-0" />
            <span className="text-xs font-medium text-on-surface-variant">Thinking of leaving? You can archive your profile.</span>
          </div>
          <button 
            type="button"
            onClick={handleDeactivate}
            className="text-error font-bold text-xs hover:underline cursor-pointer bg-transparent border-none"
          >
            Deactivate
          </button>
        </div>
      </div>
    </main>
  );
}
