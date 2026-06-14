import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ExternalLink, Database, AlertCircle, Info } from 'lucide-react';
import { SUPABASE_SETUP_SQL } from '../lib/supabase';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'testing' | 'connected' | 'error';
  errorMessage: string | null;
  onRetry?: () => void;
  onSeedSample?: () => void;
  onWipeDatabase?: () => void;
}

export default function SupabaseSyncModal({
  isOpen,
  onClose,
  status,
  errorMessage,
  onRetry,
  onSeedSample,
  onWipeDatabase
}: SupabaseSyncModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const metaEnv = (import.meta as any).env || {};
  const cleanUrl = (metaEnv.VITE_SUPABASE_URL || 'https://yjrudxwphpcofycwbivp.supabase.co').replace(/\/rest\/v1\/?$/, '');


  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
      {/* Overlay Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-md"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-surface-container border border-outline-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in select-none">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-outline-variant flex items-center justify-between bg-surface-container sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-on-surface">Supabase Database Ledger</h2>
              <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Automated synchronization setup and control panel.</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status Indicator */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Sync Connection Status</h3>
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              status === 'connected' 
                ? 'bg-tertiary/5 border-tertiary/20 text-on-surface' 
                : status === 'testing' 
                ? 'bg-surface-container-low border-outline-variant/30 text-on-surface'
                : 'bg-error/5 border-error/20 text-on-surface'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 ${
                  status === 'connected' ? 'bg-tertiary/15 text-tertiary' : status === 'testing' ? 'bg-surface-container-high text-on-surface-variant' : 'bg-error/15 text-error'
                }`}>
                  <Database className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm font-headline">
                      {status === 'connected' ? 'Connected & Synchronized' : status === 'testing' ? 'Testing Connection...' : 'Database Action Required'}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      status === 'connected' ? 'bg-tertiary animate-pulse' : status === 'testing' ? 'bg-outline-variant animate-pulse' : 'bg-error animate-pulse'
                    }`} />
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed max-w-md font-medium">
                    {status === 'connected' 
                      ? 'RekaSync is bound to your Supabase cloud space. Any additions, purges, or design client swipes sync fully in real-time!'
                      : status === 'testing' 
                      ? 'Pinging your Supabase cluster REST endpoint safely with anonymous authorization headers...'
                      : 'We detected a REST network connection but the tables "reka_projects" and "reka_style_assets" do not exist. Seed them now!'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:self-center">
                {status === 'error' && (
                  <span className="text-[10px] font-black tracking-wider uppercase bg-error/15 text-error px-2.5 py-1 rounded-full border border-error/20 text-center">
                    Tables Missing
                  </span>
                )}
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    disabled={status === 'testing'}
                    className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-on-primary text-[10px] font-black tracking-wide uppercase rounded-lg transition-all active:scale-95 shadow-sm space-x-1 cursor-pointer"
                  >
                    {status === 'testing' ? 'Verifying...' : 'Verify & Connect'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Configuration Parameters */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Active Credentials</h3>
            <div className="p-4 bg-surface-container-low border border-outline-variant/40 rounded-xl space-y-3 font-mono text-[11px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-outline-variant/30 pb-2.5">
                <span className="text-on-surface-variant font-semibold select-all">Project URL:</span>
                <span className="text-on-surface font-semibold truncate max-w-sm select-all">{cleanUrl}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="text-on-surface-variant font-semibold select-all">Anon Public Key:</span>
                <span className="text-on-surface font-semibold truncate max-w-sm tracking-tighter select-all">{metaEnv.VITE_SUPABASE_ANON_KEY ? 'VITE_SUPABASE_ANON_KEY (Loaded)' : 'Anon Token (Embedded)'}</span>
              </div>
            </div>
          </div>

          {/* Data State Control Panel */}
          {status === 'connected' && (
            <div className="space-y-2 animate-fade-in">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> Workspace Reset & Control Panel
              </h3>
              <div className="p-4 bg-surface-container-low border border-outline-variant/40 rounded-xl space-y-4">
                <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
                  Start with a clean workbench! Trigger a hard reset sequence to empty all live database rows or re-seed starter templates safely.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {onWipeDatabase && (
                    <button
                      type="button"
                      onClick={onWipeDatabase}
                      className="px-4 py-2.5 bg-error hover:bg-error/90 text-white text-[11px] font-black tracking-wider uppercase rounded-xl transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      Wipe All Projects & Start Fresh
                    </button>
                  )}
                  {onSeedSample && (
                    <button
                      type="button"
                      onClick={onSeedSample}
                      className="px-4 py-2.5 bg-secondary/10 hover:bg-secondary/25 text-secondary border border-secondary/20 text-[11px] font-black tracking-wider uppercase rounded-xl transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      Seed Demo Style Boards
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step-by-Step Instructions */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Table Creation Steps
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-1">
                <span className="text-xs font-black text-primary">01. Open Supabase</span>
                <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                  Go to your Supabase dashboard at <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold inline-flex items-center gap-0.5">dashboard <ExternalLink className="w-2.5 h-2.5" /></a> and select project <strong>yjrudxwphpcofycwbivp</strong>.
                </p>
              </div>
              <div className="p-3 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-1">
                <span className="text-xs font-black text-primary">02. Click SQL Editor</span>
                <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                  Locate the <strong>SQL Editor</strong> tab in your left navigation menu, and click <strong>"New Query"</strong> to open a clean draft worksheet.
                </p>
              </div>
              <div className="p-3 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-1">
                <span className="text-xs font-black text-primary">03. Run the Script</span>
                <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                  Copy the code below, paste it directly into the console worksheet, and trigger the <strong>"Run"</strong> button to deploy the database schema.
                </p>
              </div>
            </div>
          </div>

          {/* SQL Editor Code Block */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-primary" /> Setup PostgreSQL Query
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 bg-surface-container-high border border-outline-variant rounded-lg text-xs font-bold text-primary hover:text-on-surface transition-all active:scale-95 cursor-pointer hover:bg-surface-container-highest"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-tertiary" />
                    <span className="text-tertiary">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="relative">
              <pre className="p-4 bg-surface-container-low border border-outline-variant rounded-xl text-[10px] md:text-xs font-mono text-on-surface overflow-x-auto max-h-56 leading-relaxed select-text">
                {SUPABASE_SETUP_SQL}
              </pre>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4.5 border-t border-outline-variant flex items-center justify-end bg-surface-container sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-primary text-on-primary rounded-lg text-xs font-black hover:translate-y-[-1px] transition-all active:scale-95 shadow-md shadow-primary/20 cursor-pointer"
          >
            Acknowledge Setup
          </button>
        </div>

      </div>
    </div>
  );
}
