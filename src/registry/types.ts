/**
 * Type definitions for Section Registry
 */

import { ComponentType } from "react";

export interface SectionComponentProps<TConfig = Record<string, unknown>> {
  config: TConfig;
  deploymentId?: string;
}

export type SectionComponent = ComponentType<SectionComponentProps>;
