/**
 * Campaign Exporter
 *
 * Stage 6: Campaign Prep & Export
 *
 * Handles exporting campaign-ready leads to:
 * - CSV (universal)
 * - Smartlead format
 * - Lemlist format
 * - Instantly format
 * - LinkedIn (PhantomBuster)
 * - WhatsApp
 */

import { NormalizedLeadObject } from '../types';
import {
  CampaignChannel,
  ExportConfig,
  ExportRecord,
  ExportResult,
  SmartleadExport,
  LemlistExport,
  InstantlyExport,
  LinkedInExport,
  WhatsAppExport,
  CampaignTemplate,
} from './types';
import { PersonalizationEngine, getPersonalizationEngine } from './personalization';

// ==========================================
// CAMPAIGN EXPORTER
// ==========================================

export class CampaignExporter {
  private personalization: PersonalizationEngine;

  constructor() {
    this.personalization = getPersonalizationEngine();
  }

  /**
   * Export leads based on config
   */
  async export(
    leads: NormalizedLeadObject[],
    config: ExportConfig,
    template?: CampaignTemplate
  ): Promise<ExportResult> {
    const startTime = Date.now();
    const exportId = this.generateExportId();

    // Filter leads
    let filteredLeads = this.filterLeads(leads, config);

    // Apply limits
    if (config.offset) {
      filteredLeads = filteredLeads.slice(config.offset);
    }
    if (config.limit) {
      filteredLeads = filteredLeads.slice(0, config.limit);
    }

    // Convert to export records
    const exportRecords: ExportRecord[] = [];
    const errors: { record_id: string; error: string }[] = [];

    for (const lead of filteredLeads) {
      try {
        const record = this.toExportRecord(lead, config, template);
        exportRecords.push(record);
      } catch (error: any) {
        errors.push({
          record_id: lead.id,
          error: error.message,
        });
      }
    }

    // Format output
    let formattedOutput: any;
    let fileName: string | undefined;

    switch (config.format) {
      case 'csv':
        formattedOutput = this.toCSV(exportRecords);
        fileName = `export_${config.channel}_${exportId}.csv`;
        break;
      case 'smartlead':
        formattedOutput = this.toSmartlead(filteredLeads, template);
        fileName = `smartlead_${exportId}.csv`;
        break;
      case 'lemlist':
        formattedOutput = this.toLemlist(filteredLeads, template);
        fileName = `lemlist_${exportId}.csv`;
        break;
      case 'instantly':
        formattedOutput = this.toInstantly(filteredLeads, template);
        fileName = `instantly_${exportId}.csv`;
        break;
      case 'json':
      default:
        formattedOutput = exportRecords;
        fileName = `export_${config.channel}_${exportId}.json`;
    }

    // Push to API if configured
    let apiResult: ExportResult['api_result'];
    if (config.destination?.type === 'api' && config.destination.url) {
      apiResult = await this.pushToAPI(
        formattedOutput,
        config.destination
      );
    }

    return {
      export_id: exportId,
      status: errors.length === 0 ? 'success' : errors.length < filteredLeads.length ? 'partial' : 'failed',
      total_records: leads.length,
      exported_records: exportRecords.length,
      failed_records: errors.length,
      channel: config.channel,
      records: exportRecords,
      errors: errors.length > 0 ? errors : undefined,
      file_name: fileName,
      api_result: apiResult,
      duration_ms: Date.now() - startTime,
      exported_at: new Date().toISOString(),
    };
  }

