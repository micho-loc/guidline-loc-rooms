export const LANGS = ["id", "en", "ja"] as const;
export type Lang = (typeof LANGS)[number];

export type Localized = Record<Lang, string>;

export type GuideStep = {
  id: string;
  section: "install" | "connect";
  sortOrder: number;
  imagePath: string | null;
  isFinal: boolean;
  title: Localized;
  body: Localized;
};

export type Room = {
  id: string;
  name: string;
  ipAddress: string;
  sortOrder: number;
};

export type SiteSettings = {
  wifiSsid: string;
  wifiPassword: string;
  qrUrl: string;
  qrTitle: Localized;
  qrSubtitle: Localized;
  installerPath: string;
  installerFilename: string;
  projectorNote: Localized;
};

export type GuideContent = {
  settings: SiteSettings;
  rooms: Room[];
  steps: GuideStep[];
  source: "supabase" | "fallback";
};
