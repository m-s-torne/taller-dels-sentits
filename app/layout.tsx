import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import Header from "./_components/Header";
import logoImg from '@/app/_assets/logo-taller.svg'
import Footer from "./_components/Footer";

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
        className={`antialiased`}
      >
        <Header logoImg={logoImg.src}/>
        {children}
        <Footer logoImg={logoImg.src}/>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
