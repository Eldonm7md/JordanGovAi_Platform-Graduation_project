"use client";

import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { dir, t } = useLanguage();

  return (
    <footer dir={dir} className="border-t border-gray-200 bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[#006633]">
            <span className="text-xs font-bold text-white">JG</span>
          </div>
          <span className="text-sm font-semibold text-[#006633]">
            JordanGov AI Assistant
          </span>
        </div>
        <p className="text-sm text-gray-500">{t("footer.project")}</p>
        <p className="mt-1 text-xs text-gray-400">
          &copy; 2026 {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
