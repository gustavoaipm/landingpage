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
  title: "Gustavo AI - AI-Powered Property Management Platform",
  description: "Revolutionize your property management with Gustavo AI. Streamline operations with intelligent automation, predictive analytics, and seamless tenant communication. Manage properties smarter, not harder.",
  keywords: [
    "AI property management",
    "property management software",
    "tenant screening",
    "rental automation",
    "property analytics",
    "real estate management",
    "AI automation",
    "property management platform"
  ],
  authors: [{ name: "Gustavo AI" }],
  creator: "Gustavo AI",
  publisher: "Gustavo AI",
  robots: "index, follow",
  openGraph: {
    title: "Gustavo AI - AI-Powered Property Management Platform",
    description: "Revolutionize your property management with intelligent automation and predictive analytics.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gustavo AI - AI-Powered Property Management Platform",
    description: "Revolutionize your property management with intelligent automation and predictive analytics.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
