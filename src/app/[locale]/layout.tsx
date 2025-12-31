import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { WhatsAppButton } from "@/components/chat/whatsapp-button";
import { Toaster } from "@/components/ui/sonner";
import { ComparisonFloatingBar } from "@/components/tools/comparison-floating-bar";
import { FeatureFlagProvider } from "@/providers/feature-flag-provider";
import { getFeatureFlags } from "@/lib/features";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "High-End Car Marketplace | Digital Showroom",
  description: "Experience the finest second-hand vehicles with our digital showroom experience.",
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const flags = await getFeatureFlags();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          <FeatureFlagProvider initialFlags={flags}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatWidget />
            <WhatsAppButton />
            <ComparisonFloatingBar />
            <Toaster />
          </FeatureFlagProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
