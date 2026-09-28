import { registerSW } from 'virtual:pwa-register';

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const userAgentCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const screenCheck = window.innerWidth <= 768;
  return userAgentCheck || (touchCheck && screenCheck);
};

type UpdateCallback = (hasUpdate: boolean) => void;

class PWAManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable: boolean = false;
  private listeners: Set<UpdateCallback> = new Set();
  private updateSW: ((reloadPage?: boolean) => Promise<void>) | null = null;
  private isRefreshing: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Refresh cleanly when the new service worker activates and claims the clients
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.isRefreshing) return;
      this.isRefreshing = true;
      window.location.reload();
    });

    this.updateSW = registerSW({
      immediate: true,
      onNeedRefresh: () => {
        this.updateAvailable = true;
        if (isMobileDevice()) {
          // On mobile: notify listeners to display the confirmation popup modal
          this.notifyListeners(true);
        } else {
          // On desktop: apply update directly without blocking popup
          this.applyUpdate();
        }
      },
      onOfflineReady: () => {
        console.log('[PWA] Aplicación lista para funcionar sin conexión.');
      },
      onRegisteredSW: (_swUrl, reg) => {
        if (!reg) return;
        this.registration = reg;

        // 1. Mobile resume: Check for updates when user returns to the app
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            this.checkForUpdates();
          }
        });

        // 2. Check for updates on window focus
        window.addEventListener('focus', () => {
          this.checkForUpdates();
        });

        // 3. Check for updates when device reconnects
        window.addEventListener('online', () => {
          this.checkForUpdates();
        });

        // 4. Periodic background check every 15 minutes
        setInterval(() => {
          this.checkForUpdates();
        }, 15 * 60 * 1000);
      },
      onRegisterError: (error) => {
        console.error('[PWA] Error al registrar el Service Worker:', error);
      },
    });
  }

  public subscribe(callback: UpdateCallback): () => void {
    this.listeners.add(callback);
    // If an update is already waiting and it's a mobile device, immediately notify
    if (this.updateAvailable && isMobileDevice()) {
      callback(true);
    } else {
      callback(false);
    }
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(hasUpdate: boolean) {
    this.listeners.forEach((callback) => callback(hasUpdate));
  }

  public async checkForUpdates(): Promise<'updated' | 'no-update' | 'error' | 'unsupported'> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return 'unsupported';
    }

    try {
      if (!this.registration) {
        this.registration = await navigator.serviceWorker.ready;
      }

      await this.registration.update();

      if (this.registration.installing) {
        return new Promise((resolve) => {
          const worker = this.registration?.installing;
          if (!worker) {
            resolve('updated');
            return;
          }
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' || worker.state === 'activated') {
              this.updateAvailable = true;
              if (isMobileDevice()) {
                this.notifyListeners(true);
              } else {
                this.applyUpdate();
              }
              resolve('updated');
            }
          });
        });
      }

      if (this.registration.waiting) {
        this.updateAvailable = true;
        if (isMobileDevice()) {
          this.notifyListeners(true);
        } else {
          this.applyUpdate();
        }
        return 'updated';
      }

      return 'no-update';
    } catch (err) {
      console.error('[PWA] Error al verificar actualizaciones:', err);
      return 'error';
    }
  }

  public async applyUpdate() {
    // If waiting worker exists, message it to skip waiting
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    if (this.updateSW) {
      await this.updateSW(true);
    }
    window.location.reload();
  }
}

export const pwaManager = new PWAManager();
