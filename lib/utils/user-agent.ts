/**
 * LINE・Instagram・Facebook などのアプリ内ブラウザかどうか。
 * Google はアプリ内ブラウザでのログインを拒否する（403 disallowed_useragent）。
 */
export function isInAppBrowser(userAgent: string): boolean {
  return /\bLine\/|Instagram|FBAN|FBAV|FB_IAB|MicroMessenger|; wv\)/i.test(userAgent);
}

export function isIOS(userAgent: string): boolean {
  return /iPhone|iPad|iPod/i.test(userAgent);
}
