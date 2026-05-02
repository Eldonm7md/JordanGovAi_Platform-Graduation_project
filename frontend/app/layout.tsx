import type { Metadata } from "next";
import {
  IBM_Plex_Sans_Arabic,
  Inter,
  JetBrains_Mono,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-source-serif-4",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JordanGov AI Assistant | المساعد الحكومي الأردني الذكي",
  description:
    "Bilingual AI assistant for Jordanian government services - مساعد ذكي ثنائي اللغة للخدمات الحكومية الأردنية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} ${ibmPlexSansArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
