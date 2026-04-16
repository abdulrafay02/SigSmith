import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X } from 'lucide-react';
import { SpotlightWrapper } from '@/components/ui/spotlight-wrapper';

export const ImportInstructionsModal = React.memo(({
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
          className="relative w-full max-w-lg z-10"
        >
          <SpotlightWrapper
            className="glass-dark rounded-lg shadow-2xl transition-all"
          >
            <div className="w-full h-full p-6 relative overflow-hidden rounded-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 font-outfit tracking-tight">
                  <Info className="text-rose-500" size={20} />
                  How to Import
                </h2>
                <button
                  onClick={onClose}
                  suppressHydrationWarning
                  className="p-1.5 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-zinc-300 font-outfit">
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
                      <span className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-500 flex items-center justify-center text-[10px]">
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

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 25px rgba(244, 63, 94, 0.6), 0 0 50px rgba(244, 63, 94, 0.2)",
                  filter: "brightness(1.1)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                suppressHydrationWarning
                className="mt-6 w-full group relative overflow-hidden py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-rose-500/20 text-xs cursor-pointer font-outfit tracking-widest"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Got it!</span>
              </motion.button>
            </div>
          </SpotlightWrapper>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
));

ImportInstructionsModal.displayName = 'ImportInstructionsModal';
