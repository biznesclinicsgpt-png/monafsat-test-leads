
export enum LeadSource {
  INBOUND_MARKETPLACE = 'inbound_marketplace',
  OUTBOUND_CONTACTS = 'outbound_contacts'
}

export enum PipelineStage {
  NEW = 'New',
  ICP_VERIFIED = 'ICP Verified',
  HIGH_FIT = 'Fit ≥ 70',
  READY_TO_OUTREACH = 'Ready to Outreach',
  IN_CONVERSATION = 'In Conversation',
  MEETING_BOOKED = 'Meeting Booked',
  OPPORTUNITY = 'Opportunity'
}

export const PipelineStageLabels: Record<PipelineStage, string> = {
  [PipelineStage.NEW]: 'جديد',
  [PipelineStage.ICP_VERIFIED]: 'تم التحقق (ICP)',
  [PipelineStage.HIGH_FIT]: 'ملاءمة عالية (≥70%)',
  [PipelineStage.READY_TO_OUTREACH]: 'جاهز للتواصل',
  [PipelineStage.IN_CONVERSATION]: 'محادثة جارية',
  [PipelineStage.MEETING_BOOKED]: 'موعد محجوز',
  [PipelineStage.OPPORTUNITY]: 'فرصة بيعية'
};

export interface Contact {
  id: string;
  name: string;
  company: string;
  title: string;
  linkedinUrl?: string;
  website?: string;
  email: {
    address?: string;
    status: 'none' | 'unverified' | 'valid' | 'invalid';
  };
  phone: {
    number?: string;
    status: 'none' | 'unverified' | 'valid';
  };
  icpStatus: 'pending' | 'verified' | 'failed';
  fitScore: number;
  stage: PipelineStage;
  source: LeadSource;
  tags: string[];
}

export interface Segment {
  id: string;
  name: string;
  count: number;
  description: string;
}

export interface ProviderICP {
  isSet: boolean;
  lastUpdated?: string;
  industries: string[];
  titles: string[];
  budgetRange: { min: number; max: number };
}
