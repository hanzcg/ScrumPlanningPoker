import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface DeckGridProps {
  cards: Card[];
  soundEnabled: boolean;
  hapticEnabled: boolean;
  onCardSelect: (card: Card) => void;
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

export default function DeckGrid({ cards, soundEnabled, hapticEnabled, onCardSelect }: DeckGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0, scale: 0.94 },
    show: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 22
      }
    }
  };

  const handleSelect = (card: Card) => {
    soundManager.playClick(soundEnabled);
    triggerHaptic(hapticEnabled, 15);
    onCardSelect(card);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 sm:gap-5"
    >
      {cards.map((card) => {
        const gradientClass = card.color;
        const suit = getCardSuit(card.id);

        return (
          <motion.button
            key={card.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(card)}
            className="group relative flex min-h-[240px] sm:min-h-[285px] h-full flex-col justify-between rounded-[2rem] bg-white/45 border border-slate-200/80 dark:bg-white/5 dark:border-white/10 p-4.5 backdrop-blur-xl transition-all duration-300 hover:bg-white/65 dark:hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 text-left select-none cursor-pointer shadow-sm hover:shadow-2xl hover:border-indigo-500/40 dark:hover:border-indigo-400/40 overflow-hidden"
          >
            {/* Card Inner Ornamental Border (Classic Playing Card Filigree) */}
            <div className="absolute inset-2 border border-slate-200/50 dark:border-white/10 rounded-[1.5rem] pointer-events-none" />

            {/* Subtle inner colored glow blob at the top-right of the glass card to represent the unique card color */}
            <div className={`absolute top-0 right-0 -mr-6 -mt-6 h-16 w-16 rounded-full bg-gradient-to-br ${gradientClass} opacity-10 blur-md group-hover:opacity-25 transition-opacity duration-300`} />

            {/* Top Index */}
            <div className="flex w-full justify-between items-start relative z-10">
              <div className="flex flex-col items-center leading-none text-slate-800 dark:text-white">
                <span className="text-base sm:text-lg font-black font-display group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {card.value}
                </span>
                <span className="text-sm opacity-75 mt-0.5 group-hover:text-indigo-500 transition-colors">{suit}</span>
              </div>
            </div>

            {/* Giant Center Value inside beautiful circle */}
            <div className="flex flex-1 items-start justify-center pt-2 pb-1.5 relative z-10">
              <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100/50 dark:bg-white/5 border border-slate-200/40 dark:border-white/10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-1 rounded-full border border-dashed border-slate-300/40 dark:border-white/10" />
                <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-slate-800 dark:text-white">
                  {card.value}
                </span>
              </div>
            </div>

            {/* Bottom Info with bottom-right rotated index */}
            <div className="relative z-10 flex items-end justify-between border-t border-slate-200/30 dark:border-white/5 pt-2 min-h-[4rem] sm:min-h-[5.25rem] shrink-0 mt-auto gap-2 w-full">
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[9px] font-bold tracking-widest uppercase font-sans text-slate-400 dark:text-slate-500 truncate block">
                  {card.label}
                </span>
                <span className="text-[9.5px] font-sans text-slate-500 dark:text-slate-400 opacity-90 leading-relaxed mt-0.5 sm:block hidden">
                  {card.description}
                </span>
              </div>

              {/* Bottom-Right Rotated Playing Card Index */}
              <div className="flex flex-col items-center leading-none text-slate-800 dark:text-white rotate-180 shrink-0 select-none pb-0.5">
                <span className="text-sm font-black font-display">{card.value}</span>
                <span className="text-[10px] opacity-75 mt-0.5">{suit}</span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
