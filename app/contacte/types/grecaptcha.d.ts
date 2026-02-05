// Global type declarations for reCAPTCHA Enterprise
// This file extends the Window interface to include grecaptcha

export {};

declare global {
  interface Window {
    grecaptcha?: {
      enterprise?: {
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
        ready: (callback: () => void) => void;
      };
    };
  }
}
