"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { messages, type MessageKey } from "@/lib/i18n";
import { LANGS, type Lang, type Localized } from "@/lib/types";

const STORAGE_KEY = "preferredLang";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  href: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLang(value: string | null): value is Lang {
  return LANGS.includes(value as Lang);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [lang, setLangState] = useState<Lang>("id");

  useEffect(() => {
    const fromUrl = searchParams.get("lang");
    if (isLang(fromUrl)) {
      setLangState(fromUrl);
      window.localStorage.setItem(STORAGE_KEY, fromUrl);
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) setLangState(stored);
  }, [searchParams]);

  useEffect(() => {
    document.body.classList.toggle("lang-ja", lang === "ja");
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: (next) => {
        setLangState(next);
        window.localStorage.setItem(STORAGE_KEY, next);
        const params = new URLSearchParams(searchParams.toString());
        params.set("lang", next);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      },
      href: (path) => `${path}?lang=${lang}`,
    }),
    [lang, pathname, router, searchParams],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLang must be used within LanguageProvider");
  return context;
}

export function T({
  k,
  className,
}: {
  k: MessageKey;
  className?: string;
}) {
  const { lang } = useLang();
  const value = messages[lang][k];
  if (!value.includes("\n")) {
    return <span className={className}>{value}</span>;
  }
  const lines = value.split("\n");
  return (
    <span className={className}>
      {lines.map((line, index) => (
        <span key={line}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </span>
  );
}

export function L({ text }: { text: Localized }) {
  const { lang } = useLang();
  return <>{text[lang]}</>;
}
