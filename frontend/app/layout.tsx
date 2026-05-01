import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
