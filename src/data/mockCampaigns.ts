import { Campaign } from '@/types/database';

export interface CampaignStats {
  sent: number;
  opened: number;
  repliedWithOOO: number;
  positiveReply: number;
  bounced: number;
  senderBounced: number;
}

export interface CampaignWithStats extends Campaign {
  stats: CampaignStats;
  sequences: number;
}

export const mockCampaigns: CampaignWithStats[] = [
  {
    id: '1',
    name: 'Untitled Campaign',
    description: 'Q1 LinkedIn outreach campaign for tech companies',
    campaign_type: 'linkedin',
    status: 'draft',
    target_audience: 'Software engineers at Series A startups',
    messaging_template:
      'Personalised connection requests with value proposition',
    linkedin_message:
      "Hi {{name}}, I noticed you're {{title}} at {{company}}. I'd love to connect and share some insights about our latest product.",
    email_subject: null,
    email_template: null,
    follow_up_message:
      'Following up on my previous message about our product demo.',
    call_script: null,
    start_date: '2024-10-16',
    end_date: '2024-12-31',
    created_by: 'user-1',
    created_at: '2024-10-16T17:54:00Z',
    updated_at: '2024-10-16T17:54:00Z',
    sequences: 0,
    stats: {
      sent: 0,
      opened: 0,
      repliedWithOOO: 0,
      positiveReply: 0,
      bounced: 0,
      senderBounced: 0,
    },
  },
  {
    id: '2',
    name: 'Untitled Campaign',
    description: 'Email campaign for enterprise prospects',
    campaign_type: 'email',
    status: 'draft',
    target_audience: 'CTOs and VPs of Engineering at Fortune 500 companies',
    messaging_template: 'Cold email outreach with case studies',
    linkedin_message: null,
    email_subject: "Quick question about {{company}}'s hiring plans",
    email_template:
      'Hi {{name}}, I hope this email finds you well. I wanted to reach out regarding...',
    follow_up_message:
      'Just following up on my previous email about our services.',
    call_script: null,
    start_date: '2024-03-11',
    end_date: '2024-06-30',
    created_by: 'user-1',
    created_at: '2024-03-11T20:41:00Z',
    updated_at: '2024-03-11T20:41:00Z',
    sequences: 0,
    stats: {
      sent: 0,
      opened: 0,
      repliedWithOOO: 0,
      positiveReply: 0,
      bounced: 0,
      senderBounced: 0,
    },
  },
  {
    id: '3',
    name: 'Q4 Sales Outreach',
    description: 'Multi-channel campaign targeting SaaS companies',
    campaign_type: 'linkedin',
    status: 'active',
    target_audience: 'Sales Directors at B2B SaaS companies',
    messaging_template: 'Personalised outreach with industry insights',
    linkedin_message:
      "Hi {{name}}, I saw your recent post about {{company}}'s growth. I'd love to share some insights that might be relevant.",
    email_subject: 'Partnership opportunity for {{company}}',
    email_template:
      "Hi {{name}}, I hope you're doing well. I wanted to reach out about a potential partnership opportunity.",
    follow_up_message:
      'Following up on my previous message about the partnership opportunity.',
    call_script:
      "Hi {{name}}, this is {{your_name}} from {{company}}. I'm calling because I believe we can help {{company}} increase their sales efficiency.",
    start_date: '2024-10-01',
    end_date: '2024-12-31',
    created_by: 'user-1',
    created_at: '2024-09-15T10:30:00Z',
    updated_at: '2024-10-16T14:20:00Z',
    sequences: 3,
    stats: {
      sent: 156,
      opened: 89,
      repliedWithOOO: 12,
      positiveReply: 8,
      bounced: 3,
      senderBounced: 1,
    },
  },
  {
    id: '4',
    name: 'Enterprise Demo Campaign',
    description: 'Targeted outreach for enterprise prospects',
    campaign_type: 'email',
    status: 'paused',
    target_audience: 'Enterprise decision makers',
    messaging_template: 'Professional email outreach with demo invitations',
    linkedin_message: null,
    email_subject: 'Exclusive demo invitation for {{company}}',
    email_template:
      'Hi {{name}}, I hope this email finds you well. I wanted to personally invite you to an exclusive demo of our enterprise solution.',
    follow_up_message:
      'Just following up on the demo invitation I sent earlier.',
    call_script:
      "Hi {{name}}, this is {{your_name}} from {{company}}. I'm calling to follow up on the demo invitation I sent via email.",
    start_date: '2024-08-01',
    end_date: '2024-11-30',
    created_by: 'user-1',
    created_at: '2024-07-20T09:15:00Z',
    updated_at: '2024-10-10T16:45:00Z',
    sequences: 2,
    stats: {
      sent: 89,
      opened: 67,
      repliedWithOOO: 8,
      positiveReply: 15,
      bounced: 2,
      senderBounced: 0,
    },
  },
  {
    id: '5',
    name: 'Startup Accelerator Program',
    description: 'Outreach to startup founders and accelerators',
    campaign_type: 'linkedin',
    status: 'completed',
    target_audience: 'Startup founders and accelerator program managers',
    messaging_template:
      'Value-driven outreach with accelerator program benefits',
    linkedin_message:
      "Hi {{name}}, I noticed {{company}} is part of the startup ecosystem. I'd love to share how we can help accelerate your growth.",
    email_subject: 'Accelerator program opportunity for {{company}}',
    email_template:
      "Hi {{name}}, I hope you're doing well. I wanted to reach out about our accelerator program that might be perfect for {{company}}.",
    follow_up_message:
      'Following up on the accelerator program opportunity I mentioned.',
    call_script:
      "Hi {{name}}, this is {{your_name}} from {{company}}. I'm calling to discuss our accelerator program and how it can benefit {{company}}.",
    start_date: '2024-06-01',
    end_date: '2024-08-31',
    created_by: 'user-1',
    created_at: '2024-05-15T14:20:00Z',
    updated_at: '2024-08-31T18:00:00Z',
    sequences: 4,
    stats: {
      sent: 234,
      opened: 187,
      repliedWithOOO: 23,
      positiveReply: 31,
      bounced: 5,
      senderBounced: 2,
    },
  },
];

export const getCampaignStats = (campaignId: string): CampaignStats => {
  const campaign = mockCampaigns.find(c => c.id === campaignId);
  return (
    campaign?.stats || {
      sent: 0,
      opened: 0,
      repliedWithOOO: 0,
      positiveReply: 0,
      bounced: 0,
      senderBounced: 0,
    }
  );
};
