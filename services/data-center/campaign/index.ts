/**
 * Campaign Module Index
 *
 * Stage 6: Campaign Prep & Export
 *
 * Exports all campaign-related services:
 * - Personalization Engine
 * - Template Manager
 * - Campaign Exporter
 * - Types and Constants
 */

// Types
export * from './types';

// Personalization
export {
  PersonalizationEngine,
  getPersonalizationEngine,
} from './personalization';

// Templates
export {
  TemplateManager,
  getTemplateManager,
  DEFAULT_TEMPLATES,
} from './templateManager';

// Exporter
export {
  CampaignExporter,
  getCampaignExporter,
} from './exporter';
