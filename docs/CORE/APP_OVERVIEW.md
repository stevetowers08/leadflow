# RECRUITEDGE - Complete Application Overview

## Table of Contents

- [Business Model](#business-model)
- [Core Entities](#core-entities)
- [Application Architecture](#application-architecture)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [User Roles & Permissions](#user-roles--permissions)
- [Automation Workflow](#automation-workflow)

## Business Model

RECRUITEDGE is a recruitment-focused customer relationship management system designed to streamline the process of finding, contacting, and converting companies into clients for recruitment services.

### Business Flow

```
Jobs → Companies → People → Automation → Responses → Deals
```

1. **Jobs** help us identify **Companies** that are hiring
2. **Companies** are added to our sales pipeline
3. **People** at those companies are identified as contacts
4. **Automation** tools handle outreach
5. **Responses** from people indicate interest level
6. **Deals** are closed with interested companies

## Core Entities

### 1. **Jobs**

- **Definition**: Job postings that help us identify companies that are hiring
- **Purpose**: These are the signals that indicate a company has open positions and may need recruitment services
- **Data Source**: Job boards, company websites, job postings
- **Key Fields**: `title`, `company_id`, `priority`, `function`, `location`, `employment_type`, `seniority`

### 2. **Companies**

- **Definition**: Organizations that we're trying to sign as clients
- **Purpose**: These are our target prospects - companies that have job openings and may need recruitment services
- **Data Source**: Company databases, company pages, job postings
- **Key Fields**: `name`, `industry`, `pipeline_stage`, `automation_active`, `logo_url`
- **Pipeline Stages**: `new_lead` → `message_sent` → `replied` → `meeting_scheduled` → `proposal_sent` → `negotiation` → `closed_won`/`closed_lost` → `on_hold`

### 3. **People**

- **Definition**: Individual contacts at companies who we interact with to close deals
- **Purpose**: These are the decision-makers and influencers we message to secure company contracts
- **Data Source**: Professional profiles, company directories, referrals
- **Key Fields**: `name`, `company_id`, `people_stage`, `lead_score`, `automation_started_at`, `reply_type`
- **Conversation Stages**: `new_lead` → `message_sent` → `replied` → `interested` → `meeting_scheduled` → `meeting_completed` → `follow_up` → `not_interested`

## Application Architecture

### Frontend Architecture

- **Framework**: React 18.2.0 with TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: React Query for server state, React hooks for local state
- **Routing**: React Router for navigation
- **Charts**: Recharts for data visualization
- **Drag & Drop**: dnd-kit for pipeline management

### Backend Architecture

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Real-time**: Supabase real-time subscriptions
- **Storage**: Supabase Storage for file uploads
- **API**: Supabase REST API with Row Level Security (RLS)

### Design System

- **Design Tokens**: Centralized design decisions
- **Components**: Reusable UI components with consistent styling
- **Typography**: Hierarchical text styling
- **Colors**: Primary, secondary, success, warning, muted color palette
- **Spacing**: Consistent padding and margin system
- **Shadows**: Layered shadow system for depth

## Key Features

### 1. **Onboarding Dashboard**

- **Step-by-Step Setup Flow**: Guided 5-step onboarding process
- **Integration Management**: Connect Gmail, CRM, and automation tools
- **Progress Tracking**: Visual progress bar and completion status
- **Learning Guides**: Comprehensive guides with difficulty levels and time estimates
- **Quick Actions**: Direct access to main platform features
- **Help & Support**: Documentation and support access

### 2. **Lead Management**

- Track people through conversation stages
- AI-powered lead scoring
- Automated outreach via Expandi/Prosp
- Response tracking and categorization
- Reply analytics and intent detection

### 3. **Company Management**

- Company pipeline with drag-and-drop stages
- Industry/function-based analytics
- Automation status tracking
- Logo management system
- Business pipeline progression tracking

### 4. **Job Intelligence**

- Job posting tracking and analysis
- Priority-based organization
- Function and location analytics
- Company-job relationship mapping
- Automated job qualification workflow

### 5. **Pipeline Management**

- Visual drag-and-drop pipeline
- Stage-based workflow management
- Velocity tracking and analytics
- User performance metrics
- Conversation stage progression

### 6. **Campaign Management**

- Email sequence builder with drag-and-drop steps
- Variable personalization system ({{first_name}}, {{company}})
- Campaign execution and tracking
- A/B testing and optimization
- Automated follow-up sequences

### 7. **AI Integration**

- Lead scoring algorithm
- Automated response categorization
- Smart recommendations
- Conversation analysis
- Intent detection and classification

### 8. **Analytics & Reporting**

- Comprehensive dashboard with multiple tabs
- Reply analytics and intent tracking
- Performance metrics and KPIs
- Stage-wise analytics
- Trend analysis and reporting
- Real-time data visualization

### 9. **Integration Management**

- **Gmail Integration**: Email automation and reply tracking
- **n8n Workflows**: Backend automation and data processing
- **CRM Configuration**: Settings and user permissions
- **Automation Tools**: Expandi/Prosp integration

## Technology Stack

### Core Technologies

- **React 18.2.0**: Frontend framework
- **TypeScript**: Type safety and development experience
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives

### Data & State Management

- **Supabase**: Backend-as-a-Service (PostgreSQL, Auth, Storage, Real-time)
- **React Query**: Server state management and caching
- **Zustand**: Lightweight state management (where needed)

### UI & Visualization

- **Recharts**: Data visualization and charting
- **Lucide React**: Icon library (2025 best practices)
- **Modern Card Design System**: Glassmorphism, subtle gradients, minimal design
- **dnd-kit**: Drag and drop functionality
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Vite**: Fast development and building

## Database Schema

### Core Tables

#### `people` (Leads/Contacts)

```sql
- id: uuid (primary key)
- name: text
- company_id: uuid (foreign key to companies)
- people_stage: text (conversation stage: new_lead, message_sent, replied, interested, meeting_scheduled, meeting_completed, follow_up, not_interested)
- lead_score: integer (AI-generated score)
- automation_started_at: timestamp
- connected_at: timestamp
- last_reply_at: timestamp
- reply_type: text (interested, not_interested, maybe)
- linkedin_url: text
- created_at: timestamp
- updated_at: timestamp
```

#### `companies` (Client Prospects)

```sql
- id: uuid (primary key)
- name: text
- industry: text (represents function/department)
- pipeline_stage: text (business pipeline stage: new_lead, message_sent, replied, meeting_scheduled, proposal_sent, negotiation, closed_won, closed_lost, on_hold)
- automation_active: boolean
- logo_url: text
- linkedin_url: text
- created_at: timestamp
- updated_at: timestamp
```

#### `jobs` (Job Postings)

```sql
- id: uuid (primary key)
- title: text
- company_id: uuid (foreign key to companies)
- priority: text (high, medium, low)
- function: text (engineering, sales, marketing, etc.)
- location: text
- employment_type: text (full-time, part-time, contract)
- seniority: text (junior, mid, senior, executive)
- linkedin_url: text
- created_at: timestamp
- updated_at: timestamp
```

#### `interactions` (Activities)

```sql
- id: uuid (primary key)
- person_id: uuid (foreign key to people)
- type: text (connection_request, message, reply)
- content: text
- response_type: text (interested, not_interested, maybe)
- created_at: timestamp
```

#### `user_profiles` (Team Members)

```sql
- id: uuid (primary key)
- user_id: uuid (foreign key to auth.users)
- full_name: text
- role: text (admin, user, viewer)
- created_at: timestamp
- updated_at: timestamp
```

## User Roles & Permissions

### Role Hierarchy

1. **Owner**: Full system access, user management, settings
2. **Admin**: Full CRM access, limited user management
3. **User**: Standard CRM functionality, no admin features
4. **Viewer**: Read-only access to data and reports

### Permission Matrix

| Feature               | Owner | Admin | User | Viewer |
| --------------------- | ----- | ----- | ---- | ------ |
| Lead Management       | ✅    | ✅    | ✅   | 👁️     |
| Company Management    | ✅    | ✅    | ✅   | 👁️     |
| Job Management        | ✅    | ✅    | ✅   | 👁️     |
| Pipeline Management   | ✅    | ✅    | ✅   | 👁️     |
| Reporting & Analytics | ✅    | ✅    | ✅   | 👁️     |
| User Management       | ✅    | ⚠️    | ❌   | ❌     |
| System Settings       | ✅    | ❌    | ❌   | ❌     |
| Integration Setup     | ✅    | ✅    | ❌   | ❌     |

## Automation Workflow

### Pipeline Stages

#### People Pipeline (Conversation-Based)

- **New Lead**: Person identified as contact
- **Message Sent**: Initial outreach made
- **Replied**: Person responded to outreach
- **Interested**: Person shows interest in services
- **Meeting Scheduled**: Meeting booked with person
- **Meeting Completed**: Meeting held successfully
- **Follow-up**: Post-meeting follow-up phase
- **Not Interested**: Person declined or not pursuing

#### Company Pipeline (Business Pipeline)

- **New Lead**: Company identified as potential client
- **Message Sent**: Initial outreach made to company contacts
- **Replied**: Company responded to outreach
- **Meeting Scheduled**: Meeting booked with company
- **Proposal Sent**: Formal proposal delivered
- **Negotiation**: Active discussions on terms
- **Closed Won**: Successfully secured as client
- **Closed Lost**: Deal lost
- **On Hold**: Temporarily paused or delayed

### Metrics & KPIs

- **Response Rate**: Percentage of messages that received replies
- **Positive Response Rate**: Percentage of responses that were interested
- **Conversion Rate**: Percentage of leads that became clients
- **Pipeline Velocity**: Average time spent in each stage
- **Automation Success Rate**: Overall automation effectiveness

## File Structure

```
src/
├── components/          # Reusable UI components
│   ├── analytics/       # Reply analytics components
│   ├── campaigns/       # Campaign management components
│   ├── crm/            # CRM-specific components
│   ├── jobs/           # Job management components
│   ├── layout/         # Layout and navigation components
│   ├── mobile/         # Mobile-specific components
│   ├── popup/          # Popup/modal components
│   ├── shared/         # Reusable shared components
│   └── ui/             # Base UI components
├── pages/              # Main application pages
│   ├── OnboardingDashboard.tsx  # Getting started page
│   ├── Dashboard.tsx           # Main dashboard
│   ├── People.tsx              # Lead management
│   ├── Companies.tsx           # Company management
│   ├── Jobs.tsx                # Job intelligence
│   ├── Pipeline.tsx            # Pipeline management
│   ├── Campaigns.tsx           # Campaign management
│   └── Reporting.tsx           # Analytics & reporting
├── services/           # API and business logic
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── design-system/      # Design tokens and components
└── assets/             # Static assets

docs/
├── CORE/               # Core application documentation
├── INTEGRATIONS/       # Integration guides
├── DATABASE/           # Database documentation
├── PDR/                # Product Requirements Documents
└── SETUP/              # Setup and deployment guides
```

## Application Status

**Current Status**: ✅ **STABLE** - All critical issues resolved  
**Last Updated**: December 2024  
**Version**: 1.0.0

### Recent Implementations (December 2024)

- ✅ **Onboarding Dashboard**: Complete step-by-step setup flow with integration management
- ✅ **Reply Analytics System**: Comprehensive analytics for reply tracking and intent detection
- ✅ **Stage Workflow Updates**: New conversation-based people stages and business pipeline stages
- ✅ **Navigation Integration**: Onboarding dashboard integrated into all navigation components
- ✅ **Progress Tracking**: Visual progress indicators and completion status
- ✅ **Learning Guides**: Comprehensive guides with difficulty levels and time estimates

### Previous Resolutions (January 2025)

- ✅ **Application Stability**: All app crashes resolved
- ✅ **Navigation System**: TopNavigation component working properly
- ✅ **React Hook Violations**: All hook violations fixed
- ✅ **Error Boundaries**: Comprehensive error handling implemented
- ✅ **Linear Integration**: Project management setup complete
- ✅ **Code Quality**: Clean linting, no errors

## Getting Started

1. **Prerequisites**: Node.js 18+, npm/yarn, Supabase account
2. **Installation**: Clone repo, install dependencies
3. **Environment**: Set up environment variables
4. **Database**: Configure Supabase database and RLS policies
5. **Development**: Run development server (`npm run dev` - runs on port 8082)
6. **Onboarding**: Access the Getting Started dashboard at `/onboarding` for guided setup
7. **Deployment**: Deploy to Vercel or similar platform

For detailed setup instructions, see [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md).

## Support & Maintenance

- **Documentation**: Comprehensive guides in `/docs` folder
- **Issue Tracking**: Linear project management (Empowr CRM project)
- **Code Review**: All changes require review and testing
- **Deployment**: Automated deployment via Vercel
- **Monitoring**: Error tracking and performance monitoring
- **Backup**: Automated database backups via Supabase

---

_Last Updated: January 2025_
_Version: 1.0.0_
_Status: ✅ Stable - All critical issues resolved_
