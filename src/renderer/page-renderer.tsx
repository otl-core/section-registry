/**
 * Page Renderer
 * Renders a complete page with all its sections
 *
 * SSR COMPATIBLE: This is a pure server component with no client hooks
 */

import { SectionRegistry } from "../registry/section-registry";
import SectionRenderer from "./section-renderer";

interface SchemaInstance {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

interface PageRendererProps {
  sections: SchemaInstance[];
  sectionRegistry: SectionRegistry;
  deploymentId?: string;
}

// NO "use client" directive - this is a server component
export default function PageRenderer({
  sections,
  sectionRegistry,
  deploymentId,
}: PageRendererProps) {
  // Pure synchronous logic only
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section, index) => (
        <div
          key={section.id || `section-${section.type}-${index}`}
          data-section-type={section.type}
          data-section-id={section.id}
        >
          <SectionRenderer
            section={section}
            sectionRegistry={sectionRegistry}
            deploymentId={deploymentId}
          />
        </div>
      ))}
    </>
  );
}
