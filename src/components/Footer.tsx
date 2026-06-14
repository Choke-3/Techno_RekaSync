import { ViewType } from '../types';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full py-12 px-6 flex flex-col items-center gap-4 bg-surface-container-lowest border-t border-outline-variant/60">
      <div className="flex flex-col items-center gap-1">
        <span 
          onClick={() => onNavigate('landing')}
          className="text-lg md:text-xl font-black font-headline text-on-surface hover:text-primary transition-colors cursor-pointer"
        >
          RekaSync
        </span>
        <p className="text-xs text-on-surface-variant font-medium">The feedback tool built for precision designers.</p>
      </div>
      <div className="flex gap-6 my-2 text-xs font-semibold text-on-surface-variant">
        <button onClick={() => onNavigate('privacy')} className="hover:text-primary transition-colors cursor-pointer">
          Privacy Policy
        </button>
        <button onClick={() => onNavigate('landing')} className="hover:text-primary transition-colors cursor-pointer">
          Terms of Service
        </button>
        <button onClick={() => onNavigate('landing')} className="hover:text-primary transition-colors cursor-pointer">
          Contact Support
        </button>
      </div>
      <p className="text-[10px] text-on-surface-variant opacity-80 mt-2">
        © 2026 RekaSync. All rights reserved. Made by designers for designers.
      </p>
    </footer>
  );
}
