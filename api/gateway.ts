/**
 * API Gateway - Campaign Scenarios Generator
 *
 * Endpoint: /api/gateway
 *
 * This endpoint generates personalized campaign messaging scenarios
 * for multi-channel outreach campaigns (Email, LinkedIn, WhatsApp, Phone).
 *
 * Actions:
 * - generate-scenarios: Generate personalized messaging scenarios
 * - get-templates: Get available message templates
 * - preview-message: Preview a personalized message
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Types
interface ScenarioRequest {
  action: 'generate-scenarios' | 'get-templates' | 'preview-message';
  agentName?: string;
  clientCount?: number;
  channels?: ('email' | 'linkedin' | 'whatsapp' | 'phone')[];
  providerId?: string;
  totalMessages?: number;
  templateId?: string;
  leadData?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    title?: string;
    industry?: string;
  };
}

interface MessageTemplate {
  id: string;
  channel: string;
  language: 'ar' | 'en';
  name: string;
  subject?: string;
  body: string;
  variables: string[];
}

interface CampaignScenario {
  id: string;
  sequence: number;
  channel: string;
  dayOffset: number;
  template: MessageTemplate;
  personalizationHints: string[];
}

// Default templates for each channel
const DEFAULT_TEMPLATES: MessageTemplate[] = [
  // Email Templates
  {
    id: 'email-cold-ar',
    channel: 'email',
    language: 'ar',
    name: 'تواصل بارد - تعريف',
    subject: 'فرصة تعاون مع {{company}}',
    body: `مرحباً {{firstName}}،

لاحظت دورك المتميز كـ {{title}} في {{company}}، وأردت التواصل معك بخصوص فرصة قد تكون مفيدة لفريقك.

نحن في {{agentCompany}} نساعد الشركات مثل {{company}} في تحقيق أهدافها من خلال [خدمتنا].

هل يمكننا ترتيب مكالمة قصيرة لمناقشة كيف يمكننا مساعدتكم؟

مع التحية،
{{agentName}}`,
    variables: ['firstName', 'title', 'company', 'agentCompany', 'agentName']
  },
  {
    id: 'email-followup-ar',
    channel: 'email',
    language: 'ar',
    name: 'متابعة - تذكير',
    subject: 'متابعة: فرصة تعاون',
    body: `مرحباً {{firstName}}،

أتمنى أن تكون بخير. أردت المتابعة على رسالتي السابقة.

هل لديك وقت هذا الأسبوع لمكالمة قصيرة؟

تحياتي،
{{agentName}}`,
    variables: ['firstName', 'agentName']
  },
  // LinkedIn Templates
  {
    id: 'linkedin-connect-ar',
    channel: 'linkedin',
    language: 'ar',
    name: 'طلب اتصال',
    body: `مرحباً {{firstName}}،

يسعدني التواصل معك. لاحظت عملك في {{company}} وأعتقد أن هناك فرصة للتعاون المشترك.

أتطلع للتواصل!`,
    variables: ['firstName', 'company']
  },
  {
    id: 'linkedin-message-ar',
    channel: 'linkedin',
    language: 'ar',
    name: 'رسالة مباشرة',
    body: `مرحباً {{firstName}}،

شكراً لقبول طلب الاتصال! أنا {{agentName}} من {{agentCompany}}.

نساعد الشركات في قطاع {{industry}} على تحقيق نتائج أفضل. هل يمكنني مشاركة بعض الأفكار معك؟`,
    variables: ['firstName', 'agentName', 'agentCompany', 'industry']
  },
  // WhatsApp Templates
  {
    id: 'whatsapp-intro-ar',
    channel: 'whatsapp',
    language: 'ar',
    name: 'رسالة تعريف',
    body: `مرحباً {{firstName}} 👋

معك {{agentName}} من {{agentCompany}}.

تواصلت معك لأن شركتكم {{company}} قد تستفيد من خدماتنا في [المجال].

هل لديك وقت لمكالمة قصيرة؟`,
    variables: ['firstName', 'agentName', 'agentCompany', 'company']
  },
  // Phone Script Templates
  {
    id: 'phone-cold-ar',
    channel: 'phone',
    language: 'ar',
    name: 'نص مكالمة باردة',
    body: `السلام عليكم {{firstName}}،

معك {{agentName}} من {{agentCompany}}.

أتصل بك اليوم لأن شركتكم {{company}} قد تستفيد من خدماتنا...

[انتظر الرد]

ممتاز، دعني أشرح لك بسرعة...`,
    variables: ['firstName', 'agentName', 'agentCompany', 'company']
  }
];

// Generate campaign scenarios based on channels and client count
function generateCampaignScenarios(
  channels: string[],
  clientCount: number,
  agentName: string,
  totalMessages: number
): CampaignScenario[] {
  const scenarios: CampaignScenario[] = [];
  let sequenceId = 1;

  // Calculate messages per channel
  const messagesPerChannel = Math.floor(totalMessages / channels.length);
  const touchPointsPerClient = Math.ceil(messagesPerChannel / clientCount);

  // Define channel sequence and day offsets
  const channelSequence: { channel: string; dayOffsets: number[] }[] = [];

  if (channels.includes('linkedin')) {
    channelSequence.push({ channel: 'linkedin', dayOffsets: [0, 3] });
  }
  if (channels.includes('email')) {
    channelSequence.push({ channel: 'email', dayOffsets: [1, 4, 7] });
  }
  if (channels.includes('whatsapp')) {
    channelSequence.push({ channel: 'whatsapp', dayOffsets: [2, 5] });
  }
  if (channels.includes('phone')) {
    channelSequence.push({ channel: 'phone', dayOffsets: [8, 14] });
  }

  // Generate scenarios for each channel
  for (const channelConfig of channelSequence) {
    const channelTemplates = DEFAULT_TEMPLATES.filter(
      t => t.channel === channelConfig.channel
    );

    for (let i = 0; i < Math.min(channelConfig.dayOffsets.length, touchPointsPerClient); i++) {
      const template = channelTemplates[i % channelTemplates.length];

      scenarios.push({
        id: `scenario-${sequenceId}`,
        sequence: sequenceId,
        channel: channelConfig.channel,
        dayOffset: channelConfig.dayOffsets[i],
        template: template,
        personalizationHints: [
          'استخدم اسم العميل الأول',
          'اذكر شركة العميل',
          'أشر إلى القطاع المناسب',
          `وقّع باسم: ${agentName}`
        ]
      });

      sequenceId++;
    }
  }

  // Sort by day offset
  scenarios.sort((a, b) => a.dayOffset - b.dayOffset);

  // Re-sequence after sorting
  scenarios.forEach((s, idx) => {
    s.sequence = idx + 1;
  });

  return scenarios;
}

// Preview a personalized message
function previewMessage(template: MessageTemplate, leadData: any, agentName: string): string {
  let message = template.body;

  const replacements: Record<string, string> = {
    '{{firstName}}': leadData.firstName || 'العميل',
    '{{lastName}}': leadData.lastName || '',
    '{{company}}': leadData.company || 'شركتكم',
    '{{title}}': leadData.title || 'المسؤول',
    '{{industry}}': leadData.industry || 'قطاعكم',
    '{{agentName}}': agentName || 'الفريق',
    '{{agentCompany}}': 'Biznes Clinics',
  };

  for (const [key, value] of Object.entries(replacements)) {
    message = message.replace(new RegExp(key, 'g'), value);
  }

  return message;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Handle GET requests (for templates)
  if (request.method === 'GET') {
    const action = request.query.action as string;

    if (action === 'get-templates') {
      const channel = request.query.channel as string;
      const templates = channel
        ? DEFAULT_TEMPLATES.filter(t => t.channel === channel)
        : DEFAULT_TEMPLATES;

      return response.status(200).json({
        success: true,
        templates
      });
    }

    return response.status(400).json({
      error: 'Invalid action. Use: get-templates',
      availableActions: ['get-templates']
    });
  }

  // Handle POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = request.body as ScenarioRequest;
    const { action } = body;

    if (!action) {
      return response.status(400).json({
        error: 'Action is required',
        availableActions: ['generate-scenarios', 'get-templates', 'preview-message']
      });
    }

    switch (action) {
      case 'generate-scenarios': {
        const {
          agentName = 'الوكيل',
          clientCount = 50,
          channels = ['email', 'linkedin', 'whatsapp', 'phone'],
          totalMessages = 700
        } = body;

        // Validate inputs
        if (clientCount < 1 || clientCount > 10000) {
          return response.status(400).json({
            error: 'عدد العملاء يجب أن يكون بين 1 و 10000'
          });
        }

        if (channels.length === 0) {
          return response.status(400).json({
            error: 'يجب اختيار قناة واحدة على الأقل'
          });
        }

        // Generate scenarios
        const scenarios = generateCampaignScenarios(
          channels,
          clientCount,
          agentName,
          totalMessages
        );

        // Calculate statistics
        const stats = {
          totalScenarios: scenarios.length,
          totalMessages: scenarios.length * clientCount,
          messagesPerClient: scenarios.length,
          channelBreakdown: channels.map(channel => ({
            channel,
            touchPoints: scenarios.filter(s => s.channel === channel).length,
            totalMessages: scenarios.filter(s => s.channel === channel).length * clientCount
          })),
          campaignDuration: Math.max(...scenarios.map(s => s.dayOffset)) + 1
        };

        return response.status(200).json({
          success: true,
          agentName,
          clientCount,
          channels,
          scenarios,
          stats,
          generatedAt: new Date().toISOString()
        });
      }

      case 'get-templates': {
        const channel = body.channels?.[0];
        const templates = channel
          ? DEFAULT_TEMPLATES.filter(t => t.channel === channel)
          : DEFAULT_TEMPLATES;

        return response.status(200).json({
          success: true,
          templates
        });
      }

      case 'preview-message': {
        const { templateId, leadData, agentName } = body;

        if (!templateId) {
          return response.status(400).json({
            error: 'templateId is required'
          });
        }

        const template = DEFAULT_TEMPLATES.find(t => t.id === templateId);
        if (!template) {
          return response.status(404).json({
            error: 'Template not found'
          });
        }

        const preview = previewMessage(
          template,
          leadData || {},
          agentName || 'الوكيل'
        );

        return response.status(200).json({
          success: true,
          template: template.name,
          channel: template.channel,
          preview,
          subject: template.subject
            ? previewMessage({ ...template, body: template.subject }, leadData || {}, agentName || 'الوكيل')
            : undefined
        });
      }

      default:
        return response.status(400).json({
          error: `Invalid action: ${action}`,
          availableActions: ['generate-scenarios', 'get-templates', 'preview-message']
        });
    }

  } catch (error: any) {
    console.error('Gateway Error:', error);
    return response.status(500).json({
      error: 'خطأ في توليد السيناريوهات',
      details: error.message
    });
  }
}
