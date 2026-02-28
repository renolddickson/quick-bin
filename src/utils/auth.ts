// src/utils/auth.ts

export const AUTH_COOKIE_NAME = 'sb-access-token';

export function getAuthToken(): string | null {
  const name = AUTH_COOKIE_NAME + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

export function setAuthToken(token: string) {
  const date = new Date();
  date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; ${expires}; path=/; SameSite=Lax`;
}

export function removeAuthToken() {
  document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function loginWithSluggy(): Promise<string> {
  return new Promise((resolve, reject) => {
    const sluggyUrl = import.meta.env.VITE_SHORT_LINK + 'auth/login';
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      sluggyUrl,
      'Connect with Sluggy',
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,toolbar=no,menubar=no,scrollbars=yes`
    );

    if (!popup) {
      reject(new Error('Popup blocked or failed to open'));
      return;
    }

    const messageListener = (event: MessageEvent) => {
      // Basic origin check - ideally we'd use import.meta.env.VITE_SHORT_LINK
      // but "*" is often used for development if ports vary. 
      // For security, it's better to be specific.
      const sluggyOrigin = new URL(import.meta.env.VITE_SHORT_LINK).origin;
      if (event.origin !== sluggyOrigin) return;

      if (event.data?.type === 'AUTH_SUCCESS') {
        const token = event.data.token;
        if (token) {
          setAuthToken(token);
          resolve(token);
        } else {
          reject(new Error('No token received from auth window'));
        }
        window.removeEventListener('message', messageListener);
      }
    };

    window.addEventListener('message', messageListener);

    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        window.removeEventListener('message', messageListener);
        reject(new Error('Login window closed'));
      }
    }, 1000);
  });
}
