/**
 * Base Agent Class
 *
 * Abstract base for all AI Agents
 * Handles: logging, timing, cost tracking, error handling
 */

import {
  AgentType,
  AgentStatus,
  AgentConfig,
  AgentInput,
  AgentOutput,
  AgentCondition,
  ProviderConfig,
  DEFAULT_PROVIDERS,
} from './types';
import { NormalizedLeadObject } from '../types';

// ==========================================
// BASE AGENT CLASS
// ==========================================

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected providers: ProviderConfig[];

  constructor(config: AgentConfig) {
    this.config = config;
    this.providers = this.loadProviders();
  }

  /**
   * Load provider configurations
   */
  protected loadProviders(): ProviderConfig[] {
    return DEFAULT_PROVIDERS
      .filter(p => this.config.providers.includes(p.id) && p.is_active)
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Check if agent should run based on conditions
   */
  shouldRun(record: NormalizedLeadObject): { should_run: boolean; reason: string } {
    // Check skip conditions first
    for (const condition of this.config.skip_conditions) {
      if (this.evaluateCondition(record, condition)) {
        return {
          should_run: false,
          reason: `Skip condition met: ${condition.field} ${condition.operator}`,
        };
      }
    }

    // Check run conditions (all must be true)
    for (const condition of this.config.run_conditions) {
      if (!this.evaluateCondition(record, condition)) {
        return {
          should_run: false,
          reason: `Run condition not met: ${condition.field} ${condition.operator}`,
        };
      }
    }

    return { should_run: true, reason: 'All conditions met' };
  }

  /**
   * Evaluate a single condition
   */
  protected evaluateCondition(record: NormalizedLeadObject, condition: AgentCondition): boolean {
    const value = (record as any)[condition.field];

    switch (condition.operator) {
      case 'exists':
        return value !== null && value !== undefined && value !== '';
      case 'not_exists':
        return value === null || value === undefined || value === '';
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(value);
      case 'gt':
        return typeof value === 'number' && value > condition.value;
      case 'lt':
        return typeof value === 'number' && value < condition.value;
      default:
        return false;
    }
  }

  /**
   * Execute the agent
   */
  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    const output: AgentOutput = {
      agent_id: this.config.id,
      agent_type: this.config.type,
      status: 'running',
      enriched_fields: {},
      confidence: {},
      provider_used: null,
      providers_tried: [],
      credits_used: 0,
      api_calls_made: 0,
      started_at: new Date().toISOString(),
      completed_at: '',
      duration_ms: 0,
    };

    try {
      // Check conditions
      const checkResult = this.shouldRun(input.record);
      if (!checkResult.should_run) {
        output.status = 'skipped';
        output.error = checkResult.reason;
        output.completed_at = new Date().toISOString();
        output.duration_ms = Date.now() - startTime;
        return output;
      }

      // Run the actual enrichment
      const result = await this.runEnrichment(input, output);

      // Merge result into output
      Object.assign(output, result);
      output.status = Object.keys(output.enriched_fields).length > 0 ? 'completed' : 'failed';

    } catch (error: any) {
      output.status = 'failed';
      output.error = error.message;
      output.error_code = error.code || 'UNKNOWN_ERROR';
      console.error(`[${this.config.type}] Agent error:`, error);
    }

    output.completed_at = new Date().toISOString();
    output.duration_ms = Date.now() - startTime;

    return output;
  }

  /**
   * Abstract method: implement actual enrichment logic
   */
  protected abstract runEnrichment(
    input: AgentInput,
    output: AgentOutput
  ): Promise<Partial<AgentOutput>>;

  /**
   * Get API key for a provider
   */
  protected getApiKey(provider: ProviderConfig): string | null {
    const key = process.env[provider.api_key_env];
    return key || null;
  }

  /**
   * Add delay between API calls
   */
  protected async delay(ms?: number): Promise<void> {
    const delay = ms || this.config.delay_between_calls_ms || 300;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Log agent activity
   */
  protected log(message: string, data?: any): void {
    console.log(`[${this.config.type}] ${message}`, data ? JSON.stringify(data) : '');
  }
}

// ==========================================
// AGENT FACTORY
// ==========================================

export type AgentClass = new (config: AgentConfig) => BaseAgent;

const agentRegistry: Map<AgentType, AgentClass> = new Map();

export const registerAgent = (type: AgentType, agentClass: AgentClass): void => {
  agentRegistry.set(type, agentClass);
};

export const createAgent = (type: AgentType, config: AgentConfig): BaseAgent | null => {
  const AgentClass = agentRegistry.get(type);
  if (!AgentClass) {
    console.warn(`Unknown agent type: ${type}`);
    return null;
  }
  return new AgentClass(config);
};

export const getRegisteredAgents = (): AgentType[] => {
  return Array.from(agentRegistry.keys());
};
