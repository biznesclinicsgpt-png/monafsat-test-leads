/**
 * Email Verifier Agent
 *
 * Stage 5: Conditional Contactability Layer
 * Verifies email addresses to ensure deliverability
 *
 * GATED: Only runs if:
 * - Has email but status is not "valid"
 * - ICP Verify = Yes (don't waste credits on non-ICP)
 *
 * Providers: Hunter → Prospeo
 */

import {
  AgentConfig,
  AgentInput,
  AgentOutput,
  ProviderConfig,
} from './types';
import { BaseAgent, registerAgent } from './baseAgent';
import { NormalizedLeadObject } from '../types';

// ==========================================
// EMAIL VERIFICATION RESULT
// ==========================================

export interface EmailVerificationResult {
  email: string;
  status: 'valid' | 'invalid' | 'risky' | 'catch_all' | 'unknown';
  score: number;  // 0-100

  // Verification details
  mx_found: boolean;
  smtp_valid: boolean;
  catch_all_domain: boolean;
  disposable: boolean;
  role_based: boolean;  // e.g., info@, support@
  free_email: boolean;  // gmail, yahoo, etc.

  // Deliverability
  deliverable: boolean;
  deliverability_score: number;

  // Provider info
  provider: string;
  verified_at: string;
}

// ==========================================
// EMAIL VERIFIER AGENT
// ==========================================

