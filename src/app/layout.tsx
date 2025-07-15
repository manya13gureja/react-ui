import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import { Golos_Text, Pacifico, Red_Rose } from "next/font/google";
import "./globals.css";
import AnimatedNoiseBackground from "@/app/components/AnimatedNoiseBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

const golos = Golos_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-golos",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-logo",
});

const redrose = Red_Rose({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-redrose",
});

export const metadata: Metadata = {
  title: "ui interactions",
  description: "different ui interactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} ${golos.variable} ${pacifico.variable} ${redrose.variable} antialiased`}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <AnimatedNoiseBackground />
        <div style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
