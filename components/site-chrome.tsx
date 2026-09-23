"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LANGS, type Lang } from "@/lib/types";
import { T, useLang } from "@/components/language";
import type { MessageKey } from "@/lib/i18n";

const FLAGS: Record<Lang, string> = {
  id: "https://flagcdn.com/16x12/id.png",
  en: "https://flagcdn.com/16x12/gb.png",
  ja: "https://flagcdn.com/16x12/jp.png",
};

function Logo() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="flex items-center gap-2">
        <span
          className="icon-circle bg-ocean-600 text-white"
          style={{ width: 36, height: 36, fontSize: 16 }}
        >
          <i className="fa-solid fa-droplet" />
        </span>
        <span className="font-display text-ocean-700 text-lg tracking-tight">
          Laut Otsuka
        </span>
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo-loc.png"
      className="h-9 object-contain"
      alt="Laut Otsuka"
      onError={() => setFailed(true)}
    />
  );
}

export function SiteChrome({
  children,
  badgeKey = "badge",
  showQrLink = true,
  printable = false,
}: {
  children: React.ReactNode;
  badgeKey?: MessageKey;
  showQrLink?: boolean;
  printable?: boolean;
}) {
  const { lang, setLang, href } = useLang();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className={`orb w-96 h-96 bg-ocean-100 opacity-40 ${printable ? "no-print" : ""}`}
        style={{ top: -80, right: -80 }}
      />
      <div
        className={`orb w-64 h-64 bg-cyan-light opacity-60 ${printable ? "no-print" : ""}`}
        style={{ bottom: 40, left: -60 }}
      />

      <header
        className={`relative px-4 sm:px-6 pt-6 sm:pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between max-w-2xl mx-auto w-full gap-4 ${printable ? "no-print" : ""}`}
      >
        <Link href={href("/")} className="flex items-center gap-3">
          <Logo />
        </Link>
        <div className="flex items-center gap-3 justify-center w-full sm:w-auto">
          {showQrLink ? (
            <Link
              href={href("/qr")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-ocean-400 hover:bg-ocean-50/20 text-ocean-800 font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              <i className="fa-solid fa-qrcode text-ocean-600" />
              <T k="qrLink" />
            </Link>
          ) : null}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-ocean-400 hover:bg-ocean-50/20 text-ocean-800 font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              onClick={() => setOpen((value) => !value)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FLAGS[lang]}
                className="w-4 h-3 object-cover border border-slate-200"
                alt=""
              />
              <span className="uppercase">{lang}</span>
              <i
                className={`fa-solid fa-chevron-down text-[9px] text-slate-400 ml-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open ? (
              <div className="absolute right-0 mt-1.5 w-24 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-50">
                {LANGS.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setLang(code);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs font-semibold transition-colors ${
                      code === lang
                        ? "bg-ocean-50 text-ocean-700 font-bold"
                        : "text-slate-600 hover:bg-ocean-50 hover:text-ocean-700"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={FLAGS[code]}
                      className="w-4 h-3 object-cover border border-slate-200"
                      alt=""
                    />
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <span className="badge">
            <i
              className={`fa-solid ${badgeKey === "qrBadge" ? "fa-qrcode" : "fa-circle-info"} mr-1`}
            />
            <T k={badgeKey} />
          </span>
        </div>
      </header>

      <div className="relative flex-1 flex flex-col">{children}</div>

      <footer className={`text-center py-5 px-4 ${printable ? "no-print" : ""}`}>
        <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
          <i className="fa-regular fa-user" />
          <T k="footer" />
        </div>
      </footer>
    </div>
  );
}