export class EmailVerifierAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super({
      id: 'email_verifier_agent',
      type: 'email_finder', // Reuse type since it's email-related
      name: 'Email Verifier Agent',
      name_ar: 'وكيل التحقق من البريد الإلكتروني',
      description: 'Verifies email addresses for deliverability',

      providers: ['hunter', 'prospeo'],
      fallback_enabled: true,

      max_cost_per_record: 2,
      max_total_cost: 200,

      // Run if has email but not verified
      run_conditions: [
        { field: 'email', operator: 'exists' },
        { field: 'icp_status', operator: 'equals', value: 'Yes' },
      ],

      // Skip if already verified
      skip_conditions: [
        { field: 'email_status', operator: 'equals', value: 'valid' },
      ],

      rate_limit_per_minute: 50,
      delay_between_calls_ms: 500,

      ...config,
    });
  }

  /**
   * Check if should run
   */
  shouldRun(record: NormalizedLeadObject): { should_run: boolean; reason: string } {
    // Must have email
    if (!record.email) {
      return {
        should_run: false,
        reason: 'No email to verify',
      };
    }

    // Skip if already verified as valid
    if (record.email_status === 'valid') {
      return {
        should_run: false,
        reason: 'Email already verified as valid',
      };
    }

    // Only verify ICP-passed leads to save costs
    if (record.icp_status !== 'Yes') {
      return {
        should_run: false,
        reason: 'Only verify emails for ICP-passed leads',
      };
    }

    return {
      should_run: true,
      reason: `Email "${record.email}" needs verification`,
    };
  }

  /**
   * Run email verification
   */
  protected async runEnrichment(
    input: AgentInput,
    output: AgentOutput
  ): Promise<Partial<AgentOutput>> {
    const record = input.record;
    const enrichedFields: Record<string, any> = {};
    const confidence: Record<string, number> = {};

    if (!record.email) {
      return { enriched_fields: {}, confidence: {} };
    }

    // Try providers
    for (const provider of this.providers) {
      output.providers_tried.push(provider.id);

      const apiKey = this.getApiKey(provider);
      if (!apiKey) {
        this.log(`Skipping ${provider.id}: no API key`);
        continue;
      }

      try {
        let result: EmailVerificationResult | null = null;

        switch (provider.id) {
          case 'hunter':
            result = await this.verifyWithHunter(record.email, apiKey);
            break;
          case 'prospeo':
            result = await this.verifyWithProspeo(record.email, apiKey);
            break;
          default:
            continue;
        }

        if (result) {
          output.provider_used = provider.id;
          output.credits_used += 1;
          output.api_calls_made++;

          // Update email status
          enrichedFields.email_status = result.status;
          enrichedFields.email_confidence = result.score;
          enrichedFields.email_verified_at = result.verified_at;
          enrichedFields.email_deliverable = result.deliverable;
          confidence.email_status = result.score;

          this.log(`✓ Email verified via ${provider.id}: ${result.status} (${result.score}%)`);

          // Stop on definitive result
          if (result.status === 'valid' || result.status === 'invalid') {
            break;
          }
        }

        await this.delay();

      } catch (error: any) {
        this.log(`Error with ${provider.id}:`, error.message);
        continue;
      }
    }

    return {
      enriched_fields: enrichedFields,
      confidence,
    };
  }

  /**
   * Verify with Hunter
   */
  private async verifyWithHunter(
    email: string,
    apiKey: string
  ): Promise<EmailVerificationResult | null> {
    this.log('Verifying email with Hunter...');

    try {
      const params = new URLSearchParams({
        email,
        api_key: apiKey,
      });

      const response = await fetch(
        `https://api.hunter.io/v2/email-verifier?${params}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`Hunter API error: ${response.status}`);
      }

      const data = await response.json();
      const verification = data.data;

      if (!verification) {
        return null;
      }

      const status = this.mapHunterStatus(verification.status, verification.result);
      const score = verification.score || 50;

      return {
        email,
        status,
        score,
        mx_found: verification.mx_records || false,
        smtp_valid: verification.smtp_server || false,
        catch_all_domain: verification.accept_all || false,
        disposable: verification.disposable || false,
        role_based: verification.role || false,
        free_email: verification.webmail || false,
        deliverable: status === 'valid' || (status === 'risky' && score >= 70),
        deliverability_score: score,
        provider: 'hunter',
        verified_at: new Date().toISOString(),
      };

    } catch (error: any) {
      this.log('Hunter verification error:', error.message);
      throw error;
    }
  }

  /**
   * Verify with Prospeo
   */
  private async verifyWithProspeo(
    email: string,
    apiKey: string
  ): Promise<EmailVerificationResult | null> {
    this.log('Verifying email with Prospeo...');

    try {
      const response = await fetch('https://api.prospeo.io/email-verifier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-KEY': apiKey,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Prospeo API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.email) {
        return null;
      }

      const status = this.mapProspeoStatus(data.status);
      const score = data.score || (status === 'valid' ? 95 : status === 'invalid' ? 10 : 50);

      return {
        email,
        status,
        score,
        mx_found: data.mx_found || false,
        smtp_valid: data.smtp_check || false,
        catch_all_domain: data.catch_all || false,
        disposable: data.disposable || false,
        role_based: data.role || false,
        free_email: data.free || false,
        deliverable: status === 'valid',
        deliverability_score: score,
        provider: 'prospeo',
        verified_at: new Date().toISOString(),
      };

    } catch (error: any) {
      this.log('Prospeo verification error:', error.message);
      throw error;
    }
  }

  /**
   * Map Hunter status
   */
  private mapHunterStatus(status?: string, result?: string): EmailVerificationResult['status'] {
    // Hunter uses both 'status' and 'result' fields
    const effectiveStatus = result || status;

    switch (effectiveStatus) {
      case 'deliverable':
      case 'valid': return 'valid';
      case 'undeliverable':
      case 'invalid': return 'invalid';
      case 'accept_all':
      case 'catch_all': return 'catch_all';
      case 'risky':
      case 'webmail': return 'risky';
      default: return 'unknown';
    }
  }

  /**
   * Map Prospeo status
   */
  private mapProspeoStatus(status?: string): EmailVerificationResult['status'] {
    switch (status?.toUpperCase()) {
      case 'VALID':
      case 'VERIFIED': return 'valid';
      case 'INVALID':
      case 'UNDELIVERABLE': return 'invalid';
      case 'CATCH_ALL':
      case 'ACCEPT_ALL': return 'catch_all';
      case 'RISKY': return 'risky';
      default: return 'unknown';
    }
  }
}

// Note: We don't register this as a separate agent type since it's specialized
// It will be called by the ContactabilityOrchestrator directly

export default EmailVerifierAgent;
