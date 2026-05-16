/**
 * Agent Orchestrator
 *
 * Decides which agents to run based on:
 * - Missing fields needed for ICP verification
 * - Cost constraints
 * - Priority/tier
 *
 * Rule: if you have (industry + title) → skip enrichment, go to ICP
 *       if missing → run targeted enrichment only
 */

import {
  AgentType,
  AgentInput,
  AgentOutput,
  OrchestrationPlan,
  OrchestrationResult,
  AgentConfig,
} from './types';
import { BaseAgent, createAgent, registerAgent } from './baseAgent';
import { PersonEnrichmentAgent } from './personAgent';
import { CompanyEnrichmentAgent } from './companyAgent';
import { NormalizedLeadObject } from '../types';
import { verifyICP } from '../icpEngine';

// ==========================================
// ORCHESTRATOR CLASS
// ==========================================

export interface OrchestratorConfig {
  // Cost limits
  max_cost_per_record: number;
  max_total_cost: number;

  // ICP threshold for "ready"
  icp_threshold: number;

  // Agent priority order
  agent_priority: AgentType[];

  // Skip enrichment for these tiers
  skip_enrichment_for_tiers: string[];

  // Only enrich if ICP could potentially pass
  only_enrich_potential_icp: boolean;
}

const DEFAULT_CONFIG: OrchestratorConfig = {
  max_cost_per_record: 10,
  max_total_cost: 1000,
  icp_threshold: 60,
  agent_priority: ['person_enrichment', 'company_enrichment'],
  skip_enrichment_for_tiers: [],
  only_enrich_potential_icp: true,
};

export class AgentOrchestrator {
  private config: OrchestratorConfig;
  private agents: Map<AgentType, BaseAgent>;
  private totalCostUsed: number = 0;

  constructor(config?: Partial<OrchestratorConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.agents = new Map();
    this.initializeAgents();
  }

  /**
   * Initialize all agents
   */
  private initializeAgents(): void {
    // Person Enrichment Agent
    this.agents.set('person_enrichment', new PersonEnrichmentAgent());

    // Company Enrichment Agent
    this.agents.set('company_enrichment', new CompanyEnrichmentAgent());
  }

  /**
   * Plan which agents to run for a record
   */
  planEnrichment(record: NormalizedLeadObject): OrchestrationPlan {
    const plan: OrchestrationPlan = {
      record_id: record.id,
      agents_to_run: [],
      agents_skipped: [],
      total_estimated_cost: 0,
      fields_to_enrich: [],
      passes_icp_gate_after: false,
    };

    // Check if already has required ICP fields
    const hasRequiredFields = this.hasICPRequiredFields(record);
    if (hasRequiredFields.complete) {
      // Can go directly to ICP verification
      plan.passes_icp_gate_after = true;
      for (const agentType of this.config.agent_priority) {
        plan.agents_skipped.push({
          agent_type: agentType,
          reason: 'All ICP fields present - no enrichment needed',
        });
      }
      return plan;
    }

    // Determine which agents to run based on missing fields
    for (const agentType of this.config.agent_priority) {
      const agent = this.agents.get(agentType);
      if (!agent) continue;

      const shouldRun = agent.shouldRun(record);

      if (shouldRun.should_run) {
        // Estimate cost
        const estimatedCost = this.estimateAgentCost(agentType);

        // Check cost limits
        if (plan.total_estimated_cost + estimatedCost > this.config.max_cost_per_record) {
          plan.agents_skipped.push({
            agent_type: agentType,
            reason: `Cost limit exceeded (estimated: ${estimatedCost})`,
          });
          continue;
        }

        plan.agents_to_run.push({
          agent_type: agentType,
          reason: shouldRun.reason,
          priority: this.determinePriority(record),
          estimated_cost: estimatedCost,
        });

        plan.total_estimated_cost += estimatedCost;
        plan.fields_to_enrich.push(...this.getFieldsForAgent(agentType, hasRequiredFields.missing));

      } else {
        plan.agents_skipped.push({
          agent_type: agentType,
          reason: shouldRun.reason,
        });
      }
    }

    // Predict if ICP will pass after enrichment
    plan.passes_icp_gate_after = plan.agents_to_run.length > 0 ||
      hasRequiredFields.missing.length <= 1;

    return plan;
  }

