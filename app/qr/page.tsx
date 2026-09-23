import { QrPanel } from "@/components/qr-panel";
import { SiteChrome } from "@/components/site-chrome";
import { getGuideContent } from "@/lib/content";

export const revalidate = 60;

export const metadata = {
  title: "QR Code Panduan Koneksi — Laut Otsuka",
};

export default async function QrPage() {
  const content = await getGuideContent();
  return (
    <SiteChrome badgeKey="qrBadge" showQrLink={false} printable>
      <QrPanel 
        url={content.settings.qrUrl} 
        title={content.settings.qrTitle} 
        subtitle={content.settings.qrSubtitle} 
      />
    </SiteChrome>
  );
}
