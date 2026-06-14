import { Bell, LogOut, User, LayoutGrid, Sparkles } from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  user: { name: string; email: string; avatarUrl: string } | null;
  onSignOut: () => void;
  unreadCount: number;
  onToggleNotifications: () => void;
}

export default function Header({
  currentView,
  onNavigate,
  user,
  onSignOut,
  unreadCount,
  onToggleNotifications
}: HeaderProps) {
  // Navigation active styles
  const activeClass = "text-primary border-b-2 border-primary py-1 font-bold";
  const inactiveClass = "text-on-surface-variant hover:text-on-surface transition-colors py-1";

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-16 bg-surface-container/90 backdrop-blur-md border-b border-outline-variant/60">
      <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">
        {/* Brand identity */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-xl md:text-2xl font-black font-headline text-on-surface tracking-tight flex items-center gap-1.5">
            RekaSync
            <span className="w-2 h-2 rounded-full bg-tertiary group-hover:scale-125 transition-transform duration-300"></span>
          </span>
        </div>

        {/* Navigation tabs */}
        <nav className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <button 
                onClick={() => onNavigate('dashboard')} 
                className={currentView === 'dashboard' || currentView === 'project-detail' ? activeClass : inactiveClass}
              >
                Dashboard
              </button>
              <button 
                onClick={() => onNavigate('profile')} 
                className={currentView === 'profile' ? activeClass : inactiveClass}
              >
                Profile
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('landing')} 
                className={currentView === 'landing' ? activeClass : inactiveClass}
              >
                Explore
              </button>
            </>
          )}
          <button 
            onClick={() => onNavigate('privacy')} 
            className={currentView === 'privacy' ? activeClass : inactiveClass}
          >
            Privacy
          </button>
        </nav>

        {/* User profile / Auth buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Notification icon */}
              <button 
                onClick={onToggleNotifications}
                className="relative p-2 rounded-lg hover:bg-surface-container-high transition-colors active:scale-95 group"
                aria-label="Toggle notifications"
              >
                <Bell className="w-5 h-5 text-on-surface hover:text-primary transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-error text-[10px] font-bold text-on-error">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Avatar Dropdown */}
              <div className="relative group/avatar">
                <button className="flex items-center gap-1 p-0.5 rounded-full border border-outline-variant hover:border-primary transition-all">
                  <img 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full object-cover" 
                    src={user.avatarUrl} 
                  />
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-surface-container-high rounded-xl shadow-2xl border border-outline-variant opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-outline-variant mb-1">
                    <p className="text-xs text-on-surface font-semibold truncate">{user.name}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => onNavigate('profile')}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-on-surface hover:bg-surface-variant transition-colors"
                  >
                    <User className="w-4 h-4 text-primary" /> Profile
                  </button>
                  <button 
                    onClick={() => {
                      onSignOut();
                      onNavigate('landing');
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-error hover:bg-surface-variant transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-error" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate('signin')} 
                className="text-xs font-semibold px-4 py-2 text-on-surface hover:text-primary transition-colors active:scale-95"
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('signup')} 
                className="text-xs bg-primary text-on-primary font-bold px-4 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/10"
              >
                Get Started Free
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
