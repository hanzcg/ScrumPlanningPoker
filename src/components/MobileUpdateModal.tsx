import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Sparkles, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { pwaManager, isMobileDevice } from '../utils/pwa';

export default function MobileUpdateModal() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Only subscribe and show if this is a mobile device
    if (!isMobileDevice()) {
      return;
    }

    return pwaManager.subscribe((updateAvailable) => {
      setHasUpdate(updateAvailable);
      if (updateAvailable) {
        setIsOpen(true);
      }
    });
  }, []);

  const handleAcceptUpdate = async () => {
    setIsUpdating(true);
    try {
      await pwaManager.applyUpdate();
    } catch (e) {
      console.error('Error applying update:', e);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
  };

  if (!hasUpdate || !isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-indigo-500/30 bg-slate-900/95 p-6 text-center text-white shadow-2xl backdrop-blur-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Decorative Glow */}
          <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-36 w-48 rounded-full bg-indigo-500/25 blur-3xl" />

          {/* Close button at top right */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Icon Badge */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30 border border-white/20">
            <Smartphone className="h-8 w-8 text-white animate-pulse" />
          </div>

          {/* Title */}
          <h3 className="font-display text-xl font-bold tracking-tight text-white">
            ¡Actualización disponible!
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs leading-relaxed text-slate-300 font-sans">
            Hay una nueva versión de <strong>Scrum Planning Poker</strong> lista para tu dispositivo móvil con las últimas mejoras y correcciones.
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 text-[11px] font-medium text-indigo-300 font-sans">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Nueva versión descargada</span>
          </div>

          <p className="mt-3 text-xs text-slate-400 font-sans">
            ¿Deseas aceptar e instalar la actualización ahora?
          </p>

          {/* Actions */}
          <div className="mt-5 flex flex-col gap-2.5">
            <button
              onClick={handleAcceptUpdate}
              disabled={isUpdating}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 px-4 font-display text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:brightness-110 active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? 'Actualizando...' : 'Aceptar y Actualizar'}</span>
            </button>

            <button
              onClick={handleDismiss}
              disabled={isUpdating}
              className="w-full rounded-2xl py-2.5 px-4 font-sans text-xs font-semibold text-slate-400 transition-colors hover:text-white cursor-pointer"
            >
              Más tarde
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
