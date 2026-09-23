import { ProjectorView } from "@/components/projector-view";
import { SiteChrome } from "@/components/site-chrome";
import { getGuideContent } from "@/lib/content";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function DynamicGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getGuideContent();
  
  const category = content.categories.find(c => c.slug === slug);
  if (!category) return notFound();

  // For now, we reuse ProjectorView as a generic template for all categories
  // In a real app, you might have different views based on category type
  return (
    <SiteChrome>
      <ProjectorView content={content} categorySlug={slug} />
    </SiteChrome>
  );
}
