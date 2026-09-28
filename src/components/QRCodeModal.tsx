import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, X, Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}

const DEFAULT_URL = 'https://scrum-planning-poker-hcg.web.app/';

export default function QRCodeModal({ isOpen, onClose, url = DEFAULT_URL }: QRCodeModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      })
        .then((dataUrl) => setQrCodeUrl(dataUrl))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [isOpen, url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Error copying URL:', e);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Scrum Planning Poker',
          text: 'Estima historias de usuario ágiles con Scrum Planning Poker',
          url,
        });
      } catch (e) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 p-6 text-center shadow-2xl backdrop-blur-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle glow effect */}
          <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-36 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header Icon */}
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 border border-white/20">
            <QrCode className="h-7 w-7 text-white" />
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Compartir Aplicación
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            Escanea con la cámara de tu móvil para abrir o instalar Scrum Planning Poker
          </p>

          {/* QR Code Container */}
          <div className="mt-5 flex justify-center">
            <div className="rounded-2xl bg-white p-3.5 shadow-xl border border-slate-200 dark:border-white/10">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Código QR de Scrum Planning Poker"
                  className="h-52 w-52 rounded-lg block select-none"
                />
              ) : (
                <div className="flex h-52 w-52 items-center justify-center text-slate-400">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                </div>
              )}
            </div>
          </div>

          {/* URL text chip */}
          <div className="mt-4 flex items-center justify-center">
            <span className="inline-block max-w-[280px] truncate rounded-lg bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-[11px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
              {url}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white py-2.5 px-3 text-xs font-semibold font-sans transition-all active:scale-95 cursor-pointer border border-slate-200/60 dark:border-white/10"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar enlace</span>
                </>
              )}
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator ? (
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 text-xs font-semibold font-sans shadow-md shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Compartir</span>
              </button>
            ) : (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 text-xs font-semibold font-sans shadow-md shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Abrir</span>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
