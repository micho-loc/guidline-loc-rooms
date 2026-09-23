import { SiteChrome } from "@/components/site-chrome";
import { WifiView } from "@/components/wifi-view";
import { getGuideContent } from "@/lib/content";

export const revalidate = 60;

export default async function WifiPage() {
  const content = await getGuideContent();
  return (
    <SiteChrome>
      <WifiView settings={content.settings} />
    </SiteChrome>
  );
}
