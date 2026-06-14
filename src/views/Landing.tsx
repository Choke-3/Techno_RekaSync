import { ArrowRight, PlusCircle, Share2, ClipboardList, Zap, ShieldAlert, LayoutGrid, BarChart3, Check } from 'lucide-react';
import { ViewType } from '../types';

interface LandingProps {
  onNavigate: (view: ViewType) => void;
  onSetDemoProject: () => void;
}

export default function Landing({ onNavigate, onSetDemoProject }: LandingProps) {
  return (
    <div className="pt-20 pb-16 animate-fade-in text-on-surface">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Ambient radial lighting */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(189, 194, 255, 0.08) 0%, transparent 60%)'
          }}
        />

        <div className="max-w-4xl mx-auto px-6 text-center z-10 space-y-8 py-16">
          <h1 className="text-4xl md:text-6xl font-black font-headline text-on-surface tracking-tight leading-tighter">
            Stop guessing what your client wants.
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Designers lose hours to revision rounds. RekaSync replaces scattered WhatsApp messages with a streamlined swipe-to-approve interface for instant feedback.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => onNavigate('signup')}
              className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold text-sm hover:translate-y-[-2px] transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('how-it-works');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto border border-outline-variant text-on-surface px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer"
            >
              How it works
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-surface-container-lowest border-y border-outline-variant/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">How it works</h2>
            <p className="text-sm text-on-surface-variant font-medium">Simple by design for professional workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl group hover:border-primary transition-all duration-300">
              <div className="w-12 h-12 bg-primary-container/15 rounded-xl flex items-center justify-center mb-6 border border-primary-container/20">
                <PlusCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface mb-3">Create project</h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Upload your design assets to a dedicated dashboard in seconds. Organize by versions, concepts, or style palettes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl group hover:border-tertiary transition-all duration-300">
              <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center mb-6 border border-tertiary/20">
                <Share2 className="w-6 h-6 text-tertiary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface mb-3">Share link</h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Send a unique, secure link to your client. No registration, login, or app download required for them to begin swiping.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl group hover:border-secondary transition-all duration-300">
              <div className="w-12 h-12 bg-secondary/15 rounded-xl flex items-center justify-center mb-6 border border-secondary/20">
                <ClipboardList className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface mb-3">Get summary</h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Clients swipe right to approve or left to skip. Receive a prioritized consensus report of their aesthetic preferences immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why RekaSync Section (Bento Grid) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-left max-w-xl">
            <h2 className="text-2xl md:text-3.5xl font-black font-headline text-on-surface">Why RekaSync</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bento Box 1 - Swipe Selection */}
            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl flex flex-col justify-between group hover:border-primary transition-all duration-300">
              <div className="space-y-4">
                <Zap className="w-10 h-10 text-tertiary mb-2" />
                <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface">Swipe selection</h3>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  An intuitive feed for design feedback. Reduce cognitive load and get clear decisions from busy, visual-minded clients.
                </p>
              </div>
              <div className="mt-8 overflow-hidden rounded-xl border border-outline-variant select-none">
                <img 
                  className="w-full h-48 object-cover object-center group-hover:scale-[1.02] duration-500" 
                  alt="Sleek dark-themed mobile interaction"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNWtbhhIxmArQ4RTQTmP48Pdf0xVjE4vkdJ7s3HqJjt5W09AxEFmsiIwbrxd2ziJrhmiCx0SQnIqwUpelBaZvbE8Kyk1r-Sb1_LX5WLhLfQ04BFDC9HF-2l1YtupoyMqulKaZ8_KxMESgsMH_ifG48KwrED0kTvqw04ATjxbjaeGAr9D0KDxOXvqiHe6BINhUyMH06vf-04kGguePzIWOGlQLZmkrc2qw9eAkEUglK8-fEsv91fu43WsgO9QCKOdqGVPmJKEI2EAc"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Bento Box 2 - No Login */}
            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl flex flex-col justify-between group hover:border-primary transition-all duration-300">
              <div className="space-y-4">
                <ShieldAlert className="w-10 h-10 text-primary mb-2" />
                <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface">No login friction</h3>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  Zero friction setup for clients. They click the link and start reviewing style surveys immediately. High completion rates guaranteed.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="h-32 bg-surface-container-high border border-outline-variant rounded-xl flex items-center justify-center">
                  <span className="font-headline font-bold text-xs text-on-surface-variant tracking-wider uppercase">Direct Link</span>
                </div>
                <div className="h-32 bg-surface-container-high border border-outline-variant rounded-xl flex items-center justify-center">
                  <span className="text-tertiary font-headline font-bold text-xs tracking-wider uppercase">Swipe Active</span>
                </div>
              </div>
            </div>

            {/* Bento Box 3 - Centralised dashboard */}
            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl flex items-start gap-4 hover:border-secondary transition-all">
              <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20">
                <LayoutGrid className="w-6 h-6 text-secondary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base md:text-lg font-bold font-headline text-on-surface">Centralised dashboard</h3>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  Stop hunting for scattered feedback emails. View all project statuses, live surveys, client metrics, and revision timelines in one unified terminal.
                </p>
              </div>
            </div>

            {/* Bento Box 4 - Analytics */}
            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl flex items-start gap-4 hover:border-error transition-all">
              <div className="p-3 bg-error-container/10 rounded-xl border border-error/20">
                <BarChart3 className="w-6 h-6 text-error" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base md:text-lg font-bold font-headline text-on-surface">Preference analytics</h3>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  Track which styles get the most engagement. Analyze client consensus models in real-time to nail first-draft direction vectors instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-surface-container-lowest border-t border-outline-variant/40">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center">
            <h2 className="text-2xl md:text-3.5xl font-black font-headline text-on-surface">Simple Pricing</h2>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
            {/* Free Card */}
            <div className="flex-1 bg-surface-container border border-outline-variant/60 p-8 md:p-10 rounded-2xl hover:translate-y-[-2px] transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface">Free</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl md:text-4.5xl font-headline font-black text-on-surface">$0</span>
                  <span className="text-xs text-on-surface-variant font-medium">/ forever</span>
                </div>
              </div>
              <ul className="space-y-3.5 mb-8 text-xs md:text-sm text-on-surface-variant font-medium">
                <li className="flex items-center gap-3">
                  <Check className="w-4.5 h-4.5 text-tertiary" /> Up to 3 active projects
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4.5 h-4.5 text-tertiary" /> Shareable client link
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4.5 h-4.5 text-tertiary" /> Swipe-based client interaction
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4.5 h-4.5 text-tertiary" /> Basic preference summary report
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4.5 h-4.5 text-tertiary" /> Project status management
                </li>
              </ul>
              <button 
                onClick={() => onNavigate('signup')}
                className="w-full py-3 border border-primary text-primary font-bold text-xs rounded-lg hover:bg-primary/10 transition-colors active:scale-95 cursor-pointer"
              >
                Start Free
              </button>
            </div>

            {/* Premium Card */}
            <div className="flex-1 bg-surface-container border-2 border-primary p-8 md:p-10 rounded-2xl relative hover:translate-y-[-2px] transition-all duration-300">
              <div className="absolute top-4 right-4 bg-primary text-on-primary text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full">
                Coming Soon
              </div>
              <div className="mb-6">
                <h3 className="text-lg md:text-xl font-bold font-headline text-primary">Premium</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl md:text-4.5xl font-headline font-black text-on-surface">TBA</span>
                  <span className="text-xs text-on-surface-variant font-medium">/ monthly</span>
                </div>
              </div>
              <ul className="space-y-3.5 mb-8 text-xs md:text-sm text-on-surface-variant font-medium">
                <li className="flex items-center gap-3">
                  <Check className="w-4.5 h-4.5 text-primary" /> Unlimited active projects
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4.5 h-4.5 text-primary" /> Full real-time consensus chart
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4.5 h-4.5 text-primary" /> Exportable PDF/CSV reports
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4.5 h-4.5 text-primary" /> Preference history version tracking
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4.5 h-4.5 text-primary" /> Priority team support
                </li>
              </ul>
              <button 
                onClick={() => onNavigate('signup')}
                className="w-full py-3 bg-primary text-on-primary font-bold text-xs rounded-lg hover:brightness-110 transition-all active:scale-95 shadow-md shadow-primary/10 cursor-pointer"
              >
                Join Waiting List
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
