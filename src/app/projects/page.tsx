import { Suspense } from 'react';
import { ProjectsGrid } from '@/components/sections/projects-grid';
import { ProjectsHeader } from '@/components/sections/projects-header';
import { siteConfig } from '@/config/site.config';
import FigmaGallery from '@/components/FigmaGallery';

export const metadata = {
  title: `Projects | ${siteConfig.siteName}`,
  description: 'Explore my latest projects, open source contributions, and technical experiments.',
};

export default function ProjectsPage() {
  
  const FIGMA_FILE_KEY = process.env.NEXT_PUBLIC_FIGMA_FILE_KEY ?? '';

  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-6 mt-16 md:mt-24">
        <ProjectsHeader />

        <Suspense fallback={<ProjectsLoading />}>
          <ProjectsGrid />
        </Suspense>

        {/* Figma gallery — server-proxied component. Set NEXT_PUBLIC_FIGMA_FILE_KEY in .env.local */}
        {FIGMA_FILE_KEY ? (
          <div className="mt-12">
            <FigmaGallery fileKey={FIGMA_FILE_KEY} />
          </div>
        ) : (
          <div className="mt-12 text-sm text-muted-foreground">
            No Figma file key configured. Set <code>NEXT_PUBLIC_FIGMA_FILE_KEY</code> in <code>.env.local</code> to enable the gallery.
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-64 bg-muted/30 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}
