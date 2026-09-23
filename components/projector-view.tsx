"use client";

import { CopyButton } from "@/components/copy-button";
import { BackHome, GuideHeader } from "@/components/guide-header";
import { L, T, useLang } from "@/components/language";
import { pick } from "@/lib/content";
import type { GuideContent } from "@/lib/types";

export function ProjectorView({ content, categorySlug }: { content: GuideContent; categorySlug?: string }) {
  const { lang } = useLang();
  const slug = categorySlug || "proyektor";
  const category = content.categories.find(c => c.slug === slug);
  
  // If it's the default projector or wifi, we might want to show specific sections
  // For dynamic categories, we just show all steps belonging to that slug
  const steps = content.steps.filter((step) => step.section === slug);
  
  // Fallback for the original hardcoded sections if they don't match the slug directly
  // (This is to support the existing "install" and "connect" sections for the projector page)
  const installSteps = content.steps.filter((step) => step.section === "install");
  const connectSteps = content.steps.filter((step) => step.section === "connect");

  const { settings, rooms } = content;

  return (
    <main className="flex-1 flex flex-col items-center px-4 pb-12">
      <section className="w-full max-w-2xl mt-4">
        <div className="flex items-center gap-3 mb-7">
          <a href="/" className="btn-back w-9 h-9 rounded-full flex items-center justify-center text-ocean-600 border border-slate-200 bg-white">
            <i className="fa-solid fa-arrow-left text-sm" />
          </a>
          <div>
            <h2 className="text-ocean-800 font-semibold text-lg leading-tight">
              {category ? pick(category.title, lang) : "Guide"}
            </h2>
            <p className="text-slate-400 text-xs">
              {category ? pick(category.description, lang) : ""}
            </p>
          </div>
          <div className="ml-auto hidden sm:flex">
            <div className="icon-circle bg-ocean-50 text-ocean-500" style={{ width: 44, height: 44, fontSize: 20 }}>
              <i className={`fa-solid ${category?.icon || "fa-circle-info"}`} />
            </div>
          </div>
        </div>

        {slug === "proyektor" ? (
          <>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 flex flex-col mb-6">
              <h3 className="text-ocean-800 font-bold text-base flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
                <i className="fa-solid fa-download text-cyan-mid" />
                <T k="projSectionInstall" />
              </h3>
              <div className="p-4 bg-cyan-light/40 border border-cyan-100 rounded-xl mb-6 flex items-start gap-3">
                <div className="text-cyan-deep text-lg mt-0.5">
                  <i className="fa-solid fa-cloud-arrow-down" />
                </div>
                <div className="flex-1">
                  <span className="text-slate-600 text-xs font-semibold uppercase tracking-wider block mb-1">
                    <T k="downloadLabel" />
                  </span>
                  <span className="text-slate-500 text-xs leading-relaxed block">
                    <T k="downloadInstruction" />{" "}
                    <a
                      href={settings.installerPath}
                      download
                      className="text-cyan-deep hover:underline font-bold break-all"
                    >
                      Download {settings.installerFilename}
                    </a>
                  </span>
                </div>
              </div>
              <Steps items={installSteps} />
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 flex flex-col mb-6">
              <h3 className="text-ocean-800 font-bold text-base flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
                <i className="fa-solid fa-link text-cyan-mid" />
                <T k="projSectionConnect" />
              </h3>
              <Steps items={connectSteps} />
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
              <h3 className="text-ocean-800 font-semibold text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <i className="fa-solid fa-network-wired text-cyan-mid" />
                <T k="projIpsTitle" />
              </h3>
              <div className="flex flex-col gap-3">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/80"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-500">{room.name}</span>
                      <span className="text-ocean-800 font-bold text-sm select-all">
                        {room.ipAddress}
                      </span>
                    </div>
                    <CopyButton value={room.ipAddress} />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 flex flex-col mb-6">
            <Steps items={steps} />
          </div>
        )}

        <div className="note-box p-4 mt-4">
          <p className="text-ocean-700 text-xs font-medium mb-1">
            <i className="fa-solid fa-circle-exclamation mr-1 text-cyan-deep" />
            <T k="tips" />
          </p>
          <p className="text-slate-500 text-xs leading-relaxed">
            <L text={settings.projectorNote} />
          </p>
        </div>
        <BackHome />
      </section>
    </main>
  );
}

function Steps({ items }: { items: GuideContent["steps"] }) {
  return (
    <>
      {items.map((step, index) => (
        <div key={step.id} className="step flex gap-4">
          <div className="flex flex-col items-center">
            <div className="step-num">
              {step.isFinal ? <i className="fa-solid fa-check text-xs" /> : index + 1}
            </div>
            {index < items.length - 1 ? <div className="step-line flex-grow my-1" /> : null}
          </div>
          <div className="pb-6">
            <p className="font-medium text-ocean-800 text-sm mb-1">
              <L text={step.title} />
            </p>
            <p className="text-slate-500 text-sm leading-relaxed mb-3">
              <L text={step.body} />
            </p>
            {step.imagePath ? (
              <div className="overflow-hidden rounded-xl border border-slate-100 max-w-sm sm:max-w-md bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.imagePath}
                  className="w-full h-auto max-h-48 object-contain"
                  alt=""
                />
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
}