  /**
   * Execute enrichment for a record
   */
  async enrichRecord(
    record: NormalizedLeadObject,
    plan?: OrchestrationPlan
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();

    // Generate plan if not provided
    if (!plan) {
      plan = this.planEnrichment(record);
    }

    const result: OrchestrationResult = {
      record_id: record.id,
      original_record: { ...record },
      enriched_record: { ...record },
      agent_results: [],
      total_credits_used: 0,
      total_api_calls: 0,
      total_duration_ms: 0,
      fields_enriched: [],
      fields_failed: [],
      status: 'success',
      ready_for_icp: false,
    };

    // Skip if no agents to run
    if (plan.agents_to_run.length === 0) {
      result.status = 'success';
      result.ready_for_icp = this.hasICPRequiredFields(record).complete;
      result.total_duration_ms = Date.now() - startTime;
      return result;
    }

    // Run agents in order
    for (const agentPlan of plan.agents_to_run) {
      const agent = this.agents.get(agentPlan.agent_type);
      if (!agent) continue;

      // Check global cost limit
      if (this.totalCostUsed >= this.config.max_total_cost) {
        console.log(`[Orchestrator] Global cost limit reached: ${this.totalCostUsed}`);
        break;
      }

      // Execute agent
      const input: AgentInput = {
        record: result.enriched_record,
        priority: agentPlan.priority,
        max_cost: this.config.max_cost_per_record - result.total_credits_used,
      };

      const agentResult = await agent.execute(input);
      result.agent_results.push(agentResult);

      // Update totals
      result.total_credits_used += agentResult.credits_used;
      result.total_api_calls += agentResult.api_calls_made;
      this.totalCostUsed += agentResult.credits_used;

      // Apply enriched fields to record
      if (agentResult.status === 'completed') {
        for (const [field, value] of Object.entries(agentResult.enriched_fields)) {
          if (value !== undefined && value !== null) {
            (result.enriched_record as any)[field] = value;
            result.fields_enriched.push(field);
          }
        }
      } else if (agentResult.status === 'failed') {
        result.fields_failed.push(agentPlan.agent_type);
      }
    }

    // Update enrichment metadata
    result.enriched_record.ai_processed = true;
    result.enriched_record.enrichment_attempts++;
    result.enriched_record.last_enriched_at = new Date().toISOString();
    result.enriched_record.enrichment_cost += result.total_credits_used;

    // Add sources
    const sources = result.agent_results
      .filter(r => r.provider_used)
      .map(r => r.provider_used!);
    result.enriched_record.enrichment_sources = [
      ...new Set([...result.enriched_record.enrichment_sources, ...sources])
    ];

    // Determine final status
    if (result.fields_enriched.length === 0 && result.fields_failed.length > 0) {
      result.status = 'failed';
    } else if (result.fields_failed.length > 0) {
      result.status = 'partial';
    }

    // Check if ready for ICP
    result.ready_for_icp = this.hasICPRequiredFields(result.enriched_record).complete;

    // Update pipeline stage
    if (result.ready_for_icp) {
      result.enriched_record.pipeline_stage = 3; // Ready for ICP Gate
      result.enriched_record.stage_status = 'completed';
    }

    result.total_duration_ms = Date.now() - startTime;
    return result;
  }

