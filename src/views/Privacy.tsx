import { ShieldCheck, Lock, Eye, Server, RefreshCw } from 'lucide-react';

interface PrivacyProps {
  onNotify: (msg: string, title?: string) => void;
}

export default function Privacy({ onNotify }: PrivacyProps) {
  const handleContactClick = () => {
    onNotify('Your privacy inquiry has been logged. Our data protection officer will contact you shortly.', 'Privacy Request Sent');
  };

  return (
    <main className="pt-24 pb-16 px-6 max-w-[800px] mx-auto min-h-screen relative overflow-hidden text-on-surface">
      {/* Glow decorative gradients */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-tertiary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <section className="mb-12 text-center md:text-left space-y-4">
        <div className="inline-flex items-center gap-1.5 text-tertiary font-bold text-[10px] md:text-xs tracking-wider uppercase px-3 py-1 bg-tertiary/10 rounded-full border border-tertiary/20 select-none">
          <ShieldCheck className="w-3.5 h-3.5" />
          TRUST &amp; TRANSPARENCY
        </div>
        <h1 className="font-headline font-black text-3xl md:text-5xl text-on-surface tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-2xl">
          Last Updated: October 2026. This policy outlines how RekaSync handles your data with professional precision and care.
        </p>
      </section>

      {/* Policy Sections (Bento-style layout for cards) */}
      <div className="space-y-6">
        
        {/* 1. Introduction */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl hover:translate-y-[-2px] transition-transform duration-300">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="font-headline font-bold text-lg md:text-xl text-on-surface">Introduction</h2>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                RekaSync is built on a foundation of trust. We deeply respect user privacy and operate under the principle of data minimization. This policy explains our commitment to protecting the creative workflows and style preferences of our professional community.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2. Designer Data */}
          <div className="glass-panel p-6 rounded-2xl hover:translate-y-[-2px] transition-transform duration-300 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center border border-tertiary/20">
              <Eye className="w-5 h-5 text-tertiary" />
            </div>
            <h2 className="font-headline font-bold text-base md:text-lg text-on-surface">Designer Data</h2>
            <p className="text-[11px] md:text-xs text-on-surface-variant leading-relaxed">
              All project data, design assets, and collaborative files are encrypted and protected. Access is strictly limited to the account owner and authorized team members. We do not sell or share your project intellectual property with third parties.
            </p>
          </div>

          {/* 3. Client Data */}
          <div className="glass-panel p-6 rounded-2xl hover:translate-y-[-2px] transition-transform duration-300 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/50 flex items-center justify-center border border-outline-variant">
              <Server className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="font-headline font-bold text-base md:text-lg text-on-surface">Client Data</h2>
            <p className="text-[11px] md:text-xs text-on-surface-variant leading-relaxed">
              Client responses to style surveys are stored anonymously. This data is used exclusively to facilitate style preference communication between clients and designers. We do not collect Personally Identifiable Information (PII) from clients unless explicitly provided.
            </p>
          </div>
        </div>

        {/* 4. Data Security */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl hover:translate-y-[-2px] transition-transform duration-300">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-2">
              <h2 className="font-headline font-bold text-lg md:text-xl text-on-surface">Data Security</h2>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Your information is stored using industry-standard secure infrastructure. We leverage state-of-the-art encryption layers, including fine-grained access rules and point-in-time database snapshots, to ensure that your data remains safe, available, and private at all times.
              </p>
            </div>
            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden border border-outline-variant/60 relative select-none shrink-0 bg-surface-container-high">
              <img 
                className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 duration-500" 
                alt="High tech hardware server rack cluster"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1gg0bMoufbH32k87LLW2Hn71erBMV2JFlQLlfLrC36RqTfTYGDc5Our4jrfgiYSYemiLVUyCzcNZNOLQotOQn4hD5inssJWzahH4rHoxs-IuChG0cSHEI5aXmxeBEAppDNmE62jp0pSiIksziD-ikXjW89i-vgLGNo8INDihXzCepTp23kKp-q5lf49LNu8EYVKgVtA0mcSg9FF_GY7TTpQkgWpSJMVpe2J-q2QbRRiuwqbgVn2J7rM2Ze317flM8vedGZPfR7Bo"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-app/80 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="mt-12 text-center p-8 border-2 border-dashed border-outline-variant/60 rounded-2xl space-y-4">
        <h3 className="font-headline font-bold text-lg text-on-surface">Questions about your data?</h3>
        <p className="text-xs md:text-sm text-on-surface-variant max-w-lg mx-auto">
          Our legal and privacy team is here to assist with any inquiries regarding our compliance and data handling.
        </p>
        <button 
          onClick={handleContactClick}
          className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-xl text-xs hover:translate-y-[-1px] active:scale-95 transition-all shadow-md shadow-primary/10 cursor-pointer"
        >
          Contact Privacy Team
        </button>
      </div>
    </main>
  );
}
