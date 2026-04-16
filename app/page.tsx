'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { Flame, Copy, Check, Info } from 'lucide-react';
import { SpotlightWrapper } from '@/components/ui/spotlight-wrapper';
import { ImportInstructionsModal } from '@/components/import-modal';
import { SignatureForm } from '@/components/signature-form';
import { SignaturePreview } from '@/components/signature-preview';
import { useSignature } from '@/hooks/use-signature';
import { Particles } from '@/components/ui/particles';

export default function SigSmith() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    signatureData,
    isDarkMode,
    setIsDarkMode,
    isCopied,
    sparkles,
    updateField,
    handleLogoUpload,
    copyToClipboard
  } = useSignature();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-4 px-4 bg-zinc-950 overflow-x-hidden relative">
      {/* Particles Background */}
      <Particles
        className="fixed inset-0 z-0"
        quantity={150}
        ease={80}
        color="#f43f5e"
        refresh
      />
      
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-xl z-10"
      >
        {/* Header */}
        <header className="flex items-center justify-center gap-4 mb-4">
          <motion.div
            whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 20px rgba(244, 63, 94, 0.4))" }}
            whileTap={{ scale: 0.95 }}
            className="relative w-12 h-12"
          >
            <Image src="/logo.png" alt="SigSmith Logo" fill className="object-contain" priority />
          </motion.div>
          <div className="flex flex-col items-start leading-none">
            <div className="flex items-center gap-1">
              <h1 className="text-xl font-black tracking-tighter text-white font-outfit">
                SigSmith<span className="text-rose-500">.</span>
              </h1>
            </div>
            <p className="text-zinc-500 font-bold tracking-[0.2em] uppercase text-[9px] font-outfit mt-1.5 ml-0.5">
              Forge Your Signature
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-2">
          <SignatureForm
            signatureData={signatureData}
            updateField={updateField}
            handleLogoUpload={handleLogoUpload}
          />

          <section className="flex flex-col gap-2">
            <SignaturePreview
              signatureData={signatureData}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              isCopied={isCopied}
              sparkles={sparkles}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 25px rgba(244, 63, 94, 0.6), 0 0 50px rgba(244, 63, 94, 0.2)",
                  filter: "brightness(1.1)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={copyToClipboard}
                suppressHydrationWarning
                className="flex-1 group relative overflow-hidden py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all shadow-xl shadow-rose-500/30 flex items-center justify-center gap-3 text-sm cursor-pointer font-outfit tracking-wider"
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

              <SpotlightWrapper
                onClick={() => setIsModalOpen(true)}
                className="glass-dark hover:bg-white/10 text-white font-bold rounded-lg transition-all cursor-pointer border border-white/5"
                radius={250}
              >
                <div className="py-3 px-6 flex items-center justify-center gap-3 text-sm font-outfit tracking-wider">
                  <Info size={20} />
                  Import Guide
                </div>
              </SpotlightWrapper>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center text-zinc-600 text-[10px] font-outfit tracking-[0.2em]">
          <p>&copy; {new Date().getFullYear()} SigSmith. Forged with precision.</p>
        </footer>
      </motion.div>

      <ImportInstructionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
