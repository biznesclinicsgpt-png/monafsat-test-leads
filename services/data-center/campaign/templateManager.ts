/**
 * Template Manager
 *
 * Stage 6: Campaign Prep
 *
 * Manages campaign templates:
 * - CRUD operations
 * - Default templates
 * - Template validation
 * - Sequence management
 */

import {
  CampaignTemplate,
  CampaignChannel,
  PERSONALIZATION_TOKENS,
} from './types';

// ==========================================
// DEFAULT TEMPLATES
// ==========================================

export const DEFAULT_TEMPLATES: CampaignTemplate[] = [
  // English Email Templates
  {
    id: 'email_intro_en',
    name: 'Cold Outreach - Introduction',
    name_ar: 'تواصل بارد - تعريف',
    channel: 'email',
    subject: 'Quick question for {{first_name}} at {{company}}',
    body: `Hi {{first_name}},

I noticed you're leading {{title}} efforts at {{company}}. We help companies in {{industry}} streamline their operations and drive growth.

Would you be open to a quick 15-minute call this week to explore if there's a fit?

Best,
[Your Name]`,
    signature: '',
    tokens_used: ['{{first_name}}', '{{title}}', '{{company}}', '{{industry}}'],
    target_icp_status: ['Yes'],
    target_icp_tier: ['VIP', 'Priority'],
    language: 'en',
    is_follow_up: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'email_followup_en',
    name: 'Follow-up #1',
    name_ar: 'متابعة #1',
    channel: 'email',
    subject: 'Re: Quick question for {{first_name}} at {{company}}',
    body: `Hi {{first_name}},

Just following up on my previous email. I understand you're busy, but I believe this could be valuable for {{company}}.

Would next week work better for a brief chat?

Best,
[Your Name]`,
    signature: '',
    tokens_used: ['{{first_name}}', '{{company}}'],
    target_icp_status: ['Yes'],
    language: 'en',
    is_follow_up: true,
    sequence_step: 2,
    delay_days: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Arabic Email Templates
  {
    id: 'email_intro_ar',
    name: 'Cold Outreach - Arabic',
    name_ar: 'تواصل بارد - عربي',
    channel: 'email',
    subject: 'فرصة تعاون مع {{company}}',
    body: `مرحباً {{first_name}}،

لاحظت دورك المتميز في {{company}} كـ {{title}}. نحن نساعد الشركات في قطاع {{industry}} على تحسين عملياتها وتحقيق النمو.

هل تكون متاحاً لمكالمة قصيرة هذا الأسبوع لاستكشاف فرص التعاون؟

مع أطيب التحيات،
[اسمك]`,
    signature: '',
    tokens_used: ['{{first_name}}', '{{title}}', '{{company}}', '{{industry}}'],
    target_icp_status: ['Yes'],
    language: 'ar',
    is_follow_up: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // LinkedIn Templates
  {
    id: 'linkedin_connect_en',
    name: 'LinkedIn Connection Request',
    name_ar: 'طلب اتصال لينكد إن',
    channel: 'linkedin',
    body: `Hi {{first_name}}, I came across your profile and noticed your work at {{company}}. I'd love to connect and share insights about {{industry}}. Looking forward to connecting!`,
    tokens_used: ['{{first_name}}', '{{company}}', '{{industry}}'],
    target_icp_status: ['Yes', 'Unknown'],
    language: 'en',
    is_follow_up: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'linkedin_connect_ar',
    name: 'LinkedIn Connection - Arabic',
    name_ar: 'طلب اتصال لينكد إن - عربي',
    channel: 'linkedin',
    body: `مرحباً {{first_name}}، لاحظت عملك المتميز في {{company}}. يسعدني التواصل معك وتبادل الأفكار حول قطاع {{industry}}.`,
    tokens_used: ['{{first_name}}', '{{company}}', '{{industry}}'],
    target_icp_status: ['Yes', 'Unknown'],
    language: 'ar',
    is_follow_up: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // WhatsApp Templates
  {
    id: 'whatsapp_intro_en',
    name: 'WhatsApp Introduction',
    name_ar: 'رسالة واتساب تعريفية',
    channel: 'whatsapp',
    body: `Hi {{first_name}}! This is [Your Name] from [Company]. I noticed your work at {{company}} and wanted to quickly connect about a potential partnership opportunity. Is this a good time to chat?`,
    tokens_used: ['{{first_name}}', '{{company}}'],
    target_icp_status: ['Yes'],
    target_icp_tier: ['VIP'],
    language: 'en',
    is_follow_up: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'whatsapp_intro_ar',
    name: 'WhatsApp Introduction - Arabic',
    name_ar: 'رسالة واتساب تعريفية - عربي',
    channel: 'whatsapp',
    body: `مرحباً {{first_name}}! معك [اسمك] من [شركتك]. لاحظت عملك في {{company}} وأردت التواصل بخصوص فرصة تعاون. هل الوقت مناسب للحديث؟`,
    tokens_used: ['{{first_name}}', '{{company}}'],
    target_icp_status: ['Yes'],
    target_icp_tier: ['VIP'],
    language: 'ar',
    is_follow_up: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ==========================================
// TEMPLATE MANAGER
// ==========================================

export class TemplateManager {
  private templates: Map<string, CampaignTemplate>;

  constructor(initialTemplates?: CampaignTemplate[]) {
    this.templates = new Map();

    // Load default templates
    for (const template of DEFAULT_TEMPLATES) {
      this.templates.set(template.id, template);
    }

    // Add custom templates
    if (initialTemplates) {
      for (const template of initialTemplates) {
        this.templates.set(template.id, template);
      }
    }
  }

  /**
   * Get all templates
   */
  getAll(): CampaignTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template by ID
   */
  get(id: string): CampaignTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * Get templates by channel
   */
  getByChannel(channel: CampaignChannel): CampaignTemplate[] {
    return this.getAll().filter(t => t.channel === channel);
  }

  /**
   * Get templates by language
   */
  getByLanguage(language: 'en' | 'ar' | 'mixed'): CampaignTemplate[] {
    return this.getAll().filter(t => t.language === language);
  }

  /**
   * Get sequence templates (for follow-ups)
   */
  getSequence(startTemplateId: string): CampaignTemplate[] {
    const startTemplate = this.get(startTemplateId);
    if (!startTemplate) return [];

    // Find all follow-ups for same channel
    const sequence = this.getAll()
      .filter(t =>
        t.channel === startTemplate.channel &&
        (t.id === startTemplateId || t.is_follow_up)
      )
      .sort((a, b) => (a.sequence_step || 1) - (b.sequence_step || 1));

    return sequence;
  }

  /**
   * Create template
   */
  create(template: Omit<CampaignTemplate, 'id' | 'created_at' | 'updated_at'>): CampaignTemplate {
    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newTemplate: CampaignTemplate = {
      ...template,
      id,
      created_at: now,
      updated_at: now,
    };

    // Extract tokens used
    newTemplate.tokens_used = this.extractTokens(
      (template.subject || '') + ' ' + template.body
    );

    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  /**
   * Update template
   */
  update(id: string, updates: Partial<CampaignTemplate>): CampaignTemplate | null {
    const existing = this.templates.get(id);
    if (!existing) return null;

    const updated: CampaignTemplate = {
      ...existing,
      ...updates,
      id, // Preserve ID
      created_at: existing.created_at, // Preserve creation date
      updated_at: new Date().toISOString(),
    };

    // Re-extract tokens if content changed
    if (updates.subject || updates.body) {
      updated.tokens_used = this.extractTokens(
        (updated.subject || '') + ' ' + updated.body
      );
    }

    this.templates.set(id, updated);
    return updated;
  }

  /**
   * Delete template
   */
  delete(id: string): boolean {
    // Don't allow deleting default templates
    if (DEFAULT_TEMPLATES.some(t => t.id === id)) {
      return false;
    }
    return this.templates.delete(id);
  }

  /**
   * Clone template
   */
  clone(id: string, newName?: string): CampaignTemplate | null {
    const original = this.templates.get(id);
    if (!original) return null;

    return this.create({
      ...original,
      name: newName || `${original.name} (Copy)`,
      name_ar: `${original.name_ar} (نسخة)`,
    });
  }

  /**
   * Validate template
   */
  validate(template: Partial<CampaignTemplate>): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!template.name) errors.push('Name is required');
    if (!template.channel) errors.push('Channel is required');
    if (!template.body) errors.push('Body is required');

    // Email-specific
    if (template.channel === 'email' && !template.subject) {
      errors.push('Email subject is required');
    }

    // Check for unknown tokens
    if (template.body) {
      const tokens = this.extractTokens(template.body);
      const validTokens = PERSONALIZATION_TOKENS.map(t => t.token);

      for (const token of tokens) {
        if (!validTokens.includes(token)) {
          warnings.push(`Unknown token: ${token}`);
        }
      }
    }

    // Character limits
    if (template.channel === 'linkedin' && template.body && template.body.length > 300) {
      warnings.push('LinkedIn messages should be under 300 characters');
    }

    if (template.channel === 'whatsapp' && template.body && template.body.length > 1000) {
      warnings.push('WhatsApp messages should be under 1000 characters');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Extract tokens from text
   */
  private extractTokens(text: string): string[] {
    const tokenPattern = /\{\{([^}]+)\}\}/g;
    const matches = text.matchAll(tokenPattern);
    const tokens: string[] = [];

    for (const match of matches) {
      const token = `{{${match[1]}}}`;
      if (!tokens.includes(token)) {
        tokens.push(token);
      }
    }

    return tokens;
  }

  /**
   * Get template statistics
   */
  getStats(): {
    total: number;
    by_channel: Record<CampaignChannel, number>;
    by_language: Record<string, number>;
    custom_count: number;
  } {
    const templates = this.getAll();
    const byChannel: Record<CampaignChannel, number> = {
      email: 0,
      linkedin: 0,
      whatsapp: 0,
      phone: 0,
      sms: 0,
    };
    const byLanguage: Record<string, number> = { en: 0, ar: 0, mixed: 0 };

    for (const t of templates) {
      byChannel[t.channel]++;
      byLanguage[t.language]++;
    }

    return {
      total: templates.length,
      by_channel: byChannel,
      by_language: byLanguage,
      custom_count: templates.length - DEFAULT_TEMPLATES.length,
    };
  }

  /**
   * Search templates
   */
  search(query: string): CampaignTemplate[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.name_ar.includes(query) ||
      t.body.toLowerCase().includes(lowerQuery)
    );
  }
}

// ==========================================
// SINGLETON
// ==========================================

let templateManagerInstance: TemplateManager | null = null;

export const getTemplateManager = (
  initialTemplates?: CampaignTemplate[]
): TemplateManager => {
  if (!templateManagerInstance || initialTemplates) {
    templateManagerInstance = new TemplateManager(initialTemplates);
  }
  return templateManagerInstance;
};

export default TemplateManager;
