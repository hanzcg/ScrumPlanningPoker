import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Card, AppSettings } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface CardModalProps {
  card: Card | null;
  settings: AppSettings;
  onClose: () => void;
}

// Stable deterministic helper to assign a card suit based on ID
const getCardSuit = (cardId: string) => {
  const suits = ['♠', '♥', '♦', '♣'];
  let sum = 0;
  for (let i = 0; i < cardId.length; i++) {
    sum += cardId.charCodeAt(i);
  }
  return suits[sum % 4];
};

export default function CardModal({ card, settings, onClose }: CardModalProps) {
  useEffect(() => {
    if (card) {
      soundManager.playOpen(settings.soundEnabled);
      triggerHaptic(settings.hapticFeedback, 20); // slightly stronger for open
    }
  }, [card, settings.soundEnabled, settings.hapticFeedback]);

  if (!card) return null;

  const triggerClose = () => {
    soundManager.playClick(settings.soundEnabled);
    triggerHaptic(settings.hapticFeedback, 10); // lighter click for close
    onClose();
  };

  const gradientClass = 'from-blue-600 via-blue-700 to-indigo-800 text-white';
  const suit = getCardSuit(card.id);

  return (
    <AnimatePresence>
      <motion.div
        id="card-fullscreen-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={triggerClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 md:p-6 backdrop-blur-2xl cursor-pointer"
      >
        {/* Floating close button at top-right */}
        <button
          id="close-modal-button"
          onClick={triggerClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white border border-white/10 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 cursor-pointer shadow-lg"
          aria-label="Cerrar vista"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Card Area (Face Up with premium playing card design) */}
        <div 
          className="relative z-10 flex items-center justify-center cursor-default select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-[78vh] max-h-[660px] min-h-[480px] w-[90vw] max-w-md">
            <motion.div
              id="fullscreen-card-element"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className={`relative h-full w-full rounded-[2.5rem] p-6 md:p-8 text-center border border-white/20 shadow-2xl bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center overflow-hidden`}
            >
              {/* Playing Card Inner Fine Border Line */}
              <div className="absolute inset-4 border border-white/15 rounded-[1.85rem] pointer-events-none" />

              {/* Top-Left Playing Card Index */}
              <div className="absolute top-7 left-7 md:top-8 md:left-8 flex flex-col items-center leading-none text-white/90">
                <span className="text-4xl font-black font-display tracking-tight">{card.value}</span>
                <span className="text-xl mt-1 opacity-80">{suit}</span>
              </div>

              {/* Bottom-Right Playing Card Index (Rotated 180 degrees) */}
              <div className="absolute bottom-7 right-7 md:bottom-8 md:right-8 flex flex-col items-center leading-none text-white/90 rotate-180">
                <span className="text-4xl font-black font-display tracking-tight">{card.value}</span>
                <span className="text-xl mt-1 opacity-80">{suit}</span>
              </div>

              {/* Giant Center Graphic Value inside luxury ring - Vertically & horizontally centered */}
              <div className="relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full bg-white/10 border border-white/20 shadow-inner">
                {/* Outer dashed spinning ring */}
                <div className="absolute inset-1.5 rounded-full border border-dashed border-white/20 animate-spin-slow" />
                <span className="text-8xl md:text-[6.5rem] font-black font-display tracking-tight text-white drop-shadow-xl">
                  {card.value}
                </span>
              </div>

              {/* Bottom description centered */}
              <div className="absolute bottom-7 md:bottom-8 left-0 right-0 flex flex-col items-center gap-1 opacity-95 max-w-[240px] md:max-w-[260px] mx-auto px-4 pointer-events-none">
                <p className="text-xl font-bold font-display tracking-wide">{card.label}</p>
                <p className="text-xs font-sans opacity-90 leading-relaxed text-center">
                  {card.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
