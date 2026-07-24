import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, BookOpen, Sparkles } from 'lucide-react';
import { Card } from '../types';

interface CriteriaGuideProps {
  cards: Card[];
}

export default function CriteriaGuide({ cards }: CriteriaGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const toggleCard = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <div className="rounded-[2rem] border border-slate-200/80 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5 backdrop-blur-xl shadow-md">
      <button
        onClick={toggleOpen}
        className="flex w-full items-center justify-between font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4.5 w-4.5 text-indigo-500" />
          <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider">
            Guía de Criterios (Fibonacci)
          </h3>
        </div>
        {isOpen ? <ChevronUp className="h-4.5 w-4.5 text-slate-500" /> : <ChevronDown className="h-4.5 w-4.5 text-slate-500" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/10 space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-sans leading-relaxed">
                Alinea los criterios de tu equipo de desarrollo para calificar historias según su complejidad relativa y esfuerzo:
              </p>

              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {cards.map((card) => {
                  const isExpanded = expandedCardId === card.id;
                  return (
                    <div
                      key={card.id}
                      className="rounded-2xl border border-slate-200/50 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5 transition-all hover:bg-white/60 dark:hover:bg-white/10"
                    >
                      <button
                        onClick={() => toggleCard(card.id)}
                        className="flex w-full items-center justify-between text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 font-display font-black text-white text-xs shadow-sm">
                            {card.value}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">
                              {card.label}
                            </p>
                            {!isExpanded && (
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans truncate max-w-[180px] sm:max-w-[320px]">
                                {card.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                          {isExpanded ? 'Ocultar' : 'Detalle'}
                        </span>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans border-t border-slate-200/50 dark:border-white/10 pt-2 pl-1">
                              {card.description}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
