"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { PWAInstallPrompt } from "./pwa-install-prompt";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem storageKey="theme-preference">
        {children}
        <Toaster richColors position="top-right" />
        <PWAInstallPrompt />
      </ThemeProvider>
    </SessionProvider>
  );
}
