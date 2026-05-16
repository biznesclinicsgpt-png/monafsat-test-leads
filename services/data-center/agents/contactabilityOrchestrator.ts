/**
 * Contactability Orchestrator
 *
 * Stage 5: Conditional Contactability Layer
 *
 * Manages the email/phone enrichment pipeline:
 * 1. Email Finder (if needed)
 * 2. Email Verifier (if email found)
 * 3. Phone Finder (VIP only)
 *
 * GATING RULES:
 * - Email: ICP = Yes AND Score >= 60
 * - Phone: ICP = Yes AND Score >= 85 (VIP)
 * - Verification: Only for found/existing emails
 */

import {
  AgentType,
  AgentOutput,
  OrchestrationResult,
} from './types';
import { NormalizedLeadObject } from '../types';
import { EmailFinderAgent } from './emailAgent';
import { PhoneFinderAgent } from './phoneAgent';
import { EmailVerifierAgent } from './emailVerifierAgent';

// ==========================================
// CONFIGURATION
// ==========================================

export interface ContactabilityConfig {
  // Score thresholds
  email_threshold: number;  // Default: 60
  phone_threshold: number;  // Default: 85 (VIP)

  // Cost limits
  max_cost_per_record: number;
  max_total_cost: number;

  // Feature flags
  enable_email_finder: boolean;
  enable_email_verifier: boolean;
  enable_phone_finder: boolean;

  // Waterfall settings
  email_waterfall: string[];  // Provider order
  stop_on_verified_email: boolean;
}

const DEFAULT_CONFIG: ContactabilityConfig = {
  email_threshold: 60,
  phone_threshold: 85,
  max_cost_per_record: 20,
  max_total_cost: 1000,
  enable_email_finder: true,
  enable_email_verifier: true,
  enable_phone_finder: true,
  email_waterfall: ['hunter', 'prospeo', 'apollo'],
  stop_on_verified_email: true,
};

// ==========================================
// ORCHESTRATION PLAN
// ==========================================

export interface ContactabilityPlan {
  record_id: string;

  // Eligibility
  email_eligible: boolean;
  email_reason: string;
  phone_eligible: boolean;
  phone_reason: string;

  // Actions planned
  will_find_email: boolean;
  will_verify_email: boolean;
  will_find_phone: boolean;

  // Estimated cost
  estimated_cost: number;

  // Current state
  has_email: boolean;
  email_verified: boolean;
  has_phone: boolean;
}

// ==========================================
// ORCHESTRATION RESULT
// ==========================================

export interface ContactabilityResult {
  record_id: string;
  status: 'success' | 'partial' | 'failed' | 'skipped';

  // Original and enriched
  original_record: NormalizedLeadObject;
  enriched_record: NormalizedLeadObject;

  // What was done
  email_found: boolean;
  email_verified: boolean;
  phone_found: boolean;

  // Details
  email_result?: {
    email: string;
    status: string;
    confidence: number;
    provider: string;
  };
  phone_result?: {
    phone: string;
    type: string;
    provider: string;
  };

  // Costs
  total_credits_used: number;
  agent_results: AgentOutput[];

  // Timing
  duration_ms: number;

  // Ready for campaign?
  ready_for_campaign: boolean;
  campaign_channels: string[];  // ['email', 'phone', 'linkedin']
}

// ==========================================
// CONTACTABILITY ORCHESTRATOR
// ==========================================

export class ContactabilityOrchestrator {
  private config: ContactabilityConfig;
  private emailFinder: EmailFinderAgent;
  private emailVerifier: EmailVerifierAgent;
  private phoneFinder: PhoneFinderAgent;
  private totalCostUsed: number = 0;

  constructor(config?: Partial<ContactabilityConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.emailFinder = new EmailFinderAgent();
    this.emailVerifier = new EmailVerifierAgent();
    this.phoneFinder = new PhoneFinderAgent();
  }

