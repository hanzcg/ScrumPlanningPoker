/**
 * Triggers a short vibration on supported devices (haptic feedback).
 * @param enabled Whether haptic feedback is enabled in settings.
 * @param duration Duration in milliseconds (default 15ms).
 */
export function triggerHaptic(enabled: boolean, duration = 15) {
  if (enabled && typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      // Using standard vibration API
      navigator.vibrate(duration);
    } catch (e) {
      // Audio or vibration blocked or not supported on the browser/device
    }
  }
}
