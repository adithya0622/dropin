import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AURISTRA'26 Upgrade",
  description: "Skill upgrade dashboard with AI recommendations",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Upgrade",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#050816" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'><rect fill='%23050816' width='180' height='180'/><circle cx='90' cy='90' r='55' fill='%2306b6d4'/><path d='M90 55 L110 80 L100 80 L100 110 L80 110 L80 80 L70 80 Z' fill='%23050816'/></svg>" />
      </head>
      <body className="min-h-full bg-auristra-bg text-slate-100">
        <Providers>
          <Navbar />
          <MobileNav />
          <div className="mx-auto flex w-full max-w-7xl flex-col md:flex-row">
            <Sidebar />
            <main className="min-h-[calc(100vh-4rem)] flex-1 p-4 md:p-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
