"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LanguageProvider, useLanguage } from "@/lib/i18n";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

function LayoutInner({ children }: { children: ReactNode }) {
  const { language, dir } = useLanguage();
  const pathname = usePathname();
  const hideFooter = pathname?.startsWith("/chat");

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  return (
    <>
      <TopBar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <LayoutInner>{children}</LayoutInner>
    </LanguageProvider>
  );
}
