import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Moon, Sun, Volume2, VolumeX, Sparkles, Smartphone, ShieldAlert } from 'lucide-react';
import { AppSettings } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface SettingsPanelProps {
  isOpen: boolean;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, settings, onUpdateSettings, onClose }: SettingsPanelProps) {
  const toggleSetting = (key: keyof AppSettings) => {
    const nextValue = !settings[key];
    const nextSettings = {
      ...settings,
      [key]: nextValue
    };
    onUpdateSettings(nextSettings);
    soundManager.playClick(settings.soundEnabled);
    
    // Play haptic feedback if enabled in current or new settings
    const isHapticEnabled = key === 'hapticFeedback' ? nextValue : settings.hapticFeedback;
    triggerHaptic(isHapticEnabled, 15);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-40 w-full max-w-sm border-l border-slate-200/80 bg-white/90 p-6 shadow-2xl dark:border-white/10 dark:bg-[#020617]/90 backdrop-blur-2xl overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-4 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Ajustes del Juego</h2>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick(settings.soundEnabled);
                  triggerHaptic(settings.hapticFeedback, 10);
                  onClose();
                }}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Settings Toggles List */}
            <div className="mt-6 space-y-6">
              
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 text-sm font-sans">
                    {settings.darkMode ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                    <span>Modo Oscuro</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Cambia la interfaz a tonos oscuros</span>
                </div>
                <button
                  onClick={() => toggleSetting('darkMode')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${settings.darkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 text-sm font-sans">
                    {settings.soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-500" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
                    <span>Efectos de Sonido</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Sonido háptico virtual al interactuar</span>
                </div>
                <button
                  onClick={() => toggleSetting('soundEnabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Haptic Feedback (Vibration) */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 text-sm font-sans">
                    <Smartphone className="h-4 w-4 text-indigo-400" />
                    <span>Vibración Háptica</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Vibración al tocar cartas (móvil)</span>
                </div>
                <button
                  onClick={() => toggleSetting('hapticFeedback')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${settings.hapticFeedback ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${settings.hapticFeedback ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

            </div>

            {/* Quick How to play guide */}
            <div className="mt-8 border-t border-slate-200/50 pt-6 dark:border-white/10">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider">¿Cómo estimar?</h3>
              <div className="mt-3 space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                <p>
                  1. <strong>Elige una carta:</strong> El facilitador lee la historia de usuario. Cada participante selecciona una carta que representa el esfuerzo estimado.
                </p>
                <p>
                  2. <strong>Muestra tu voto:</strong> La carta se mostrará en pantalla completa para que la compartas con tu equipo.
                </p>
                <p>
                  3. <strong>Lleguen a un acuerdo:</strong> Si los valores difieren sustancialmente (por ejemplo, alguien votó 2 y otro 13), debatan los puntos de vista de los extremos y vuelvan a votar.
                </p>
              </div>
            </div>

            {/* Extra guide on Fibonacci */}
            <div className="mt-6 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 dark:border-indigo-500/20 p-4 backdrop-blur-md">
              <div className="flex gap-2 text-indigo-800 dark:text-indigo-200">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-indigo-500" />
                <div className="text-xs font-sans">
                  <p className="font-semibold">La Regla Fibonacci</p>
                  <p className="mt-1 opacity-90 leading-relaxed">
                    La serie Fibonacci (0, 1, 2, 3, 5, 8, 13...) se usa para evitar falsas precisiones. A medida que una tarea crece, la incertidumbre aumenta de forma exponencial. ¡Es más fácil decidir entre un 5 y un 8 que entre un 6 y un 7!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