  /**
   * Batch enrichment
   */
  async enrichBatch(
    records: NormalizedLeadObject[],
    onProgress?: (current: number, total: number, result: OrchestrationResult) => void
  ): Promise<{
    results: OrchestrationResult[];
    summary: {
      total: number;
      enriched: number;
      failed: number;
      skipped: number;
      total_credits: number;
      ready_for_icp: number;
    };
  }> {
    const results: OrchestrationResult[] = [];
    let enriched = 0;
    let failed = 0;
    let skipped = 0;
    let totalCredits = 0;
    let readyForICP = 0;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      // Plan enrichment
      const plan = this.planEnrichment(record);

      // Execute if needed
      let result: OrchestrationResult;

      if (plan.agents_to_run.length === 0) {
        // No enrichment needed
        result = {
          record_id: record.id,
          original_record: record,
          enriched_record: record,
          agent_results: [],
          total_credits_used: 0,
          total_api_calls: 0,
          total_duration_ms: 0,
          fields_enriched: [],
          fields_failed: [],
          status: 'success',
          ready_for_icp: this.hasICPRequiredFields(record).complete,
        };
        skipped++;
      } else {
        result = await this.enrichRecord(record, plan);

        if (result.status === 'success') enriched++;
        else if (result.status === 'failed') failed++;
        else enriched++; // partial counts as enriched
      }

      totalCredits += result.total_credits_used;
      if (result.ready_for_icp) readyForICP++;

      results.push(result);

      // Progress callback
      if (onProgress) {
        onProgress(i + 1, records.length, result);
      }

      // Small delay between records
      if (i < records.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return {
      results,
      summary: {
        total: records.length,
        enriched,
        failed,
        skipped,
        total_credits: totalCredits,
        ready_for_icp: readyForICP,
      },
    };
  }

  /**
   * Check if record has required ICP fields
   */
  private hasICPRequiredFields(record: NormalizedLeadObject): {
    complete: boolean;
    missing: string[];
  } {
    const requiredFields = [
      { field: 'industry_normalized', label: 'industry' },
      { field: 'seniority', label: 'seniority', allowUnknown: false },
      // title is nice to have but seniority is more important
    ];

    const missing: string[] = [];

    for (const req of requiredFields) {
      const value = (record as any)[req.field];
      const isEmpty = value === null || value === undefined || value === '';
      const isUnknown = !req.allowUnknown && value === 'Unknown';

      if (isEmpty || isUnknown) {
        missing.push(req.label);
      }
    }

    return {
      complete: missing.length === 0,
      missing,
    };
  }

  /**
   * Estimate cost for an agent
   */
  private estimateAgentCost(agentType: AgentType): number {
    const costEstimates: Record<AgentType, number> = {
      'person_enrichment': 0,  // Apollo is free
      'company_enrichment': 0, // Apollo is free
      'email_finder': 1,
      'phone_finder': 10,
      'linkedin_resolver': 0,
      'title_normalizer': 0,
      'industry_classifier': 0,
    };

    return costEstimates[agentType] || 1;
  }

  /**
   * Get fields that an agent can enrich
   */
  private getFieldsForAgent(agentType: AgentType, missingFields: string[]): string[] {
    const agentFields: Record<AgentType, string[]> = {
      'person_enrichment': ['title_normalized', 'seniority', 'department', 'linkedin_url'],
      'company_enrichment': ['industry_normalized', 'company_size', 'company_country'],
      'email_finder': ['email'],
      'phone_finder': ['phone'],
      'linkedin_resolver': ['linkedin_url'],
      'title_normalizer': ['title_normalized', 'seniority'],
      'industry_classifier': ['industry_normalized'],
    };

    const fields = agentFields[agentType] || [];
    return fields.filter(f => missingFields.some(m =>
      f.includes(m) || m.includes(f.replace('_normalized', ''))
    ));
  }

  /**
   * Determine priority for a record
   */
  private determinePriority(record: NormalizedLeadObject): 'high' | 'normal' | 'low' {
    // High priority: has email and company domain (likely good lead)
    if (record.email && record.company_domain) {
      return 'high';
    }

    // Low priority: minimal data
    if (!record.email && !record.linkedin_url) {
      return 'low';
    }

    return 'normal';
  }

  /**
   * Reset cost tracking
   */
  resetCostTracking(): void {
    this.totalCostUsed = 0;
  }

  /**
   * Get current cost usage
   */
  getCostUsage(): { used: number; limit: number; remaining: number } {
    return {
      used: this.totalCostUsed,
      limit: this.config.max_total_cost,
      remaining: Math.max(0, this.config.max_total_cost - this.totalCostUsed),
    };
  }
}

// ==========================================
// SINGLETON INSTANCE
// ==========================================

let orchestratorInstance: AgentOrchestrator | null = null;

export const getOrchestrator = (config?: Partial<OrchestratorConfig>): AgentOrchestrator => {
  if (!orchestratorInstance || config) {
    orchestratorInstance = new AgentOrchestrator(config);
  }
  return orchestratorInstance;
};

export default AgentOrchestrator;