  /**
   * Plan contactability enrichment for a record
   */
  planContactability(record: NormalizedLeadObject): ContactabilityPlan {
    const plan: ContactabilityPlan = {
      record_id: record.id,
      email_eligible: false,
      email_reason: '',
      phone_eligible: false,
      phone_reason: '',
      will_find_email: false,
      will_verify_email: false,
      will_find_phone: false,
      estimated_cost: 0,
      has_email: !!record.email,
      email_verified: record.email_status === 'valid',
      has_phone: !!record.phone,
    };

    // Check email eligibility (ICP Yes + Score >= threshold)
    if (record.icp_status !== 'Yes') {
      plan.email_reason = `ICP status is "${record.icp_status}" (requires "Yes")`;
      plan.phone_reason = `ICP status is "${record.icp_status}" (requires "Yes")`;
    } else {
      // Email eligibility
      if ((record.icp_fit_score || 0) >= this.config.email_threshold) {
        plan.email_eligible = true;
        plan.email_reason = `Score ${record.icp_fit_score} >= ${this.config.email_threshold}`;

        // Need to find email?
        if (!record.email && this.config.enable_email_finder) {
          plan.will_find_email = true;
          plan.estimated_cost += 1; // Average cost per email find
        }

        // Need to verify email?
        if (record.email && record.email_status !== 'valid' && this.config.enable_email_verifier) {
          plan.will_verify_email = true;
          plan.estimated_cost += 1;
        }
      } else {
        plan.email_reason = `Score ${record.icp_fit_score || 0} < ${this.config.email_threshold}`;
      }

      // Phone eligibility (VIP only)
      if ((record.icp_fit_score || 0) >= this.config.phone_threshold) {
        plan.phone_eligible = true;
        plan.phone_reason = `VIP: Score ${record.icp_fit_score} >= ${this.config.phone_threshold}`;

        if (!record.phone && this.config.enable_phone_finder) {
          plan.will_find_phone = true;
          plan.estimated_cost += 10; // Phone costs 10 credits
        }
      } else {
        plan.phone_reason = `Not VIP: Score ${record.icp_fit_score || 0} < ${this.config.phone_threshold}`;
      }
    }

    return plan;
  }

  /**
   * Run contactability enrichment for a record
   */
  async enrichContactability(
    record: NormalizedLeadObject,
    plan?: ContactabilityPlan
  ): Promise<ContactabilityResult> {
    const startTime = Date.now();

    // Generate plan if not provided
    if (!plan) {
      plan = this.planContactability(record);
    }

    const result: ContactabilityResult = {
      record_id: record.id,
      status: 'skipped',
      original_record: { ...record },
      enriched_record: { ...record },
      email_found: false,
      email_verified: false,
      phone_found: false,
      total_credits_used: 0,
      agent_results: [],
      duration_ms: 0,
      ready_for_campaign: false,
      campaign_channels: [],
    };

    // Skip if nothing to do
    if (!plan.will_find_email && !plan.will_verify_email && !plan.will_find_phone) {
      // Still check existing channels
      result.campaign_channels = this.getAvailableChannels(record);
      result.ready_for_campaign = result.campaign_channels.length > 0;
      result.status = 'success';
      result.duration_ms = Date.now() - startTime;
      return result;
    }

    // Check cost limit
    if (this.totalCostUsed >= this.config.max_total_cost) {
      result.status = 'skipped';
      result.duration_ms = Date.now() - startTime;
      return result;
    }

    let enrichedRecord = { ...record };

    // Step 1: Find Email (if needed)
    if (plan.will_find_email) {
      const emailResult = await this.emailFinder.execute({
        record: enrichedRecord,
        priority: 'normal',
        max_cost: this.config.max_cost_per_record - result.total_credits_used,
      });

      result.agent_results.push(emailResult);
      result.total_credits_used += emailResult.credits_used;
      this.totalCostUsed += emailResult.credits_used;

      if (emailResult.status === 'completed' && emailResult.enriched_fields.email) {
        enrichedRecord.email = emailResult.enriched_fields.email;
        enrichedRecord.email_status = emailResult.enriched_fields.email_status;
        enrichedRecord.email_confidence = emailResult.enriched_fields.email_confidence;
        result.email_found = true;
        result.email_result = {
          email: emailResult.enriched_fields.email,
          status: emailResult.enriched_fields.email_status,
          confidence: emailResult.enriched_fields.email_confidence,
          provider: emailResult.provider_used || 'unknown',
        };

        // If email found and verified, skip separate verification
        if (emailResult.enriched_fields.email_status === 'valid') {
          result.email_verified = true;
          plan.will_verify_email = false;
        }
      }
    }

    // Step 2: Verify Email (if needed)
    if (plan.will_verify_email && enrichedRecord.email && enrichedRecord.email_status !== 'valid') {
      const verifyResult = await this.emailVerifier.execute({
        record: enrichedRecord,
        priority: 'normal',
        max_cost: this.config.max_cost_per_record - result.total_credits_used,
      });

      result.agent_results.push(verifyResult);
      result.total_credits_used += verifyResult.credits_used;
      this.totalCostUsed += verifyResult.credits_used;

      if (verifyResult.status === 'completed') {
        enrichedRecord.email_status = verifyResult.enriched_fields.email_status;
        enrichedRecord.email_confidence = verifyResult.enriched_fields.email_confidence;
        result.email_verified = verifyResult.enriched_fields.email_status === 'valid';
      }
    }

    // Step 3: Find Phone (VIP only)
    if (plan.will_find_phone) {
      const phoneResult = await this.phoneFinder.execute({
        record: enrichedRecord,
        priority: 'high', // VIP leads are high priority
        max_cost: this.config.max_cost_per_record - result.total_credits_used,
      });

      result.agent_results.push(phoneResult);
      result.total_credits_used += phoneResult.credits_used;
      this.totalCostUsed += phoneResult.credits_used;

      if (phoneResult.status === 'completed' && phoneResult.enriched_fields.phone) {
        enrichedRecord.phone = phoneResult.enriched_fields.phone;
        enrichedRecord.phone_status = phoneResult.enriched_fields.phone_status;
        result.phone_found = true;
        result.phone_result = {
          phone: phoneResult.enriched_fields.phone,
          type: phoneResult.enriched_fields.phone_type || 'unknown',
          provider: phoneResult.provider_used || 'unknown',
        };
      }
    }

    // Update enrichment metadata
    enrichedRecord.pipeline_stage = 5;
    enrichedRecord.stage_status = 'completed';
    enrichedRecord.enrichment_cost += result.total_credits_used;
    enrichedRecord.last_enriched_at = new Date().toISOString();

    // Determine available channels
    result.campaign_channels = this.getAvailableChannels(enrichedRecord);
    result.ready_for_campaign = result.campaign_channels.length > 0;

    // Determine status
    if (result.email_found || result.phone_found || result.email_verified) {
      result.status = 'success';
    } else if (result.agent_results.some(r => r.status === 'failed')) {
      result.status = 'partial';
    } else {
      result.status = 'skipped';
    }

    result.enriched_record = enrichedRecord;
    result.duration_ms = Date.now() - startTime;

    return result;
  }

