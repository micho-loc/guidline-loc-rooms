"use client";

import Link from "next/link";
import { T, useLang } from "@/components/language";
import type { MessageKey } from "@/lib/i18n";

export function GuideHeader({
  titleKey,
  subtitleKey,
  icon,
}: {
  titleKey: MessageKey;
  subtitleKey: MessageKey;
  icon: string;
}) {
  const { href } = useLang();
  return (
    <div className="flex items-center gap-3 mb-7">
      <Link
        href={href("/")}
        className="btn-back w-9 h-9 rounded-full flex items-center justify-center text-ocean-600 border border-slate-200 bg-white"
      >
        <i className="fa-solid fa-arrow-left text-sm" />
      </Link>
      <div>
        <h2 className="text-ocean-800 font-semibold text-lg leading-tight">
          <T k={titleKey} />
        </h2>
        <p className="text-slate-400 text-xs">
          <T k={subtitleKey} />
        </p>
      </div>
      <div className="ml-auto hidden sm:flex">
        <div
          className="icon-circle bg-ocean-50 text-ocean-500"
          style={{ width: 44, height: 44, fontSize: 20 }}
        >
          <i className={`fa-solid ${icon}`} />
        </div>
      </div>
    </div>
  );
}

export function BackHome() {
  const { href } = useLang();
  return (
    <Link
      href={href("/")}
      className="btn-back w-full mt-5 py-3 rounded-xl border border-slate-200 bg-white text-ocean-600 text-sm font-medium flex items-center justify-center gap-2"
    >
      <i className="fa-solid fa-grid-2 text-xs" />
      <T k="backHome" />
    </Link>
  );
}
