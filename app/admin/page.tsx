"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import Swal from "sweetalert2";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (data) setSettings(data);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase
      .from("settings")
      .update({
        wifi_ssid: settings.wifi_ssid,
        wifi_password: settings.wifi_password,
        qr_url: settings.qr_url,
        installer_path: settings.installer_path,
        installer_filename: settings.installer_filename,
        qr_title_id: settings.qr_title_id,
        qr_title_en: settings.qr_title_en,
        qr_title_ja: settings.qr_title_ja,
        qr_subtitle_id: settings.qr_subtitle_id,
        qr_subtitle_en: settings.qr_subtitle_en,
        qr_subtitle_ja: settings.qr_subtitle_ja,
        projector_note_id: settings.projector_note_id,
        projector_note_en: settings.projector_note_en,
        projector_note_ja: settings.projector_note_ja,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setSaving(false);
    if (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menyimpan: " + error.message,
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    } else {
      Swal.fire({
        title: "Berhasil!",
        text: "Pengaturan berhasil disimpan.",
        icon: "success",
        confirmButtonColor: "#0a4c8c",
        timer: 1500,
        showConfirmButton: false
      });
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!settings) return <div>Data tidak ditemukan</div>;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-ocean-50 text-ocean-600 flex items-center justify-center text-lg">
          <i className="fa-solid fa-gear" />
        </div>
        <h2 className="text-2xl font-display font-bold text-ocean-800">General Settings</h2>
      </div>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">WiFi SSID</label>
            <input
              type="text"
              value={settings.wifi_ssid}
              onChange={(e) => setSettings({ ...settings, wifi_ssid: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">WiFi Password</label>
            <input
              type="text"
              value={settings.wifi_password}
              onChange={(e) => setSettings({ ...settings, wifi_password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">QR URL Target</label>
            <input
              type="url"
              value={settings.qr_url}
              onChange={(e) => setSettings({ ...settings, qr_url: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Installer Path</label>
            <input
              type="text"
              value={settings.installer_path}
              onChange={(e) => setSettings({ ...settings, installer_path: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Installer Filename</label>
            <input
              type="text"
              value={settings.installer_filename}
              onChange={(e) => setSettings({ ...settings, installer_filename: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h3 className="font-semibold text-lg text-ocean-800 mb-4">QR Code Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title (ID)</label>
                <input
                  type="text"
                  value={settings.qr_title_id}
                  onChange={(e) => setSettings({ ...settings, qr_title_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subtitle (ID)</label>
                <input
                  type="text"
                  value={settings.qr_subtitle_id}
                  onChange={(e) => setSettings({ ...settings, qr_subtitle_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title (EN)</label>
                <input
                  type="text"
                  value={settings.qr_title_en}
                  onChange={(e) => setSettings({ ...settings, qr_title_en: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subtitle (EN)</label>
                <input
                  type="text"
                  value={settings.qr_subtitle_en}
                  onChange={(e) => setSettings({ ...settings, qr_subtitle_en: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title (JA)</label>
                <input
                  type="text"
                  value={settings.qr_title_ja}
                  onChange={(e) => setSettings({ ...settings, qr_title_ja: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subtitle (JA)</label>
                <input
                  type="text"
                  value={settings.qr_subtitle_ja}
                  onChange={(e) => setSettings({ ...settings, qr_subtitle_ja: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h3 className="font-semibold text-lg text-ocean-800 mb-4">Projector Notes</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Note (ID)</label>
              <textarea
                value={settings.projector_note_id}
                onChange={(e) => setSettings({ ...settings, projector_note_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
                rows={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Note (EN)</label>
              <textarea
                value={settings.projector_note_en}
                onChange={(e) => setSettings({ ...settings, projector_note_en: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
                rows={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Note (JA)</label>
              <textarea
                value={settings.projector_note_ja}
                onChange={(e) => setSettings({ ...settings, projector_note_ja: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-500 outline-none"
                rows={2}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-ocean-600 hover:bg-ocean-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-70"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
