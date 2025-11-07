import React from 'react';
import {
  FileText,
  Mail as EmailIcon,
  Linkedin,
  User,
  Phone,
  Calendar,
} from 'lucide-react';

interface MockActivity {
  id: string;
  type:
    | 'linkedin_message'
    | 'email_message'
    | 'automation_step'
    | 'note'
    | 'stage_change'
    | 'call'
    | 'meeting';
  title: string;
  description: string;
  timestamp: string;
  author?: string;
  authorId?: string;
  leadName?: string;
  leadId?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  metadata?: Record<string, unknown>;
}

interface MockNote {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at?: string;
}

export const generateMockActivities = (
  entityId: string,
  entityName: string,
  entityType: 'lead' | 'company' | 'job' = 'lead'
): MockActivity[] => {
  const now = new Date();
  const activities: MockActivity[] = [];

  const mockMessages = [
    {
      type: 'linkedin_message' as const,
      title: 'LinkedIn Message Sent',
      descriptions: [
        'Sent a connection request with personalized message.',
        'Followed up about potential collaboration opportunities.',
        'Discussed project requirements and timeline.',
      ],
      icon: Linkedin,
      color: 'bg-blue-100 text-primary',
    },
    {
      type: 'email_message' as const,
      title: 'Email Sent',
      descriptions: [
        'Sent introductory email with company overview.',
        'Followed up on previous conversation.',
        'Shared relevant case studies and portfolio.',
      ],
      icon: EmailIcon,
      color: 'bg-green-100 text-success',
    },
  ];

  const mockActivities = [
    {
      type: 'note' as const,
      title: 'Note Added',
      descriptions: [
        'Great candidate with strong React experience. Follow up next week.',
        'Interested in remote work. Salary expectations around $120k.',
        'Quick response time. Very engaged during initial conversation.',
      ],
      icon: FileText,
      color: 'bg-gray-100 text-muted-foreground',
    },
    {
      type: 'stage_change' as const,
      title: 'Stage Updated',
      descriptions: [
        `Lead moved to qualified stage`,
        `Lead progressed to proceed stage`,
        `Status updated to new`,
      ],
      icon: User,
      color: 'bg-orange-100 text-warning',
    },
    {
      type: 'call' as const,
      title: 'Call Made',
      descriptions: [
        'Initial screening call completed. Positive response.',
        'Follow-up call to discuss details further.',
        'Quick check-in call to confirm interest.',
      ],
      icon: Phone,
      color: 'bg-purple-100 text-primary',
    },
    {
      type: 'meeting' as const,
      title: 'Meeting Scheduled',
      descriptions: [
        'Scheduled interview for next Tuesday at 2 PM.',
        'Calendar invite sent for follow-up meeting.',
        'Team sync meeting arranged for project discussion.',
      ],
      icon: Calendar,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  for (let i = 0; i < 3; i++) {
    const messageType = mockMessages[i % mockMessages.length];
    const messageDesc =
      messageType.descriptions[i % messageType.descriptions.length];
    const daysAgo = i * 2 + 1;
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - daysAgo);

    activities.push({
      id: `mock_${messageType.type}_${i}_${entityId}`,
      type: messageType.type,
      title: messageType.title,
      description: messageDesc,
      timestamp: timestamp.toISOString(),
      author: i % 2 === 0 ? 'Sarah Johnson' : 'Mike Chen',
      authorId: `user_${i}`,
      leadName: entityName,
      leadId: entityId,
      icon: messageType.icon,
      color: messageType.color,
      metadata: {},
    });
  }

  for (let i = 0; i < 4; i++) {
    const activityType = mockActivities[i % mockActivities.length];
    const activityDesc =
      activityType.descriptions[i % activityType.descriptions.length];
    const daysAgo = i * 3 + 2;
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - daysAgo);

    activities.push({
      id: `mock_${activityType.type}_${i}_${entityId}`,
      type: activityType.type,
      title: activityType.title,
      description: activityDesc,
      timestamp: timestamp.toISOString(),
      author: i % 2 === 0 ? 'Sarah Johnson' : 'Mike Chen',
      authorId: `user_${i}`,
      leadName: entityName,
      leadId: entityId,
      icon: activityType.icon,
      color: activityType.color,
      metadata: {},
    });
  }

  return activities.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const generateMockNotes = (
  entityId: string,
  authorId: string = 'mock_user_1',
  authorName: string = 'You'
): MockNote[] => {
  const notes: MockNote[] = [];
  const now = new Date();

  const noteContents = [
    'Great initial conversation. Candidate shows strong technical skills and cultural fit. Follow up next week to discuss next steps.',
    'Interested in remote work arrangements. Salary expectations align with our budget. Schedule technical interview.',
    'Quick response time and very engaged. Mentioned interest in our tech stack. Good potential for this role.',
    'Had a productive call today. Discussed project requirements and timeline. Candidate seems like a good match.',
    'Strong portfolio and relevant experience. Worth pursuing further. Plan to send follow-up email with next steps.',
    'Initial screening completed successfully. Positive feedback from both sides. Moving forward with next phase.',
  ];

  for (let i = 0; i < 4; i++) {
    const daysAgo = i * 2;
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - daysAgo);

    const authors = [
      { id: 'mock_user_1', name: 'You' },
      { id: 'mock_user_2', name: 'Sarah Johnson' },
      { id: 'mock_user_3', name: 'Mike Chen' },
    ];
    const author = authors[i % authors.length];

    notes.push({
      id: `mock_note_${i}_${entityId}`,
      content: noteContents[i % noteContents.length],
      author_id: author.id,
      author_name: author.name,
      created_at: timestamp.toISOString(),
      updated_at: i === 0 ? timestamp.toISOString() : undefined,
    });
  }

  return notes.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export interface MockCompanyNote {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  entity_id: string;
  company_name: string;
}

export interface MockRecentActivity {
  id: string;
  type: 'email' | 'note' | 'meeting' | 'call' | 'interaction';
  entity_type: 'company' | 'person' | 'job';
  entity_name: string;
  entity_id: string;
  description: string;
  timestamp: string;
  user_name?: string;
}

export const generateMockCompanyNotes = (): MockCompanyNote[] => {
  const notes: MockCompanyNote[] = [];
  const now = new Date();

  const companies = [
    'Acme Corp',
    'TechStart Inc',
    'Digital Solutions',
    'Innovate Labs',
    'Global Systems',
  ];

  const authors = [
    { id: 'mock_user_1', name: 'You' },
    { id: 'mock_user_2', name: 'Sarah Johnson' },
    { id: 'mock_user_3', name: 'Mike Chen' },
  ];

  const noteTemplates = [
    'Great initial conversation. Company shows strong potential for partnership.',
    'Interested in our services. Follow up next week to discuss pricing.',
    'Strong technical team and good cultural fit. Moving forward with proposal.',
    'Requested more information about our platform. Sent detailed case studies.',
    'Initial meeting scheduled. They seem very engaged and interested.',
    'Company is expanding and looking for new solutions. Good timing.',
    'Decision maker is very responsive. High priority lead.',
    'Technical requirements align well with our capabilities.',
  ];

  let noteId = 1;
  companies.forEach((company, companyIndex) => {
    const companyId = `company_${companyIndex + 1}`;
    const notesPerCompany = 2 + Math.floor(Math.random() * 3); // 2-4 notes per company

    for (let i = 0; i < notesPerCompany; i++) {
      const daysAgo = noteId * 2 + Math.floor(Math.random() * 3);
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - daysAgo);

      const author = authors[noteId % authors.length];

      notes.push({
        id: `mock_company_note_${noteId}`,
        content: noteTemplates[noteId % noteTemplates.length],
        author_id: author.id,
        author_name: author.name,
        created_at: timestamp.toISOString(),
        entity_id: companyId,
        company_name: company,
      });

      noteId++;
    }
  });

  return notes.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const generateMockRecentActivity = (): MockRecentActivity[] => {
  const activities: MockRecentActivity[] = [];
  const now = new Date();

  const entities = [
    { type: 'company' as const, name: 'Acme Corp', id: 'company_1' },
    { type: 'company' as const, name: 'TechStart Inc', id: 'company_2' },
    { type: 'person' as const, name: 'John Smith', id: 'person_1' },
    { type: 'person' as const, name: 'Emma Wilson', id: 'person_2' },
    { type: 'company' as const, name: 'Digital Solutions', id: 'company_3' },
    { type: 'person' as const, name: 'Michael Brown', id: 'person_3' },
    { type: 'job' as const, name: 'Senior Developer', id: 'job_1' },
    { type: 'company' as const, name: 'Innovate Labs', id: 'company_4' },
  ];

  const activityTypes: Array<{
    type: MockRecentActivity['type'];
    descriptions: string[];
  }> = [
    {
      type: 'email',
      descriptions: [
        'Sent introductory email with company overview',
        'Followed up on previous conversation',
        'Shared relevant case studies',
        'Responded to questions about pricing',
      ],
    },
    {
      type: 'note',
      descriptions: [
        'Great candidate with strong React experience',
        'Interested in remote work arrangements',
        'Quick response time, very engaged',
        'Strong portfolio and relevant experience',
      ],
    },
    {
      type: 'meeting',
      descriptions: [
        'Scheduled interview for next Tuesday',
        'Calendar invite sent for follow-up meeting',
        'Team sync meeting arranged',
        'Demo session completed successfully',
      ],
    },
    {
      type: 'call',
      descriptions: [
        'Initial screening call completed',
        'Follow-up call to discuss details',
        'Quick check-in call to confirm interest',
        'Technical discussion call scheduled',
      ],
    },
    {
      type: 'interaction',
      descriptions: [
        'LinkedIn connection request sent',
        'Profile viewed and analyzed',
        'Status updated in CRM',
        'Tagged for follow-up',
      ],
    },
  ];

  for (let i = 0; i < 20; i++) {
    const entity = entities[i % entities.length];
    const activityType =
      activityTypes[i % activityTypes.length];
    const descriptions = activityType.descriptions;
    const description = descriptions[i % descriptions.length];

    const hoursAgo = i * 3 + Math.floor(Math.random() * 5);
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - hoursAgo);

    activities.push({
      id: `mock_activity_${i}`,
      type: activityType.type,
      entity_type: entity.type,
      entity_name: entity.name,
      entity_id: entity.id,
      description,
      timestamp: timestamp.toISOString(),
      user_name: i % 2 === 0 ? 'You' : 'Sarah Johnson',
    });
  }

  return activities.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export interface MockNotification {
  id: string;
  user_id: string;
  type: 'new_jobs_discovered' | 'email_response_received' | 'meeting_reminder' | 'follow_up_reminder' | 'company_enriched';
  priority: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  action_type: 'navigate' | 'none' | null;
  action_url: string | null;
  action_entity_type: 'job' | 'person' | 'company' | 'campaign' | 'page' | null;
  action_entity_id: string | null;
  is_read: boolean;
  read_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const generateMockNotifications = (
  userId: string = 'mock_user_1'
): MockNotification[] => {
  const notifications: MockNotification[] = [];
  const now = new Date();

  const notificationTypes: Array<{
    type: MockNotification['type'];
    priority: MockNotification['priority'];
    titles: string[];
    messages: string[];
    action_urls: string[];
  }> = [
    {
      type: 'new_jobs_discovered',
      priority: 'high',
      titles: ['5 New Jobs Discovered', '12 New Jobs Discovered', '3 New Jobs Discovered'],
      messages: [
        '5 new jobs have been discovered and are ready for review.',
        '12 new jobs have been discovered and are ready for review.',
        '3 new jobs have been discovered and are ready for review.',
      ],
      action_urls: ['/jobs?status=new', '/jobs?status=new', '/jobs?status=new'],
    },
    {
      type: 'email_response_received',
      priority: 'high',
      titles: ['New Email Response', 'New Email Response', 'New Email Response'],
      messages: [
        'John Smith replied to your message',
        'Sarah Johnson replied to your message',
        'Mike Chen replied to your message',
      ],
      action_urls: ['/people/person_1', '/people/person_2', '/people/person_3'],
    },
    {
      type: 'meeting_reminder',
      priority: 'high',
      titles: ['Meeting Reminder', 'Meeting Reminder', 'Meeting Reminder'],
      messages: [
        'Meeting with Acme Corp in 1 hour',
        'Meeting with TechStart Inc tomorrow at 2 PM',
        'Meeting with Digital Solutions in 30 minutes',
      ],
      action_urls: ['/companies/company_1', '/companies/company_2', '/companies/company_3'],
    },
    {
      type: 'follow_up_reminder',
      priority: 'medium',
      titles: ['Follow-Up Reminder', 'Follow-Up Reminder'],
      messages: [
        '3 people need follow-up today',
        '5 people need follow-up today',
      ],
      action_urls: ['/people?stage=proceed&needs_followup=true', '/people?stage=proceed&needs_followup=true'],
    },
    {
      type: 'company_enriched',
      priority: 'high',
      titles: ['Company Enriched', 'Company Enriched'],
      messages: [
        'Acme Corp enriched. 3 decision makers found.',
        'TechStart Inc enriched successfully.',
      ],
      action_urls: ['/companies/company_1', '/companies/company_2'],
    },
  ];

  for (let i = 0; i < 15; i++) {
    const notificationType = notificationTypes[i % notificationTypes.length];
    const title = notificationType.titles[i % notificationType.titles.length];
    const message = notificationType.messages[i % notificationType.messages.length];
    const actionUrl = notificationType.action_urls[i % notificationType.action_urls.length];

    const hoursAgo = i * 2 + Math.floor(Math.random() * 5);
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - hoursAgo);

    const isRead = i > 5; // First 5 are unread
    const readAt = isRead
      ? new Date(timestamp.getTime() + 1000 * 60 * 30).toISOString()
      : null;

    notifications.push({
      id: `mock_notification_${i}`,
      user_id: userId,
      type: notificationType.type,
      priority: notificationType.priority,
      title,
      message,
      action_type: 'navigate',
      action_url: actionUrl,
      action_entity_type: actionUrl.includes('/companies')
        ? 'company'
        : actionUrl.includes('/people')
          ? 'person'
          : 'page',
      action_entity_id: actionUrl.includes('/companies')
        ? `company_${Math.floor(i / 3) + 1}`
        : actionUrl.includes('/people')
          ? `person_${Math.floor(i / 3) + 1}`
          : null,
      is_read: isRead,
      read_at: readAt,
      metadata: {},
      created_at: timestamp.toISOString(),
    });
  }

  return notifications.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const shouldUseMockData = (): boolean => {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
  );
};

// Dashboard Mock Data - matches database schema
export interface MockJob {
  id: string;
  title: string;
  qualification_status: string;
  created_at: string;
  companies?: {
    id: string;
    name: string;
    website?: string;
    head_office?: string;
    industry?: string;
    logo_url?: string;
  };
}

export interface MockEmailThread {
  id: string;
  gmail_thread_id: string;
  subject: string | null;
  last_message_at: string | null;
  is_read: boolean | null;
  person_id: string | null;
  participants: unknown;
}

export interface MockPerson {
  id: string;
  name: string;
  email_address?: string;
  company_id?: string;
  created_at: string;
}

export interface MockCompany {
  id: string;
  name: string;
  website?: string;
  head_office?: string;
  industry?: string;
  logo_url?: string;
  created_at: string;
}

export const generateMockJobs = (count: number = 10): MockJob[] => {
  const jobs: MockJob[] = [];
  const now = new Date();

  const jobTitles = [
    'Senior Software Engineer',
    'Product Manager',
    'Engineering Manager',
    'Senior Frontend Developer',
    'DevOps Engineer',
    'Full Stack Developer',
    'Technical Lead',
    'Senior Backend Engineer',
    'Solutions Architect',
    'Engineering Director',
    'VP of Engineering',
    'CTO',
  ];

  const companies = [
    { name: 'TechCorp Inc', industry: 'Technology', website: 'https://techcorp.com', head_office: 'San Francisco, CA' },
    { name: 'DataFlow Systems', industry: 'Data Analytics', website: 'https://dataflow.io', head_office: 'New York, NY' },
    { name: 'CloudScale Solutions', industry: 'Cloud Computing', website: 'https://cloudscale.com', head_office: 'Seattle, WA' },
    { name: 'AI Innovations', industry: 'Artificial Intelligence', website: 'https://aiinnovations.com', head_office: 'Boston, MA' },
    { name: 'SecureNet Technologies', industry: 'Cybersecurity', website: 'https://securenet.io', head_office: 'Austin, TX' },
    { name: 'FinTech Global', industry: 'Financial Technology', website: 'https://fintechglobal.com', head_office: 'London, UK' },
    { name: 'HealthTech Solutions', industry: 'Healthcare Technology', website: 'https://healthtech.com', head_office: 'Chicago, IL' },
    { name: 'E-Commerce Pro', industry: 'E-Commerce', website: 'https://ecommercepro.com', head_office: 'Los Angeles, CA' },
  ];

  for (let i = 0; i < count; i++) {
    const hoursAgo = i * 2 + Math.floor(Math.random() * 5);
    const createdDate = new Date(now);
    createdDate.setHours(createdDate.getHours() - hoursAgo);

    const company = companies[i % companies.length];
    const companyId = `company_${i + 1}`;

    jobs.push({
      id: `job_${i + 1}`,
      title: jobTitles[i % jobTitles.length],
      qualification_status: 'new',
      created_at: createdDate.toISOString(),
      companies: {
        id: companyId,
        name: company.name,
        website: company.website,
        head_office: company.head_office,
        industry: company.industry,
        logo_url: undefined,
      },
    });
  }

  return jobs.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const generateMockEmailThreads = (count: number = 10): MockEmailThread[] => {
  const threads: MockEmailThread[] = [];
  const now = new Date();

  const subjects = [
    'Re: Follow-up on our conversation',
    'Re: Job opportunity discussion',
    'Re: Thank you for your interest',
    'Re: Next steps in the process',
    'Re: Quick question about the role',
    'Re: Interview scheduling',
    'Re: Your application status',
    'Re: Opportunity to connect',
    'Re: Discussion about the position',
    'Re: Following up on our call',
  ];

  for (let i = 0; i < count; i++) {
    const hoursAgo = i * 3 + Math.floor(Math.random() * 8);
    const lastMessageDate = new Date(now);
    lastMessageDate.setHours(lastMessageDate.getHours() - hoursAgo);

    threads.push({
      id: `thread_${i + 1}`,
      gmail_thread_id: `gmail_thread_${i + 1}`,
      subject: subjects[i % subjects.length],
      last_message_at: lastMessageDate.toISOString(),
      is_read: false,
      person_id: `person_${i + 1}`,
      participants: [],
    });
  }

  return threads.sort(
    (a, b) =>
      new Date(b.last_message_at || 0).getTime() -
      new Date(a.last_message_at || 0).getTime()
  );
};

export const generateMockPeople = (count: number = 10): MockPerson[] => {
  const people: MockPerson[] = [];
  const now = new Date();

  const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda', 'James', 'Lisa'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const createdDate = new Date(now);
    createdDate.setDate(createdDate.getDate() - daysAgo);
    createdDate.setHours(0, 0, 0, 0);

    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

    people.push({
      id: `person_${i + 1}`,
      name,
      email_address: email,
      company_id: `company_${(i % 8) + 1}`,
      created_at: createdDate.toISOString(),
    });
  }

  return people;
};

export const generateMockCompanies = (count: number = 10): MockCompany[] => {
  const companies: MockCompany[] = [];
  const now = new Date();

  const companyNames = [
    'TechCorp Inc',
    'DataFlow Systems',
    'CloudScale Solutions',
    'AI Innovations',
    'SecureNet Technologies',
    'FinTech Global',
    'HealthTech Solutions',
    'E-Commerce Pro',
    'MobileFirst Apps',
    'Blockchain Ventures',
  ];

  const industries = [
    'Technology',
    'Data Analytics',
    'Cloud Computing',
    'Artificial Intelligence',
    'Cybersecurity',
    'Financial Technology',
    'Healthcare Technology',
    'E-Commerce',
    'Mobile Development',
    'Blockchain',
  ];

  const locations = [
    'San Francisco, CA',
    'New York, NY',
    'Seattle, WA',
    'Boston, MA',
    'Austin, TX',
    'London, UK',
    'Chicago, IL',
    'Los Angeles, CA',
    'Denver, CO',
    'Toronto, ON',
  ];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const createdDate = new Date(now);
    createdDate.setDate(createdDate.getDate() - daysAgo);
    createdDate.setHours(0, 0, 0, 0);

    const name = companyNames[i % companyNames.length];
    const domain = name.toLowerCase().replace(/\s+/g, '').replace(/inc|systems|solutions|technologies|global|ventures|apps/gi, '');
    const website = `https://${domain}.com`;

    companies.push({
      id: `company_${i + 1}`,
      name,
      website,
      head_office: locations[i % locations.length],
      industry: industries[i % industries.length],
      logo_url: undefined,
      created_at: createdDate.toISOString(),
    });
  }

  return companies;
};

