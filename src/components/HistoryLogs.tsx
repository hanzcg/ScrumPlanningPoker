import React from 'react';
import { motion } from 'motion/react';
import { History, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { VoteHistory } from '../types';
import { soundManager } from '../utils/audio';

interface HistoryLogsProps {
  history: VoteHistory[];
  soundEnabled: boolean;
  onClearHistory: () => void;
}

export default function HistoryLogs({ history, soundEnabled, onClearHistory }: HistoryLogsProps) {
  const handleClear = () => {
    soundManager.playClick(soundEnabled);
    onClearHistory();
  };

  if (history.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-200/80 p-8 text-center dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-md">
        <History className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
        <p className="mt-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 font-sans">Sin historial de votos</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-1">Tus estimaciones recientes aparecerán aquí para fácil referencia.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-slate-200/80 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5 backdrop-blur-xl shadow-md">
      <div className="flex items-center justify-between border-b border-slate-200/50 pb-4 dark:border-white/10">
        <div className="flex items-center gap-2">
          <History className="h-4.5 w-4.5 text-indigo-500" />
          <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider">Tus Votos Recientes</h3>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 rounded-full py-1.5 px-3.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 backdrop-blur-md transition-all cursor-pointer hover:shadow-sm active:scale-95"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Limpiar</span>
        </button>
      </div>

      <div className="mt-4 max-h-[220px] overflow-y-auto space-y-2.5 pr-1">
        {history.map((vote, index) => {
          const dateString = new Date(vote.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          return (
            <motion.div
              key={vote.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between rounded-2xl bg-white/40 dark:bg-white/5 p-3.5 border border-slate-200/50 dark:border-white/10 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-display font-black text-white text-base shadow-sm">
                  {vote.value}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">
                      Carta Estimada
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{dateString}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-[11px] font-semibold font-sans text-slate-500 dark:text-slate-400 max-w-[120px] text-right truncate">
                {vote.note || 'Voto general'}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
