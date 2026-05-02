"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import Crest from "@/components/ui/Crest";
import Mono from "@/components/ui/Mono";
import Body from "@/components/ui/Body";

export default function Footer() {
  const { dir, t, language } = useLanguage();

  const cols = [
    {
      head: t("footer.col.site"),
      items: [
        { label: t("nav.home"),     href: "/" },
        { label: t("nav.chat"),     href: "/chat" },
        { label: t("nav.services"), href: "/services" },
        { label: t("nav.about"),    href: "/about" },
      ],
    },
    {
      head: t("footer.col.resources"),
      items: [
        { label: t("footer.docs"),     href: "#" },
        { label: "API · Reference",    href: "#" },
        { label: t("footer.ragNotes"), href: "#" },
        { label: "GitHub",             href: "#" },
      ],
    },
    {
      head: t("footer.col.contact"),
      items: [
        { label: "jordangov.ai",        href: "#" },
        { label: "team@jordangov.ai",   href: "mailto:team@jordangov.ai" },
        { label: "Twitter / X",         href: "#" },
        { label: "LinkedIn",            href: "#" },
      ],
    },
  ];

  return (
    <footer
      dir={dir}
      style={{
        borderTop: "2px solid var(--color-primary)",
        background: "var(--color-primary-deep)",
        color: "#cfd9d4",
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
          padding: "48px 56px 32px",
          gap: 40,
        }}
      >
        <div>
          <div className="flex items-center gap-3 mb-[18px]">
            <Crest size={36} color="#cfd9d4" />
            <div className="leading-[1.2]">
              <span
                className="block"
                style={{
                  fontFamily: dir === "rtl" ? "var(--font-arabic)" : "var(--font-serif)",
                  fontSize: 19,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                {t("footer.lockup")}
              </span>
              <Mono style={{ fontSize: 10, color: "#9caea8" }}>
                {t("footer.tagline")} · 2026
              </Mono>
            </div>
          </div>
          <Body style={{ fontSize: 13, color: "#b3c1bc", maxWidth: 360 }}>
            {t("footer.about")}
          </Body>
        </div>

        {cols.map((c) => (
          <div key={c.head}>
            <Mono
              as="div"
              style={{ fontSize: 10, color: "#9caea8", marginBottom: 16 }}
            >
              {c.head}
            </Mono>
            <ul className="list-none p-0 m-0 grid gap-2.5">
              {c.items.map((it) => (
                <li
                  key={it.label}
                  style={{
                    fontSize: 13,
                    color: "#dde6e2",
                    fontFamily: dir === "rtl" ? "var(--font-arabic)" : "var(--font-sans)",
                  }}
                >
                  <Link
                    href={it.href}
                    className="transition-colors"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="flex justify-between"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.10)",
          padding: "16px 56px",
        }}
      >
        <Mono style={{ fontSize: 10, color: "#9caea8" }}>
          © 2026 · {t("footer.rights")}
          {language === "ar" ? "" : ""}
        </Mono>
        <Mono style={{ fontSize: 10, color: "#9caea8" }}>{t("footer.built")}</Mono>
      </div>
    </footer>
  );
}
