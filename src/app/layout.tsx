import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#020617' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "EconoSim | Advanced Economic Strategy & Simulation",
    template: "%s | EconoSim",
  },
  description: "Master the hidden mathematics of everyday life. EconoSim is an interactive economic simulator that helps you visualize opportunity cost, compound interest, and financial trade-offs through realistic scenarios.",
  keywords: ["economics", "simulator", "financial planning", "opportunity cost", "compound interest", "personal finance", "wealth building", "education"],
  authors: [{ name: "EconoSim Intelligence Lab" }],
  creator: "EconoSim Team",
  publisher: "EconoSim Inc.",
  metadataBase: new URL('https://econosim.app'),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "EconoSim | Advanced Economic Strategy & Simulation",
    description: "Visualize the hidden math of everyday economic decisions. Compare scenarios, understand trade-offs, and master your financial future.",
    url: 'https://econosim.app',
    siteName: 'EconoSim',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "EconoSim | Advanced Economic Strategy & Simulation",
    description: "Visualize the hidden math of everyday economic decisions.",
    creator: '@econosim',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
