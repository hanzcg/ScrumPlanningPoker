import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { Card, AppSettings } from './types';
import { FIBONACCI_CARDS, ALL_CARDS } from './data';
import DeckGrid from './components/DeckGrid';
import CardModal from './components/CardModal';
import SettingsPanel from './components/SettingsPanel';
import { soundManager } from './utils/audio';
import { triggerHaptic } from './utils/haptics';
import { logAnalyticsEvent } from './utils/firebase';

export default function App() {
  // Load settings from localStorage or fallback to defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('planning_poker_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      deckType: 'standard',
      darkMode: true, // Default to true for virtual meeting visibility!
      soundEnabled: true,
      hapticFeedback: true,
      tapToReveal: true,
      keepScreenOn: false,
    };
  });

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Log initial load
  useEffect(() => {
    logAnalyticsEvent('app_loaded');
  }, []);

  // Sync dark mode class with state before paint
  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.toggle('dark', settings.darkMode);
    body.classList.toggle('dark', settings.darkMode);
    root.style.backgroundColor = settings.darkMode ? '#0f172a' : '#f8fafc';
  }, [settings.darkMode]);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('planning_poker_settings', JSON.stringify(settings));
  }, [settings]);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    logAnalyticsEvent('settings_updated', {
      darkMode: newSettings.darkMode,
      soundEnabled: newSettings.soundEnabled,
      hapticFeedback: newSettings.hapticFeedback,
      keepScreenOn: newSettings.keepScreenOn,
      tapToReveal: newSettings.tapToReveal,
      deckType: newSettings.deckType
    });
  };

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    logAnalyticsEvent('card_selected', {
      card_id: card.id,
      card_value: card.value,
      card_label: card.label
    });
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">

      {/* Background Decorative Blobs for Glassmorphism depth */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-cyan-500/5 dark:bg-cyan-600/10 rounded-full blur-[90px]" />
        {/* Subtle grid pattern of requested design */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* Top Banner / Navigation header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 px-4 py-3.5 backdrop-blur-xl dark:border-white/10 dark:bg-[#020617]/70">
        <div className="mx-auto flex max-w-4xl items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            {/* Minimal brand icon with glassmorphic depth */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 border border-white/20">
              <span className="font-display font-black text-white text-base">HCG</span>
            </div>
            <div>
              <h1 className="text-sm font-black font-display tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-slate-400 uppercase">
                Scrum Planning Poker
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark mode badge indicator */}
            <div className="hidden sm:flex px-3.5 py-1.5 bg-slate-900/5 border border-slate-200/80 dark:bg-white/5 dark:border-white/10 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider text-slate-700 dark:text-slate-300 items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {settings.darkMode ? 'MODO OSCURO' : 'MODO CLARO'}
            </div>

            {/* Settings trigger */}
            <button
              id="settings-trigger-button"
              onClick={() => {
                soundManager.playClick(settings.soundEnabled);
                triggerHaptic(settings.hapticFeedback, 10);
                setIsSettingsOpen(true);
                logAnalyticsEvent('settings_opened');
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 hover:bg-slate-100 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
              aria-label="Configuración"
            >
              <Settings className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-6 md:py-8 space-y-6 md:space-y-8">

        {/* Welcome Hero Panel with beautiful frosted glass effect */}
        <section className="rounded-3xl bg-white/50 border border-slate-200/80 p-6 dark:bg-white/5 dark:border-white/10 backdrop-blur-xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-4 w-4 animate-pulse text-indigo-500" />
                <span className="text-[11px] font-bold uppercase tracking-widest font-sans">Sesión de Estimación Activa</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-sans mt-2 max-w-2xl leading-relaxed opacity-90">
                Presiona la carta para verla en pantalla completa y compartir tu estimación con el equipo.
              </p>
            </div>
          </div>
        </section>

        {/* Card Deck Grid */}
        <section id="card-deck-section">

          <DeckGrid
            cards={ALL_CARDS}
            soundEnabled={settings.soundEnabled}
            hapticEnabled={settings.hapticFeedback}
            onCardSelect={handleCardSelect}
          />
        </section>

      </main>

      {/* Footer credits and metadata */}
      <footer className="relative z-10 border-t border-slate-200/50 bg-white/40 py-8 text-center text-xs text-slate-500 dark:border-white/5 dark:bg-[#020617]/40">
        <div className="mx-auto max-w-4xl px-4 space-y-2">
          <p className="font-sans">
            <strong>Scrum Planning Poker</strong>
          </p>
          <div className="flex justify-center items-center gap-1.5 text-[10px] opacity-70">
            <span>Hanz</span>
            <span>•</span>
            <span>Cocchi</span>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-out Panels */}

      {/* Settings off-canvas panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Fullscreen Card Presenter Modal */}
      <CardModal
        card={selectedCard}
        settings={settings}
        onClose={() => setSelectedCard(null)}
      />

    </div>
  );
}
