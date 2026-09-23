"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type QRCodeStyling from "qr-code-styling";
import { T, useLang } from "@/components/language";
import { displayUrl, pick } from "@/lib/content";
import type { Localized } from "@/lib/types";

const STYLE = {
  dotsOptions: { color: "#0a4c8c", type: "rounded" as const },
  backgroundOptions: { color: "#ffffff" },
  cornersSquareOptions: { color: "#0a4c8c", type: "extra-rounded" as const },
  cornersDotOptions: { color: "#00b4d8", type: "dot" as const },
};

export function QrPanel({ url, title, subtitle }: { url: string; title: Localized; subtitle: Localized }) {
  const { lang, href } = useLang();
  const canvasRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const label = displayUrl(url);

  useEffect(() => {
    let cancelled = false;
    const host = canvasRef.current;
    if (!host) return;

    async function draw() {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      if (cancelled || !host) return;
      host.innerHTML = "";
      const qr = new QRCodeStyling({
        width: 260,
        height: 260,
        data: url,
        image: "/images/logo-loc.png",
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 6,
          imageSize: 0.35,
          hideBackgroundDots: true,
        },
        ...STYLE,
      });
      qr.append(host);
      qrRef.current = qr;
    }

    void draw();
    return () => {
      cancelled = true;
    };
  }, [url]);

  async function download(extension: "png" | "svg") {
    const { default: QRCodeStyling } = await import("qr-code-styling");
    const qr = new QRCodeStyling({
      width: 1024,
      height: 1024,
      type: extension === "svg" ? "svg" : "canvas",
      data: url,
      image: `${window.location.origin}/images/logo-loc.png`,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 24,
        imageSize: 0.35,
        hideBackgroundDots: true,
      },
      ...STYLE,
    });
    await qr.download({ name: "laut-otsuka-qr", extension });
  }

  return (
    <main className="flex-grow flex items-center justify-center px-4 py-8">
      <div className="print-container bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-3xl p-6 sm:p-8 max-w-md w-full text-center flex flex-col items-center">
        <div className="w-full flex justify-start mb-4 no-print">
          <Link
            href={href("/")}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-ocean-600 transition-colors font-medium"
          >
            <i className="fa-solid fa-arrow-left" />
            <T k="backToGuide" />
          </Link>
        </div>
        <div className="mb-5">
          <h1 className="font-display text-2xl font-bold text-ocean-700 leading-tight mb-2">
            {pick(title, lang)}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            {pick(subtitle, lang)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-md inline-block mb-4 print-qr-wrapper">
          <div ref={canvasRef} className="flex items-center justify-center overflow-hidden" />
        </div>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-slate-800 text-sm font-bold tracking-wide mb-3">
            <i className="fa-solid fa-link text-xs text-cyan-deep" />
            <span className="select-all">{label}</span>
          </div>
          <p className="text-slate-400 text-xs max-w-[260px] mx-auto leading-relaxed">
            <T k="qrInstruction" />
          </p>
        </div>
        <div className="w-full flex flex-col gap-2.5 no-print">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => download("png")}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-gradient-to-r from-ocean-600 to-ocean-500 hover:from-ocean-700 hover:to-ocean-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <i className="fa-solid fa-file-image" />
              <T k="downloadPng" />
            </button>
            <button
              type="button"
              onClick={() => download("svg")}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white border border-slate-200 text-ocean-700 hover:bg-ocean-50 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <i className="fa-solid fa-file-code" />
              <T k="downloadSvg" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1.5 py-2.5 w-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <i className="fa-solid fa-print" />
            <T k="printQr" />
          </button>
        </div>
      </div>
    </main>
  );
}
