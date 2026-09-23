import { HomeView } from "@/components/home-view";
import { SiteChrome } from "@/components/site-chrome";
import { getGuideContent } from "@/lib/content";

export const revalidate = 60;

export default async function HomePage() {
  const content = await getGuideContent();
  return (
    <SiteChrome>
      <HomeView categories={content.categories} />
    </SiteChrome>
  );
}
