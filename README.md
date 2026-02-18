# @otl-core/section-registry

Section registry infrastructure for OTL CMS. This package provides the core registry and rendering
system for section components and pages.

## Purpose

This package contains **ONLY infrastructure** - registry classes, renderers (SectionRenderer,
PageRenderer). Actual section components (Grid, Flexbox, Spacer) and utilities (SectionWrapper)
remain in your application code for customization.

## SSR Compatibility

All components in this package are **server-component safe** and work with Next.js App Router SSR:

- No client-only hooks (useState, useEffect, useMemo, etc.)
- Pure synchronous logic
- Deterministic rendering

Individual section components in your app can be client components if they need interactivity - just
add `"use client"` at the top of those files.

**Important**: If you're using SectionWrapper in your app, make sure it doesn't use `useMemo` or
other client hooks. Simply call utility functions directly instead of memoizing them.

## Installation

This package is part of the OTL CMS monorepo and uses workspace protocol:

```json
{
  "dependencies": {
    "@otl-core/section-registry": "workspace:*"
  }
}
```

## Usage

### 1. Create a Registry Instance

```typescript
// In your app: src/lib/registries/section-registry.ts
import { SectionRegistry } from "@otl-core/section-registry";
import Grid from "@/components/sections/grid";
import Flexbox from "@/components/sections/flexbox";
import Spacer from "@/components/sections/spacer";

export const sectionRegistry = new SectionRegistry();

// Register your sections
sectionRegistry.register("grid", Grid);
sectionRegistry.register("flexbox", Flexbox);
sectionRegistry.register("spacer", Spacer);
```

### 2. Use SectionRenderer

```typescript
import { SectionRenderer } from '@otl-core/section-registry';
import { sectionRegistry } from '@/lib/registries/section-registry';
import { blockRegistry } from '@/lib/registries/block-registry';

export default function MyPage({ sections }) {
  return (
    <div>
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          sectionRegistry={sectionRegistry}
          blockRegistry={blockRegistry}  // For sections that render blocks
          deploymentId="your-deployment-id"
        />
      ))}
    </div>
  );
}
```

### 3. Use PageRenderer

For full page rendering:

```typescript
import { PageRenderer } from '@otl-core/section-registry';
import { sectionRegistry } from '@/lib/registries/section-registry';
import { blockRegistry } from '@/lib/registries/block-registry';

export default function Page({ pageData }) {
  return (
    <PageRenderer
      sections={pageData.sections}
      sectionRegistry={sectionRegistry}
      blockRegistry={blockRegistry}
      deploymentId="your-deployment-id"
    />
  );
}
```

### 4. Section Components

Your section components receive these props:

```typescript
interface SectionComponentProps {
  config: Record<string, unknown>;
  blockRegistry?: BlockRegistry; // For rendering nested blocks
  deploymentId?: string; // For form blocks
}

export default function Grid({ config, blockRegistry, deploymentId }: SectionComponentProps) {
  // Your section implementation
}
```

## API Reference

### SectionRegistry

```typescript
class SectionRegistry<TProps> {
  register(type: string, component: ComponentType<TProps>): void;
  get(type: string): ComponentType<TProps> | undefined;
  has(type: string): boolean;
  getAll(): string[];
  size(): number;
}
```

### SectionRenderer Props

```typescript
interface SectionRendererProps {
  section: SchemaInstance;
  sectionRegistry: SectionRegistry;
  blockRegistry?: BlockRegistry; // Optional, for sections that render blocks
  deploymentId?: string; // Optional, for form blocks
}
```

### PageRenderer Props

```typescript
interface PageRendererProps {
  sections: SchemaInstance[];
  sectionRegistry: SectionRegistry;
  blockRegistry?: BlockRegistry;
  deploymentId?: string;
}
```

## SectionWrapper Utility

SectionWrapper is **NOT included** in this package - it remains in your application code so you can
customize it.

**SSR Fix Required**: If your SectionWrapper uses `useMemo`, remove it:

```typescript
// BAD - breaks SSR
const responsiveCSS = useMemo(() => {
  return generateResponsiveSpacingCSS(...);
}, [deps]);

// GOOD - SSR safe
const responsiveCSS = generateResponsiveSpacingCSS(...);
```

The function call is cheap enough that memoization isn't critical, and this keeps the component
SSR-compatible.

## Error Handling

If a section type is not found in the registry, `ComponentNotFound` is rendered, which:

- Logs detailed error information in development
- Logs minimal error in production
- Renders invisible placeholder to prevent layout breaks

## Best Practices

1. **Keep components in your app**: Section components and SectionWrapper stay in your application
2. **Server-first**: Use server components by default, only add `"use client"` when needed
3. **Pass registries**: Section components that render blocks need `blockRegistry` prop
4. **No client hooks in SectionWrapper**: Keep utilities SSR-safe
5. **Type safety**: Import types from this package for consistency

## Examples

See `frontend/engine/examples/custom-section-example.tsx` for a complete example.
