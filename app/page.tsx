'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Briefcase, 
  Phone, 
  Twitter, 
  Copy, 
  Check, 
  Info, 
  X, 
  Moon, 
  Sun,
  Hammer,
  Flame,
  Globe
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
    <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase tracking-wider">
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
        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all placeholder:text-zinc-600"
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
            <h2 className="text-xl font-bold flex items-center gap-2">
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

          <div className="space-y-4 text-zinc-300">
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
            className="mt-6 w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-rose-500/20 text-sm cursor-pointer"
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
    name: 'John Doe',
    title: 'Software Engineer',
    company: 'Tech Solutions Inc.',
    phone: '+1 (555) 123-4567',
    twitter: '@johndoe',
    website: 'https://sigsmith.vercel.app',
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
    const { name, title, company, phone, twitter, website, logoUrl } = signatureData;
    
    // Sanitize inputs for security
    const sName = escapeHtml(name || 'Your Name');
    const sTitle = escapeHtml(title || 'Your Title');
    const sCompany = escapeHtml(company || 'Company');
    const sPhone = escapeHtml(phone);
    const sTwitter = escapeHtml(twitter);
    const sWebsite = escapeHtml(website);
    const sLogoUrl = escapeHtml(logoUrl);

    const bullet = sPhone && sTwitter ? ' &bull; ' : '';
    
    return `
<table cellpadding="0" cellspacing="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b; line-height: 1.5;">
  <tr>
    <td style="padding-bottom: 12px;">
      <a href="${sWebsite}" target="_blank">
        <img src="${sLogoUrl}" alt="Logo" width="48" height="48" style="display: block; border-radius: 8px;">
      </a>
    </td>
  </tr>
  <tr>
    <td style="font-size: 16px; font-weight: 700; color: #000000;">${sName}</td>
  </tr>
  <tr>
    <td style="font-size: 14px; color: #71717a;">${sTitle} @ ${sCompany}</td>
  </tr>
  <tr>
    <td style="font-size: 13px; color: #a1a1aa; padding-top: 4px;">
      ${sPhone ? `<span>${sPhone}</span>` : ''}
      ${bullet}
      ${sTwitter ? `<a href="https://twitter.com/${sTwitter.replace('@', '')}" style="color: #a1a1aa; text-decoration: none;">${sTwitter}</a>` : ''}
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
    <main className="min-h-screen flex flex-col items-center py-12 px-6 bg-zinc-950 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl z-10"
      >
        {/* Header */}
        <header className="flex flex-col items-center mb-8 text-center">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center shadow-xl shadow-rose-500/20 mb-4"
          >
            <Hammer className="text-white" size={24} />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter mb-1 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
            SigSmith
          </h1>
          <p className="text-zinc-400 text-base font-medium">
            Forge Your Signature
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {/* Form Section */}
          <section className="glass-dark rounded-xl p-6 space-y-4">
            <div className="flex items-center mb-1">
              <Flame size={16} className="text-rose-500 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField 
                label="Full Name" 
                icon={User} 
                value={signatureData.name} 
                onChange={updateField('name')} 
                placeholder="e.g. John Doe"
                onClear={() => updateField('name')('')}
              />
              <InputField 
                label="Job Title" 
                icon={Briefcase} 
                value={signatureData.title} 
                onChange={updateField('title')} 
                placeholder="e.g. Software Engineer"
                onClear={() => updateField('title')('')}
              />
              <InputField 
                label="Company" 
                icon={Globe} 
                value={signatureData.company} 
                onChange={updateField('company')} 
                placeholder="e.g. Tech Solutions Inc."
                onClear={() => updateField('company')('')}
              />
              <InputField 
                label="Phone Number" 
                icon={Phone} 
                value={signatureData.phone} 
                onChange={updateField('phone')} 
                placeholder="e.g. +1 (555) 123-4567"
                onClear={() => updateField('phone')('')}
              />
              <InputField 
                label="Twitter / X" 
                icon={Twitter} 
                value={signatureData.twitter} 
                onChange={updateField('twitter')} 
                placeholder="e.g. @johndoe"
                onClear={() => updateField('twitter')('')}
              />
              <InputField 
                label="Website" 
                icon={Globe} 
                value={signatureData.website} 
                onChange={updateField('website')} 
                placeholder="e.g. https://sigsmith.vercel.app"
                onClear={() => updateField('website')('')}
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase tracking-wider">
                Company Logo
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
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
                <label className="flex-1 flex items-center justify-center px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 cursor-pointer transition-all">
                  <span>Upload Logo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
              </div>
            </div>
          </section>

          {/* Preview Section */}
          <section className="flex flex-col gap-4">
            <div className={cn(
              "relative rounded-xl p-8 transition-all duration-500 min-h-[220px] flex items-center justify-center overflow-hidden",
              isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-zinc-100 border border-zinc-200"
            )}>
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
                  "text-[9px] font-bold uppercase tracking-[0.2em]",
                  isDarkMode ? "text-zinc-600" : "text-zinc-400"
                )}>Live Preview</span>
              </div>

              {/* The Signature Itself */}
              <motion.div 
                key={JSON.stringify(signatureData)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "p-4 rounded-lg transition-colors",
                  isDarkMode ? "text-white" : "text-zinc-900"
                )}
              >
                <div className="flex flex-col gap-2">
                  {signatureData.logoUrl && (
                    <div className="relative w-10 h-10 mb-1">
                      <Image 
                        src={signatureData.logoUrl} 
                        alt="Logo" 
                        fill
                        className="rounded-md object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold leading-tight">
                      {signatureData.name || 'Your Name'}
                    </h3>
                    <p className={cn(
                      "text-xs",
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    )}>
                      {signatureData.title || 'Your Title'} <span className="mx-1">@</span> {signatureData.company || 'Company'}
                    </p>
                  </div>
                  <div className={cn(
                    "text-[10px] flex items-center gap-2",
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  )}>
                    {signatureData.phone && <span>{signatureData.phone}</span>}
                    {signatureData.phone && signatureData.twitter && <span className="opacity-50">&bull;</span>}
                    {signatureData.twitter && <span>{signatureData.twitter}</span>}
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
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={copyToClipboard}
                suppressHydrationWarning
                className="flex-1 group relative overflow-hidden py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  {isCopied ? (
                    <motion.div 
                      key="check"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={18} />
                      Forged & Copied!
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="copy"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Copy size={18} />
                      Copy Signature
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                suppressHydrationWarning
                className="py-3 px-6 glass-dark hover:bg-white/10 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Info size={18} />
                How to Import?
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-zinc-600 text-[10px]">
          <p>&copy; {new Date().getFullYear()} SigSmith Labs. Forged with precision.</p>
        </footer>
      </motion.div>

      <ImportInstructionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
