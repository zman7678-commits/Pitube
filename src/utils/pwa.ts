/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const OFFICIAL_APP_URL = 'https://ais-pre-ipt2msybhzt72mv6qcszpx-387084021019.asia-southeast1.run.app';

export function getShareUrl(): string {
  if (typeof window !== 'undefined') {
    // If running in development or preview, use the stable shared preview URL so friends can access it
    if (window.location.hostname.includes('localhost') || window.location.hostname.includes('ais-dev')) {
      return OFFICIAL_APP_URL;
    }
    return window.location.origin;
  }
  return OFFICIAL_APP_URL;
}

export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-expect-error - iOS Safari specific property
    Boolean(window.navigator.standalone)
  );
}

export function getPlatformType(): 'ios' | 'android' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  }
  if (/android/.test(ua)) {
    return 'android';
  }
  return 'desktop';
}
