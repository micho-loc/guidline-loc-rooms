"use client";

import { useState } from "react";
import { useLang } from "@/components/language";
import { messages } from "@/lib/i18n";

export function CopyButton({ value }: { value: string }) {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 bg-white border text-ocean-700 hover:bg-ocean-50 text-xs font-bold rounded-lg shadow-sm transition-all self-start sm:self-auto ${
        copied ? "bg-green-50/50 border-green-200" : "border-slate-200"
      }`}
    >
      <i className={copied ? "fa-solid fa-check text-green-500" : "fa-regular fa-copy"} />
      <span>{copied ? messages[lang].copied : messages[lang].copy}</span>
    </button>
  );
}
