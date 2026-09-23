"use client";

import { CopyButton } from "@/components/copy-button";
import { BackHome, GuideHeader } from "@/components/guide-header";
import { T } from "@/components/language";
import type { SiteSettings } from "@/lib/types";

export function WifiView({ settings }: { settings: SiteSettings }) {
  return (
    <main className="flex-1 flex flex-col items-center px-4 pb-12">
      <section className="w-full max-w-2xl mt-4">
        <GuideHeader titleKey="wifiGuideTitle" subtitleKey="wifiGuideSub" icon="fa-wifi" />
        <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <Credential labelKey="ssidLabel" value={settings.wifiSsid} />
          <Credential labelKey="passwordLabel" value={settings.wifiPassword} />
        </div>
        <BackHome />
      </section>
    </main>
  );
}

function Credential({
  labelKey,
  value,
}: {
  labelKey: "ssidLabel" | "passwordLabel";
  value: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-3">
      <div>
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-0.5">
          <T k={labelKey} />
        </span>
        <span className="text-ocean-800 font-bold text-lg select-all">{value}</span>
      </div>
      <CopyButton value={value} />
    </div>
  );
}
