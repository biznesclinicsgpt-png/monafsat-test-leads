/**
 * AI Agents - Index
 *
 * Stage 2: Pre-ICP Enrichment Agents
 * Stage 5: Contactability Agents
 *
 * Exports all agent-related modules
 */

// Types
export * from './types';

// Base Agent
export { BaseAgent, registerAgent, createAgent, getRegisteredAgents } from './baseAgent';

// Stage 2: Enrichment Agents
export { PersonEnrichmentAgent } from './personAgent';
export { CompanyEnrichmentAgent } from './companyAgent';

// Stage 2: Enrichment Orchestrator
export { AgentOrchestrator, getOrchestrator } from './orchestrator';
export type { OrchestratorConfig } from './orchestrator';

// Stage 5: Contactability Agents
export { EmailFinderAgent } from './emailAgent';
export { EmailVerifierAgent } from './emailVerifierAgent';
export { PhoneFinderAgent } from './phoneAgent';

// Stage 5: Contactability Orchestrator
export {
  ContactabilityOrchestrator,
  getContactabilityOrchestrator,
} from './contactabilityOrchestrator';
export type {
  ContactabilityConfig,
  ContactabilityPlan,
  ContactabilityResult,
} from './contactabilityOrchestrator';