  /**
   * Filter leads based on config
   */
  private filterLeads(
    leads: NormalizedLeadObject[],
    config: ExportConfig
  ): NormalizedLeadObject[] {
    return leads.filter(lead => {
      const filters = config.filters;

      // Channel-specific requirements
      switch (config.channel) {
        case 'email':
          if (!lead.email) return false;
          if (lead.email_status === 'invalid') return false;
          break;
        case 'phone':
        case 'whatsapp':
        case 'sms':
          if (!lead.phone) return false;
          if (lead.phone_status === 'invalid') return false;
          break;
        case 'linkedin':
          if (!lead.linkedin_url) return false;
          break;
      }

      // ICP status filter
      if (filters.icp_status && filters.icp_status.length > 0) {
        if (!filters.icp_status.includes(lead.icp_status as any)) {
          return false;
        }
      }

      // ICP tier filter
      if (filters.icp_tier && filters.icp_tier.length > 0) {
        if (!filters.icp_tier.includes(lead.icp_tier as any)) {
          return false;
        }
      }

      // Score filters
      if (filters.min_score !== undefined) {
        if ((lead.icp_fit_score || 0) < filters.min_score) {
          return false;
        }
      }
      if (filters.max_score !== undefined) {
        if ((lead.icp_fit_score || 0) > filters.max_score) {
          return false;
        }
      }

      // Contact info filters
      if (filters.has_email && !lead.email) return false;
      if (filters.has_phone && !lead.phone) return false;
      if (filters.has_linkedin && !lead.linkedin_url) return false;

      // Industry filter
      if (filters.industries && filters.industries.length > 0) {
        if (!lead.industry || !filters.industries.includes(lead.industry)) {
          return false;
        }
      }

      // Country filter
      if (filters.countries && filters.countries.length > 0) {
        if (!lead.country || !filters.countries.includes(lead.country)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Convert lead to export record
   */
  private toExportRecord(
    lead: NormalizedLeadObject,
    config: ExportConfig,
    template?: CampaignTemplate
  ): ExportRecord {
    // Get available channels for this lead
    const channels: string[] = [];
    if (lead.email && lead.email_status !== 'invalid') channels.push('email');
    if (lead.phone && lead.phone_status !== 'invalid') {
      channels.push('phone');
      channels.push('whatsapp');
    }
    if (lead.linkedin_url) channels.push('linkedin');

    // Personalize if template provided
    let personalizedSubject: string | undefined;
    let personalizedBody: string | undefined;

    if (template && config.include_personalization) {
      const personalized = this.personalization.personalizeEmail(lead, template);
      personalizedSubject = personalized.subject;
      personalizedBody = personalized.body;
    }

    return {
      id: lead.id,
      first_name: lead.first_name,
      last_name: lead.last_name,
      full_name: lead.full_name,
      email: lead.email,
      email_status: lead.email_status,
      phone: lead.phone,
      phone_status: lead.phone_status,
      linkedin_url: lead.linkedin_url,
      company_name: lead.company_name,
      company_domain: lead.company_domain,
      title_normalized: lead.title_normalized,
      seniority_level: lead.seniority_level,
      industry: lead.industry,
      company_size: lead.company_size,
      country: lead.country,
      city: lead.city,
      icp_status: lead.icp_status,
      icp_fit_score: lead.icp_fit_score,
      icp_tier: lead.icp_tier,
      campaign_channels: channels,
      personalized_subject: personalizedSubject,
      personalized_body: personalizedBody,
      export_id: '',
      exported_at: new Date().toISOString(),
      destination: config.destination?.type || 'download',
    };
  }

  /**
   * Convert to CSV format
   */
  private toCSV(records: ExportRecord[]): string {
    if (records.length === 0) return '';

    const headers = Object.keys(records[0]);
    const rows = records.map(record => {
      return headers.map(header => {
        const value = (record as any)[header];
        if (value === null || value === undefined) return '';
        if (Array.isArray(value)) return `"${value.join(', ')}"`;
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Convert to Smartlead format
   */
  private toSmartlead(
    leads: NormalizedLeadObject[],
    template?: CampaignTemplate
  ): SmartleadExport[] {
    return leads
      .filter(lead => lead.email)
      .map(lead => ({
        email: lead.email!,
        first_name: lead.first_name || '',
        last_name: lead.last_name || '',
        company_name: lead.company_name || '',
        phone_number: lead.phone || undefined,
        linkedin_url: lead.linkedin_url || undefined,
        custom_fields: {
          title: lead.title_normalized || '',
          industry: lead.industry || '',
          country: lead.country || '',
          icp_score: String(lead.icp_fit_score || ''),
          icp_tier: lead.icp_tier || '',
          personalized_line: template
            ? this.personalization.generateIcebreaker(lead, 'professional')
            : '',
        },
      }));
  }

  /**
   * Convert to Lemlist format
   */
  private toLemlist(
    leads: NormalizedLeadObject[],
    template?: CampaignTemplate
  ): LemlistExport[] {
    return leads
      .filter(lead => lead.email)
      .map(lead => ({
        email: lead.email!,
        firstName: lead.first_name || '',
        lastName: lead.last_name || '',
        companyName: lead.company_name || '',
        phone: lead.phone || undefined,
        linkedinUrl: lead.linkedin_url || undefined,
        icebreaker: template
          ? this.personalization.generateIcebreaker(lead, 'professional')
          : undefined,
      }));
  }

  /**
   * Convert to Instantly format
   */
  private toInstantly(
    leads: NormalizedLeadObject[],
    template?: CampaignTemplate
  ): InstantlyExport[] {
    return leads
      .filter(lead => lead.email)
      .map(lead => ({
        email: lead.email!,
        first_name: lead.first_name || '',
        last_name: lead.last_name || '',
        company: lead.company_name || '',
        personalization: template
          ? this.personalization.generateIcebreaker(lead, 'professional')
          : '',
        website: lead.company_domain || undefined,
      }));
  }

  /**
   * Convert to LinkedIn export format
   */
  toLinkedIn(
    leads: NormalizedLeadObject[],
    connectionMessage?: string
  ): LinkedInExport[] {
    return leads
      .filter(lead => lead.linkedin_url)
      .map(lead => ({
        linkedin_url: lead.linkedin_url!,
        first_name: lead.first_name || '',
        last_name: lead.last_name || '',
        company: lead.company_name || '',
        title: lead.title_normalized || '',
        connection_message: connectionMessage
          ? this.personalization.personalize(connectionMessage, lead)
          : undefined,
      }));
  }

  /**
   * Convert to WhatsApp export format
   */
  toWhatsApp(
    leads: NormalizedLeadObject[],
    messageTemplate: string
  ): WhatsAppExport[] {
    return leads
      .filter(lead => lead.phone)
      .map(lead => ({
        phone: lead.phone!,
        first_name: lead.first_name || '',
        message: this.personalization.personalize(messageTemplate, lead),
      }));
  }

  /**
   * Push to external API
   */
  private async pushToAPI(
    data: any,
    destination: NonNullable<ExportConfig['destination']>
  ): Promise<ExportResult['api_result']> {
    if (!destination.url) {
      return { destination: 'unknown', message: 'No URL provided' };
    }

    try {
      const response = await fetch(destination.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(destination.api_key && { 'Authorization': `Bearer ${destination.api_key}` }),
        },
        body: JSON.stringify({
          campaign_id: destination.campaign_id,
          leads: Array.isArray(data) ? data : undefined,
          data: !Array.isArray(data) ? data : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      return {
        destination: destination.url,
        campaign_id: destination.campaign_id,
        leads_added: result.leads_added || result.count || (Array.isArray(data) ? data.length : 1),
        message: result.message || 'Success',
      };

    } catch (error: any) {
      return {
        destination: destination.url,
        message: `Error: ${error.message}`,
      };
    }
  }

  /**
   * Generate export ID
   */
  private generateExportId(): string {
    return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get channel requirements
   */
  getChannelRequirements(channel: CampaignChannel): {
    required_fields: string[];
    optional_fields: string[];
    description: string;
    description_ar: string;
  } {
    const requirements: Record<CampaignChannel, any> = {
      email: {
        required_fields: ['email'],
        optional_fields: ['first_name', 'last_name', 'company_name', 'title'],
        description: 'Requires valid email address',
        description_ar: 'يتطلب بريد إلكتروني صالح',
      },
      linkedin: {
        required_fields: ['linkedin_url'],
        optional_fields: ['first_name', 'last_name', 'company_name', 'title'],
        description: 'Requires LinkedIn profile URL',
        description_ar: 'يتطلب رابط ملف لينكد إن',
      },
      whatsapp: {
        required_fields: ['phone'],
        optional_fields: ['first_name', 'country'],
        description: 'Requires valid phone number',
        description_ar: 'يتطلب رقم هاتف صالح',
      },
      phone: {
        required_fields: ['phone'],
        optional_fields: ['first_name', 'company_name', 'title'],
        description: 'Requires valid phone number for calls',
        description_ar: 'يتطلب رقم هاتف للمكالمات',
      },
      sms: {
        required_fields: ['phone'],
        optional_fields: ['first_name'],
        description: 'Requires valid phone number for SMS',
        description_ar: 'يتطلب رقم هاتف للرسائل النصية',
      },
    };

    return requirements[channel];
  }

  /**
   * Analyze leads for export readiness
   */
  analyzeExportReadiness(
    leads: NormalizedLeadObject[]
  ): {
    total: number;
    by_channel: Record<CampaignChannel, { ready: number; missing: number }>;
    by_tier: Record<string, number>;
    recommendations: string[];
  } {
    const channels: CampaignChannel[] = ['email', 'linkedin', 'whatsapp', 'phone', 'sms'];
    const byChannel: Record<CampaignChannel, { ready: number; missing: number }> = {} as any;
    const byTier: Record<string, number> = { VIP: 0, Priority: 0, Standard: 0, Low: 0, Unknown: 0 };
    const recommendations: string[] = [];

    for (const channel of channels) {
      byChannel[channel] = { ready: 0, missing: 0 };
    }

    for (const lead of leads) {
      // Count by tier
      const tier = lead.icp_tier || 'Unknown';
      byTier[tier] = (byTier[tier] || 0) + 1;

      // Count by channel readiness
      if (lead.email && lead.email_status !== 'invalid') {
        byChannel.email.ready++;
      } else {
        byChannel.email.missing++;
      }

      if (lead.linkedin_url) {
        byChannel.linkedin.ready++;
      } else {
        byChannel.linkedin.missing++;
      }

      if (lead.phone && lead.phone_status !== 'invalid') {
        byChannel.whatsapp.ready++;
        byChannel.phone.ready++;
        byChannel.sms.ready++;
      } else {
        byChannel.whatsapp.missing++;
        byChannel.phone.missing++;
        byChannel.sms.missing++;
      }
    }

    // Generate recommendations
    const emailRate = byChannel.email.ready / leads.length;
    const phoneRate = byChannel.phone.ready / leads.length;
    const linkedinRate = byChannel.linkedin.ready / leads.length;

    if (emailRate < 0.5) {
      recommendations.push('Consider running email enrichment - only ' + Math.round(emailRate * 100) + '% have emails');
    }
    if (phoneRate < 0.3 && byTier.VIP > 0) {
      recommendations.push('VIP leads may benefit from phone enrichment for WhatsApp outreach');
    }
    if (linkedinRate > 0.7 && emailRate < 0.5) {
      recommendations.push('High LinkedIn coverage - consider LinkedIn outreach while enriching emails');
    }

    return {
      total: leads.length,
      by_channel: byChannel,
      by_tier: byTier,
      recommendations,
    };
  }
}

// ==========================================
// SINGLETON
// ==========================================

let exporterInstance: CampaignExporter | null = null;

export const getCampaignExporter = (): CampaignExporter => {
  if (!exporterInstance) {
    exporterInstance = new CampaignExporter();
  }
  return exporterInstance;
};

export default CampaignExporter;
