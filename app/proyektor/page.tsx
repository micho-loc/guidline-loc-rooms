import { ProjectorView } from "@/components/projector-view";
import { SiteChrome } from "@/components/site-chrome";
import { getGuideContent } from "@/lib/content";

export const revalidate = 60;

export default async function ProjectorPage() {
  const content = await getGuideContent();
  return (
    <SiteChrome>
      <ProjectorView content={content} />
    </SiteChrome>
  );
}
