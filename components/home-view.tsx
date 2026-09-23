"use client";

import Link from "next/link";
import { T, useLang } from "@/components/language";

export function HomeView() {
  const { href } = useLang();
  return (
    <main className="flex-1 flex flex-col items-center px-4 pb-12">
      <section className="w-full max-w-2xl mt-6">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest text-cyan-deep uppercase mb-3">
            <T k="setupGuide" />
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-ocean-700 leading-tight mb-3">
            <T k="homeTitle" />
          </h1>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
            <T k="homeSubtitle" />
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={href("/wifi")}
            className="choice-card bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
          >
            <div className="icon-circle bg-ocean-50 text-ocean-500">
              <i className="fa-solid fa-wifi" />
            </div>
            <div className="flex-1">
              <h2 className="text-ocean-800 font-semibold text-lg mb-1">
                <T k="wifiTitle" />
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                <T k="wifiDesc" />
              </p>
            </div>
            <div className="flex items-center gap-2 text-cyan-deep text-sm font-medium mt-1">
              <T k="startGuide" />
              <i className="fa-solid fa-arrow-right text-xs" />
            </div>
          </Link>
          <Link
            href={href("/proyektor")}
            className="choice-card bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
          >
            <div className="icon-circle bg-ocean-50 text-ocean-500">
              <i className="fa-solid fa-display" />
            </div>
            <div className="flex-1">
              <h2 className="text-ocean-800 font-semibold text-lg mb-1">
                <T k="projTitle" />
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                <T k="projDesc" />
              </p>
            </div>
            <div className="flex items-center gap-2 text-cyan-deep text-sm font-medium mt-1">
              <T k="startGuide" />
              <i className="fa-solid fa-arrow-right text-xs" />
            </div>
          </Link>
        </div>
        <p className="text-center text-slate-400 text-xs mt-8">
          <i className="fa-regular fa-clock mr-1" />
          <T k="estTime" />
        </p>
      </section>
    </main>
  );
}
