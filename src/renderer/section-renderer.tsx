/**
 * Section Renderer
 * Dynamically renders section components based on schema instance type.
 * Wraps sections with analytics tracking when configured.
 *
 * SSR COMPATIBLE: This is a server component. The SectionAnalyticsWrapper
 * is a client component that handles its own hooks internally.
 */

import { SectionAnalyticsWrapper } from "@otl-core/analytics";
import { ComponentNotFound } from "@otl-core/block-registry";
import type { BlockAnalyticsConfig } from "@otl-core/cms-types";
import { SectionRegistry } from "../registry/section-registry";

interface SchemaInstance {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

interface SectionRendererProps {
  section: SchemaInstance;
  sectionRegistry: SectionRegistry;
  deploymentId?: string;
}

export default function SectionRenderer({
  section,
  sectionRegistry,
  deploymentId,
}: SectionRendererProps) {
  const { type, config, id } = section;

  const SectionComponent = sectionRegistry.get(type);

  if (!SectionComponent) {
    return (
      <ComponentNotFound
        type={type}
        config={config}
        availableTypes={sectionRegistry.getAll()}
        componentKind="section"
      />
    );
  }

  const sectionAnalytics = config?.analytics as
    | BlockAnalyticsConfig
    | undefined;

  return (
    <SectionAnalyticsWrapper
      analyticsConfig={sectionAnalytics}
      sectionId={id}
      sectionType={type}
    >
      <SectionComponent config={config} deploymentId={deploymentId} />
    </SectionAnalyticsWrapper>
  );
}
