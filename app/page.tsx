'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Briefcase, 
  Phone, 
  Twitter, 
  Linkedin,
  Copy, 
  Check, 
  Info, 
  X, 
  Moon, 
  Sun,
  Hammer,
  Flame,
  Globe,
  ExternalLink
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Simple HTML escaping to prevent XSS in generated signatures
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

import Image from 'next/image';

// --- Types ---
interface SignatureData {
  name: string;
  title: string;
  company: string;
  phone: string;
  twitter: string;
  linkedin: string;
  website: string;
  logoUrl: string;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

// --- Constants ---
const SPARKLE_COUNT = 12;
const DEFAULT_LOGO = 'https://picsum.photos/seed/hammer/128/128';

// --- Components ---

/**
 * Reusable input field with icon and clear button
 */
const InputField = React.memo(({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  placeholder,
  onClear 
}: { 
  label: string; 
  icon: any; 
  value: string; 
  onChange: (val: string) => void; 
  placeholder: string;
  onClear: () => void;
}) => (
  <div className="space-y-1 group">
    <label className="text-[9px] font-bold text-zinc-500 ml-1 uppercase tracking-wider font-orbitron">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-rose-500 transition-colors">
        <Icon size={14} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        suppressHydrationWarning
        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all placeholder:text-zinc-600 font-orbitron tracking-tight"
      />
      {value && (
        <button 
          type="button"
          onClick={onClear}
          suppressHydrationWarning
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          aria-label={`Clear ${label}`}
        >
          <X size={12} />
        </button>
      )}
    </div>
  </div>
));

InputField.displayName = 'InputField';

/**
 * Modal explaining how to use the generated signature in various clients
 */
const ImportInstructionsModal = React.memo(({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass-dark rounded-xl p-6 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 font-orbitron tracking-tight">
              <Info className="text-rose-500" size={20} />
              How to Import
            </h2>
            <button 
              onClick={onClose} 
              suppressHydrationWarning 
              className="p-1.5 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 text-zinc-300 font-orbitron">
            {[
              {
                id: 1,
                title: 'Gmail',
                desc: 'Go to Settings > See all settings > General > Signature. Click "Create new", then paste the copied signature into the text box.'
              },
              {
                id: 2,
                title: 'macOS Mail',
                desc: 'Mail > Settings > Signatures. Select your account, click (+), and paste. Uncheck "Always match my default message font" if needed.'
              },
              {
                id: 3,
                title: 'iOS Mail',
                desc: 'Settings > Mail > Signature. Long press to paste. If it looks weird, "Shake to Undo" the automatic formatting change.'
              }
            ].map((step) => (
              <section key={step.id}>
                <h3 className="font-semibold text-white mb-1 flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center text-[10px]">
                    {step.id}
                  </span>
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed pl-7">
                  {step.desc}
                </p>
              </section>
            ))}
          </div>

          <button 
            onClick={onClose}
            suppressHydrationWarning
            className="mt-6 w-full py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20 text-xs cursor-pointer font-orbitron tracking-widest"
          >
            Got it!
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
));

ImportInstructionsModal.displayName = 'ImportInstructionsModal';

export default function SigSmith() {
  // --- State ---
  const [signatureData, setSignatureData] = useState<SignatureData>({
    name: 'Geralt of Rivia',
    title: 'Monster Hunter',
    company: 'Witcher Services LLC',
    phone: '+1 (555) 000-WOLF',
    twitter: '@blaviken_butcher',
    linkedin: 'geralt-of-rivia',
    website: 'https://kaermorhen.com',
    logoUrl: DEFAULT_LOGO
  });

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // --- Effects ---
  useEffect(() => {
    // Generate sparkles once on mount
    const generatedSparkles = Array.from({ length: SPARKLE_COUNT }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      delay: Math.random() * 0.2,
    }));
    
    // Use timeout to avoid potential hydration mismatch or cascading render issues
    const timer = setTimeout(() => setSparkles(generatedSparkles), 0);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---
  const handleLogoUpload = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSignatureData(prev => ({ ...prev, logoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }, []);

  /**
   * Generates the HTML string for the signature.
   * Memoized to avoid re-computation on every render.
   */
  const generatedHtml = React.useMemo(() => {
    const { name, title, company, phone, twitter, linkedin, website, logoUrl } = signatureData;
    
    // Sanitize inputs for security
    const sName = escapeHtml(name || 'Your Name');
    const sTitle = escapeHtml(title || 'Your Title');
    const sCompany = escapeHtml(company);
    const sPhone = escapeHtml(phone);
    const sTwitter = escapeHtml(twitter);
    const sLinkedin = escapeHtml(linkedin);
    const sWebsite = escapeHtml(website);
    const sLogoUrl = escapeHtml(logoUrl);

    const contactParts = [
      sPhone ? `<span>${sPhone}</span>` : null,
      sTwitter ? `<a href="https://twitter.com/${sTwitter.replace('@', '')}" style="color: #a1a1aa; text-decoration: none;">${sTwitter}</a>` : null,
      sLinkedin ? `<a href="https://linkedin.com/in/${sLinkedin}" style="color: #a1a1aa; text-decoration: none;">LinkedIn</a>` : null,
      sWebsite ? `<a href="${sWebsite}" style="color: #a1a1aa; text-decoration: none;">${sWebsite.replace('https://', '').replace('http://', '')}</a>` : null
    ].filter(Boolean);

    const contactLine = contactParts.join(' &bull; ');
    
    return `
<table cellpadding="0" cellspacing="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b; line-height: 1.5;">
  <tr>
    <td style="padding-bottom: 12px;">
      <a href="${sWebsite || '#'}" target="_blank">
        <img src="${sLogoUrl}" alt="Logo" width="48" height="48" style="display: block; border-radius: 8px;">
      </a>
    </td>
  </tr>
  <tr>
    <td style="font-size: 16px; font-weight: 700; color: #000000;">${sName}</td>
  </tr>
  <tr>
    <td style="font-size: 14px; color: #71717a;">${sTitle}${sCompany ? ` @ ${sCompany}` : ''}</td>
  </tr>
  <tr>
    <td style="font-size: 13px; color: #a1a1aa; padding-top: 4px;">
      ${contactLine}
    </td>
  </tr>
</table>
    `.trim();
  }, [signatureData]);

  /**
   * Copies the generated signature to clipboard as both HTML and Plain Text.
   */
  const copyToClipboard = React.useCallback(async () => {
    try {
      // Create blobs for rich text support
      const htmlBlob = new Blob([generatedHtml], { type: 'text/html' });
      const textBlob = new Blob([generatedHtml], { type: 'text/plain' });
      
      if (typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob
          })
        ]);
      } else {
        // Fallback for older browsers
        await navigator.clipboard.writeText(generatedHtml);
      }
      
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy signature:', err);
      // Optional: Show error toast here
    }
  }, [generatedHtml]);

  // --- Render Helpers ---
  const updateField = React.useCallback((field: keyof SignatureData) => (value: string) => {
    setSignatureData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center py-6 px-6 bg-zinc-950 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-xl z-10"
      >
        {/* Header */}
        <header className="flex flex-col items-center mb-2 text-center">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1, filter: "brightness(1.2)" }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center shadow-xl shadow-rose-500/30 mb-2 backdrop-blur-md border border-white/20"
          >
            <Hammer className="text-white" size={24} />
          </motion.div>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 font-tech">
              SigSmith
            </h1>
            <Flame size={20} className="text-rose-500 animate-pulse" />
          </div>
          <p className="text-zinc-400 text-base font-medium tracking-widest uppercase text-[9px] font-orbitron mt-1">
            Forge Your Signature
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {/* Form Section */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-dark backdrop-blur-xl border border-white/5 rounded-2xl p-5 space-y-3 shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField 
                label="Full Name" 
                icon={User} 
                value={signatureData.name} 
                onChange={updateField('name')} 
                placeholder="e.g. Geralt of Rivia"
                onClear={() => updateField('name')('')}
              />
              <InputField 
                label="Job Title" 
                icon={Briefcase} 
                value={signatureData.title} 
                onChange={updateField('title')} 
                placeholder="e.g. Monster Hunter"
                onClear={() => updateField('title')('')}
              />
              <InputField 
                label="Company" 
                icon={Globe} 
                value={signatureData.company} 
                onChange={updateField('company')} 
                placeholder="e.g. Witcher Services LLC"
                onClear={() => updateField('company')('')}
              />
              <InputField 
                label="Phone Number" 
                icon={Phone} 
                value={signatureData.phone} 
                onChange={updateField('phone')} 
                placeholder="e.g. +1 (555) 000-WOLF"
                onClear={() => updateField('phone')('')}
              />
              <InputField 
                label="Twitter / X" 
                icon={Twitter} 
                value={signatureData.twitter} 
                onChange={updateField('twitter')} 
                placeholder="e.g. @blaviken_butcher"
                onClear={() => updateField('twitter')('')}
              />
              <InputField 
                label="LinkedIn" 
                icon={Linkedin} 
                value={signatureData.linkedin} 
                onChange={updateField('linkedin')} 
                placeholder="e.g. geralt-of-rivia"
                onClear={() => updateField('linkedin')('')}
              />
              <InputField 
                label="Website" 
                icon={Globe} 
                value={signatureData.website} 
                onChange={updateField('website')} 
                placeholder="e.g. https://sigsmith.vercel.app"
                onClear={() => updateField('website')('')}
              />
              
              {/* Logo Upload - Integrated into grid but smaller */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase tracking-wider font-orbitron">
                  Company Logo
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative w-9 h-9 bg-zinc-900/80 border border-zinc-800 rounded-lg overflow-hidden flex-shrink-0 backdrop-blur-sm">
                    {signatureData.logoUrl && (
                      <Image 
                        src={signatureData.logoUrl} 
                        alt="Logo Preview" 
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <label className="flex-1 flex items-center justify-center px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-500 hover:text-white hover:border-rose-500/50 cursor-pointer transition-all uppercase tracking-tighter">
                    <span>Change Logo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </label>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Preview Section */}
          <section className="flex flex-col gap-4">
            <motion.div 
              layout
              className={cn(
                "relative rounded-2xl p-6 transition-all duration-700 min-h-[220px] flex items-center justify-center overflow-hidden shadow-2xl",
                isDarkMode ? "bg-zinc-900/80 border border-white/5 backdrop-blur-md" : "bg-white border border-zinc-200"
              )}
            >
              {/* Preview Controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  suppressHydrationWarning
                  className={cn(
                    "p-2 rounded-full transition-all cursor-pointer",
                    isDarkMode ? "bg-zinc-800 text-zinc-400 hover:text-white" : "bg-white text-zinc-500 hover:text-zinc-900 shadow-sm"
                  )}
                  aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>

              <div className="absolute top-4 left-6">
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-[0.3em] font-orbitron",
                  isDarkMode ? "text-zinc-600" : "text-zinc-400"
                )}>Live Preview</span>
              </div>

              {/* The Signature Itself - Explicitly font-sans to keep it standard */}
              <motion.div 
                key={JSON.stringify(signatureData)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "p-6 rounded-xl transition-colors font-sans",
                  isDarkMode ? "text-white" : "text-zinc-900"
                )}
              >
                <div className="flex flex-col gap-3">
                  {signatureData.logoUrl && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative w-12 h-12 mb-1 shadow-lg"
                    >
                      <Image 
                        src={signatureData.logoUrl} 
                        alt="Logo" 
                        fill
                        className="rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold leading-tight tracking-tight">
                      {signatureData.name || 'Your Name'}
                    </h3>
                    <p className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    )}>
                      {signatureData.title || 'Your Title'} {signatureData.company && <><span className="mx-1 text-zinc-500">@</span> {signatureData.company}</>}
                    </p>
                  </div>
                  <div className={cn(
                    "text-[11px] flex flex-wrap items-center gap-x-3 gap-y-1",
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  )}>
                    {signatureData.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={10} className="text-zinc-500" />
                        {signatureData.phone}
                      </span>
                    )}
                    {signatureData.twitter && (
                      <span className="flex items-center gap-1">
                        <Twitter size={10} className="text-zinc-500" />
                        {signatureData.twitter}
                      </span>
                    )}
                    {signatureData.linkedin && (
                      <span className="flex items-center gap-1">
                        <Linkedin size={10} className="text-zinc-500" />
                        {signatureData.linkedin}
                      </span>
                    )}
                    {signatureData.website && (
                      <span className="flex items-center gap-1">
                        <Globe size={10} className="text-zinc-500" />
                        {signatureData.website.replace('https://', '').replace('http://', '')}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Decorative Forge Sparkles */}
              <AnimatePresence>
                {isCopied && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none flex items-center justify-center"
                  >
                    {sparkles.map((sparkle) => (
                      <motion.div
                        key={sparkle.id}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{ 
                          scale: [0, 1, 0], 
                          x: sparkle.x, 
                          y: sparkle.y 
                        }}
                        transition={{ 
                          duration: 0.8, 
                          ease: "easeOut",
                          delay: sparkle.delay
                        }}
                        className="absolute w-1 h-1 bg-rose-500 rounded-full"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
            <motion.button 
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 25px rgba(244, 63, 94, 0.6), 0 0 50px rgba(244, 63, 94, 0.2)",
                  filter: "brightness(1.1)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={copyToClipboard}
                suppressHydrationWarning
                className="flex-1 group relative overflow-hidden py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-xl shadow-rose-500/30 flex items-center justify-center gap-3 text-sm cursor-pointer font-orbitron tracking-wider"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <AnimatePresence mode="wait">
                  {isCopied ? (
                    <motion.div 
                      key="check"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={20} />
                      Forged!
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="copy"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Copy size={20} />
                      Copy Signature
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                suppressHydrationWarning
                className="py-4 px-8 glass-dark hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 text-sm cursor-pointer font-orbitron tracking-wider border border-white/5"
              >
                <Info size={20} />
                Import Guide
              </motion.button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center text-zinc-600 text-[10px] font-orbitron tracking-[0.2em]">
          <p>&copy; {new Date().getFullYear()} SigSmith. Forged with precision.</p>
        </footer>
      </motion.div>

      <ImportInstructionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
