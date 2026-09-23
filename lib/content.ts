import { fallbackContent } from "@/lib/fallback";
import { getSupabase } from "@/lib/supabase";
import type { GuideContent, GuideStep, Lang, Localized, Room } from "@/lib/types";

type SettingsRow = {
  wifi_ssid: string;
  wifi_password: string;
  qr_url: string;
  qr_title_id: string;
  qr_title_en: string;
  qr_title_ja: string;
  qr_subtitle_id: string;
  qr_subtitle_en: string;
  qr_subtitle_ja: string;
  installer_path: string;
  installer_filename: string;
  projector_note_id: string;
  projector_note_en: string;
  projector_note_ja: string;
};

type RoomRow = {
  id: string;
  name: string;
  ip_address: string;
  sort_order: number;
};

type StepRow = {
  id: string;
  section: "install" | "connect";
  sort_order: number;
  image_path: string | null;
  is_final: boolean;
  title_id: string;
  title_en: string;
  title_ja: string;
  body_id: string;
  body_en: string;
  body_ja: string;
};

function localized(id: string, en: string, ja: string): Localized {
  return { id, en, ja };
}

function mapRoom(row: RoomRow): Room {
  return {
    id: row.id,
    name: row.name,
    ipAddress: row.ip_address,
    sortOrder: row.sort_order,
  };
}

function mapStep(row: StepRow): GuideStep {
  return {
    id: row.id,
    section: row.section,
    sortOrder: row.sort_order,
    imagePath: row.image_path,
    isFinal: row.is_final,
    title: localized(row.title_id, row.title_en, row.title_ja),
    body: localized(row.body_id, row.body_en, row.body_ja),
  };
}

export async function getGuideContent(): Promise<GuideContent> {
  const supabase = getSupabase();
  if (!supabase) return fallbackContent;

  const [settingsRes, roomsRes, stepsRes] = await Promise.all([
    supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("rooms").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("guide_steps")
      .select("*")
      .order("section", { ascending: false })
      .order("sort_order", { ascending: true }),
  ]);

  if (
    settingsRes.error ||
    !settingsRes.data ||
    roomsRes.error ||
    !roomsRes.data ||
    stepsRes.error ||
    !stepsRes.data
  ) {
    return fallbackContent;
  }

  const settings = settingsRes.data as SettingsRow;
  return {
    source: "supabase",
    settings: {
      wifiSsid: settings.wifi_ssid,
      wifiPassword: settings.wifi_password,
      qrUrl: settings.qr_url,
      qrTitle: localized(
        settings.qr_title_id || "Scan QR Code",
        settings.qr_title_en || "Scan QR Code",
        settings.qr_title_ja || "QRコードをスキャン"
      ),
      qrSubtitle: localized(
        settings.qr_subtitle_id || "Akses cepat ke panduan koneksi ruang rapat.",
        settings.qr_subtitle_en || "Quick access to the meeting room connection guide.",
        settings.qr_subtitle_ja || "会議室の接続ガイドへのクイックアクセス。"
      ),
      installerPath: settings.installer_path,
      installerFilename: settings.installer_filename,
      projectorNote: localized(
        settings.projector_note_id,
        settings.projector_note_en,
        settings.projector_note_ja,
      ),
    },
    rooms: (roomsRes.data as RoomRow[]).map(mapRoom),
    steps: (stepsRes.data as StepRow[]).map(mapStep),
  };
}

export function pick(text: Localized, lang: Lang) {
  return text[lang];
}

export function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "");
}
