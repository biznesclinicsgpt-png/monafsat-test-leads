/**
 * Data Center Campaign API
 *
 * POST /api/data-center/campaign
 *
 * Stage 6: Campaign Prep & Export
 *
 * Endpoints:
 * - /api/data-center/campaign?action=templates     - List/manage templates
 * - /api/data-center/campaign?action=personalize  - Preview personalization
 * - /api/data-center/campaign?action=export       - Export leads
 * - /api/data-center/campaign?action=analyze      - Analyze export readiness
 * - /api/data-center/campaign?action=channels     - Get channel info
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  CampaignExporter,
  getCampaignExporter,
} from '../../services/data-center/campaign/exporter';
import {
  PersonalizationEngine,
  getPersonalizationEngine,
} from '../../services/data-center/campaign/personalization';
import {
  TemplateManager,
  getTemplateManager,
} from '../../services/data-center/campaign/templateManager';
import {
  CampaignChannel,
  ExportConfig,
  CampaignTemplate,
  DEFAULT_CHANNELS,
  PERSONALIZATION_TOKENS,
} from '../../services/data-center/campaign/types';
import { NormalizedLeadObject } from '../../services/data-center/types';

// ==========================================
// MAIN HANDLER
// ==========================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'templates':
        return await handleTemplates(req, res);
      case 'personalize':
        return await handlePersonalize(req, res);
      case 'export':
        return await handleExport(req, res);
      case 'analyze':
        return await handleAnalyze(req, res);
      case 'channels':
        return await handleChannels(req, res);
      case 'tokens':
        return handleTokens(req, res);
      default:
        return res.status(400).json({
          error: 'Invalid action. Use: templates, personalize, export, analyze, channels, tokens',
        });
    }
  } catch (error: any) {
    console.error('Campaign API Error:', error);
    return res.status(500).json({
      error: 'Campaign operation failed',
      message: error.message,
    });
  }
}

// ==========================================
// TEMPLATES
// ==========================================

async function handleTemplates(req: VercelRequest, res: VercelResponse) {
  const templateManager = getTemplateManager();
  const { method } = req;

  if (method === 'GET') {
    // List templates
    const { channel, language, id } = req.query;

    if (id && typeof id === 'string') {
      const template = templateManager.get(id);
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      return res.status(200).json({ template });
    }

    let templates = templateManager.getAll();

    if (channel && typeof channel === 'string') {
      templates = templates.filter(t => t.channel === channel);
    }

    if (language && typeof language === 'string') {
      templates = templates.filter(t => t.language === language);
    }

    return res.status(200).json({
      templates,
      stats: templateManager.getStats(),
    });
  }

  if (method === 'POST') {
    const { operation, template, id } = req.body;

    switch (operation) {
      case 'create': {
        const validation = templateManager.validate(template);
        if (!validation.valid) {
          return res.status(400).json({
            error: 'Invalid template',
            errors: validation.errors,
            warnings: validation.warnings,
          });
        }
        const created = templateManager.create(template);
        return res.status(201).json({ template: created, warnings: validation.warnings });
      }

      case 'update': {
        if (!id) {
          return res.status(400).json({ error: 'Template ID required' });
        }
        const updated = templateManager.update(id, template);
        if (!updated) {
          return res.status(404).json({ error: 'Template not found' });
        }
        return res.status(200).json({ template: updated });
      }

      case 'delete': {
        if (!id) {
          return res.status(400).json({ error: 'Template ID required' });
        }
        const deleted = templateManager.delete(id);
        if (!deleted) {
          return res.status(400).json({ error: 'Cannot delete default template' });
        }
        return res.status(200).json({ deleted: true });
      }

      case 'clone': {
        if (!id) {
          return res.status(400).json({ error: 'Template ID required' });
        }
        const cloned = templateManager.clone(id, template?.name);
        if (!cloned) {
          return res.status(404).json({ error: 'Template not found' });
        }
        return res.status(201).json({ template: cloned });
      }

      case 'validate': {
        const validation = templateManager.validate(template);
        return res.status(200).json(validation);
      }

      case 'search': {
        const { query } = req.body;
        const results = templateManager.search(query || '');
        return res.status(200).json({ templates: results });
      }

      default:
        // Default: list templates
        return res.status(200).json({
          templates: templateManager.getAll(),
          stats: templateManager.getStats(),
        });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

// ==========================================
// PERSONALIZATION
// ==========================================

async function handlePersonalize(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { operation, template, record, records, template_id } = req.body;
  const personalization = getPersonalizationEngine();
  const templateManager = getTemplateManager();

  // Get template content
  let templateContent: string;
  let subjectContent: string | undefined;

  if (template_id) {
    const savedTemplate = templateManager.get(template_id);
    if (!savedTemplate) {
      return res.status(404).json({ error: 'Template not found' });
    }
    templateContent = savedTemplate.body;
    subjectContent = savedTemplate.subject;
  } else if (template) {
    templateContent = typeof template === 'string' ? template : template.body;
    subjectContent = template.subject;
  } else {
    return res.status(400).json({ error: 'Template or template_id required' });
  }

  switch (operation) {
    case 'preview': {
      if (!record) {
        return res.status(400).json({ error: 'Record required for preview' });
      }

      const preview = personalization.preview(templateContent, record);
      let subjectPreview;
      if (subjectContent) {
        subjectPreview = personalization.preview(subjectContent, record);
      }

      return res.status(200).json({
        subject: subjectPreview,
        body: preview,
      });
    }

    case 'batch': {
      if (!records || !Array.isArray(records)) {
        return res.status(400).json({ error: 'Records array required' });
      }

      const results = personalization.batchPersonalize(templateContent, records);

      return res.status(200).json({
        results,
        summary: {
          total: results.length,
          valid: results.filter(r => r.valid).length,
          invalid: results.filter(r => !r.valid).length,
        },
      });
    }

    case 'validate': {
      if (!record) {
        return res.status(400).json({ error: 'Record required for validation' });
      }

      const validation = personalization.validateTemplate(templateContent, record);
      return res.status(200).json(validation);
    }

    case 'icebreaker': {
      if (!record) {
        return res.status(400).json({ error: 'Record required' });
      }

      const { style = 'professional' } = req.body;
      const icebreaker = personalization.generateIcebreaker(record, style);
      return res.status(200).json({ icebreaker });
    }

    case 'extract-tokens': {
      const tokens = personalization.extractTokens(templateContent);
      return res.status(200).json({ tokens });
    }

    default:
      // Default: preview single record
      if (record) {
        const preview = personalization.preview(templateContent, record);
        return res.status(200).json({ preview });
      }
      return res.status(400).json({ error: 'Record required' });
  }
}

// ==========================================
// EXPORT
// ==========================================

async function handleExport(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { records, config, template_id } = req.body;

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Records array is required' });
  }

  if (!config || !config.channel) {
    return res.status(400).json({ error: 'Export config with channel is required' });
  }

  // Get template if provided
  let template: CampaignTemplate | undefined;
  if (template_id) {
    const templateManager = getTemplateManager();
    template = templateManager.get(template_id);
  }

  const exporter = getCampaignExporter();
  const exportConfig: ExportConfig = {
    channel: config.channel,
    template_id: template_id,
    filters: config.filters || {},
    limit: config.limit,
    offset: config.offset,
    format: config.format || 'json',
    include_personalization: config.include_personalization !== false,
    destination: config.destination,
  };

  const result = await exporter.export(records, exportConfig, template);

  // For CSV format, return as downloadable
  if (config.format === 'csv' || config.format === 'smartlead' || config.format === 'lemlist' || config.format === 'instantly') {
    if (config.download) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${result.file_name}"`);

      // Convert records to CSV
      const exporter = getCampaignExporter();
      let csvData: string = '';

      if (result.records && result.records.length > 0) {
        const headers = Object.keys(result.records[0]);
        const rows = result.records.map(record => {
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
        csvData = [headers.join(','), ...rows].join('\n');
      }

      return res.status(200).send(csvData);
    }
  }

  return res.status(200).json(result);
}

// ==========================================
// ANALYZE
// ==========================================

async function handleAnalyze(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { records } = req.body;

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Records array is required' });
  }

  const exporter = getCampaignExporter();
  const analysis = exporter.analyzeExportReadiness(records);

  return res.status(200).json(analysis);
}

// ==========================================
// CHANNELS
// ==========================================

async function handleChannels(req: VercelRequest, res: VercelResponse) {
  const exporter = getCampaignExporter();

  const channels = DEFAULT_CHANNELS.map(channel => ({
    ...channel,
    requirements: exporter.getChannelRequirements(channel.id),
  }));

  return res.status(200).json({
    channels,
    stage: {
      number: 6,
      name: 'Campaign Prep & Export',
      name_ar: 'إعداد الحملات والتصدير',
      description: 'Prepare and export leads to campaign channels',
    },
  });
}

// ==========================================
// TOKENS
// ==========================================

function handleTokens(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    tokens: PERSONALIZATION_TOKENS,
    example: {
      template: 'Hi {{first_name}}, I noticed your role at {{company}}.',
      description: 'Use tokens in double curly braces to personalize messages',
    },
  });
}
