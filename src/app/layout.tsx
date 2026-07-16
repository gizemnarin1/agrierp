import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AgriERP - Akıllı Tarım Asistanı",
  description: "Tarım ve hal ticareti günlük veri girişlerini AI ile otomatikleştiren, anlık kar-zarar ve stok takibi sağlayan ERP sistemi.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgriERP",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#03140b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground flex flex-col pb-24 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-2 animate-slide-in">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
