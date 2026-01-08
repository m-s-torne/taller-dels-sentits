import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { Playfair_Display, Inter } from 'next/font/google';
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Taller dels Sentits - Artteràpia a Vilanova i la Geltrú",
    template: "%s | Taller dels Sentits",
  },
  description: "Centre d'artteràpia i expressió plàstica a Vilanova i la Geltrú. Oferim un espai de permís i escolta.",
  keywords: [
    "artteràpia", "Vilanova i la Geltrú", "teràpia art", 
    "art teràpia", "centre artteràpia", "artteràpia individual", 
    "artteràpia grupal", "teràpia emocional", "gestalt",
    "artperdins", "art per dins", ""
  ],
  authors: [
    { name: "Taller dels Sentits" }, 
    { name: "Marc Serra i Torné" }
  ],
  creator: "Taller dels Sentits",
  publisher: "Taller dels Sentits",
  openGraph: {
    type: "website",
    locale: "ca_ES",
    url: "https://taller-dels-sentits.vercel.app",
    siteName: "Taller dels Sentits",
    title: "Taller dels Sentits - Artteràpia a Vilanova i la Geltrú",
    description: "Centre d'artteràpia i expressió plàstica a Vilanova i la Geltrú. Oferim un espai de permís i escolta.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Taller dels Sentits - Centre d'Artteràpia",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://taller-dels-sentits.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        <Header logoImg="/logo-taller-dels-sentits.svg"/>
        {children}
        <Footer/>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
