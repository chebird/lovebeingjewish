import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lovebeingjewish.com"),
  title: "Love Being Jewish",
  description: "LOVE. BEING. JEWISH.",
  icons: {
    icon: "/favicon-lbj.svg",
    shortcut: "/favicon-lbj.svg",
  },
  openGraph: {
    title: "Love Being Jewish",
    description: "LOVE. BEING. JEWISH.",
    url: "https://www.lovebeingjewish.com",
    siteName: "Love Being Jewish",
  },
  twitter: {
    card: "summary",
    title: "Love Being Jewish",
    description: "LOVE. BEING. JEWISH.",
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
