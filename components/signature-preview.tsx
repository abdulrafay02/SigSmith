import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Twitter, Linkedin, Globe, Moon, Sun, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SignatureData, Sparkle } from '@/lib/types';

interface SignaturePreviewProps {
  signatureData: SignatureData;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isCopied: boolean;
  sparkles: Sparkle[];
}

export const SignaturePreview = React.memo(({
  signatureData,
  isDarkMode,
  setIsDarkMode,
  isCopied,
  sparkles
}: SignaturePreviewProps) => {
  return (
    <motion.div
      layout
      className={cn(
        "relative rounded-lg p-4 transition-all duration-700 min-h-[160px] flex items-center justify-center overflow-hidden shadow-2xl",
        isDarkMode ? "bg-zinc-900/80 border border-white/5 backdrop-blur-md" : "bg-white border border-zinc-200"
      )}
    >
      {/* Preview Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          suppressHydrationWarning
          className={cn(
            "p-2 rounded-lg transition-all cursor-pointer",
            isDarkMode ? "bg-zinc-800 text-zinc-400 hover:text-white" : "bg-white text-zinc-500 hover:text-zinc-900 shadow-sm"
          )}
          aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div className="absolute top-4 left-5 flex items-center gap-1">
        <Flame size={12} className="text-rose-500 animate-pulse" />
        <span className={cn(
          "text-[8px] font-bold uppercase tracking-[0.3em] font-outfit text-zinc-600 mt-0.5"
        )}>Live Preview</span>
      </div>

      {/* The Signature Itself - Explicitly font-sans to keep it standard */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "p-6 rounded-lg transition-colors font-sans w-full",
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
                className="rounded-md object-cover"
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
  );
});

SignaturePreview.displayName = 'SignaturePreview';