  /**
   * Batch contactability enrichment
   */
  async enrichBatch(
    records: NormalizedLeadObject[],
    onProgress?: (current: number, total: number, result: ContactabilityResult) => void
  ): Promise<{
    results: ContactabilityResult[];
    summary: {
      total: number;
      processed: number;
      skipped: number;
      emails_found: number;
      emails_verified: number;
      phones_found: number;
      total_credits: number;
      ready_for_campaign: number;
    };
  }> {
    const results: ContactabilityResult[] = [];
    let processed = 0;
    let skipped = 0;
    let emailsFound = 0;
    let emailsVerified = 0;
    let phonesFound = 0;
    let totalCredits = 0;
    let readyForCampaign = 0;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      // Plan and execute
      const plan = this.planContactability(record);
      const result = await this.enrichContactability(record, plan);

      results.push(result);

      // Update stats
      if (result.status === 'skipped') skipped++;
      else processed++;

      if (result.email_found) emailsFound++;
      if (result.email_verified) emailsVerified++;
      if (result.phone_found) phonesFound++;
      totalCredits += result.total_credits_used;
      if (result.ready_for_campaign) readyForCampaign++;

      // Progress callback
      if (onProgress) {
        onProgress(i + 1, records.length, result);
      }

      // Check cost limit
      if (this.totalCostUsed >= this.config.max_total_cost) {
        console.log(`[Contactability] Cost limit reached: ${this.totalCostUsed}`);
        break;
      }

      // Small delay between records
      if (i < records.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    return {
      results,
      summary: {
        total: records.length,
        processed,
        skipped,
        emails_found: emailsFound,
        emails_verified: emailsVerified,
        phones_found: phonesFound,
        total_credits: totalCredits,
        ready_for_campaign: readyForCampaign,
      },
    };
  }

  /**
   * Get available communication channels
   */
  private getAvailableChannels(record: NormalizedLeadObject): string[] {
    const channels: string[] = [];

    // Email channel
    if (record.email && (record.email_status === 'valid' || record.email_status === 'risky')) {
      channels.push('email');
    }

    // Phone/WhatsApp channel
    if (record.phone && record.phone_status !== 'invalid') {
      channels.push('phone');
      channels.push('whatsapp');
    }

    // LinkedIn channel
    if (record.linkedin_url) {
      channels.push('linkedin');
    }

    return channels;
  }

  /**
   * Reset cost tracking
   */
  resetCostTracking(): void {
    this.totalCostUsed = 0;
  }

  /**
   * Get cost usage
   */
  getCostUsage(): { used: number; limit: number; remaining: number } {
    return {
      used: this.totalCostUsed,
      limit: this.config.max_total_cost,
      remaining: Math.max(0, this.config.max_total_cost - this.totalCostUsed),
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ContactabilityConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// ==========================================
// SINGLETON
// ==========================================

let orchestratorInstance: ContactabilityOrchestrator | null = null;

export const getContactabilityOrchestrator = (
  config?: Partial<ContactabilityConfig>
): ContactabilityOrchestrator => {
  if (!orchestratorInstance || config) {
    orchestratorInstance = new ContactabilityOrchestrator(config);
  }
  return orchestratorInstance;
};

export default ContactabilityOrchestrator;
