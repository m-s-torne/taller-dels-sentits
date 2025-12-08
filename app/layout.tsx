import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { Playfair_Display, Inter } from 'next/font/google';
import "./globals.css";
import Header from "./_components/Header";
import logoImg from '@/app/_assets/logo-taller.svg'
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
  title: "Taller dels Sentits",
  description: "Centre d'artteràpia a Vilanova i la Geltrú",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        <Header logoImg={logoImg.src}/>
        {children}
        <Footer/>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
