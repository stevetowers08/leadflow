# Empowr CRM - Complete Application Overview

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

Empowr CRM is a recruitment-focused customer relationship management system designed to streamline the process of finding, contacting, and converting companies into clients for recruitment services.

### Business Flow

```
Jobs → Companies → People → Automation → Responses → Deals
```

1. **Jobs** help us identify **Companies** that are hiring
2. **Companies** are added to our sales pipeline
3. **People** at those companies are identified as contacts
4. **Automation** tools (Expandi/Prosp) handle LinkedIn outreach
5. **Responses** from people indicate interest level
6. **Deals** are closed with interested companies

## Core Entities

### 1. **Jobs**

- **Definition**: Job postings that help us identify companies that are hiring
- **Purpose**: These are the signals that indicate a company has open positions and may need recruitment services
- **Data Source**: Job boards, company websites, LinkedIn job postings
- **Key Fields**: `title`, `company_id`, `priority`, `function`, `location`, `employment_type`, `seniority`

### 2. **Companies**

- **Definition**: Organizations that we're trying to sign as clients
- **Purpose**: These are our target prospects - companies that have job openings and may need recruitment services
- **Data Source**: Company databases, LinkedIn company pages, job postings
- **Key Fields**: `name`, `industry`, `stage`, `automation_active`, `logo_url`

### 3. **People**

- **Definition**: Individual contacts at companies who we interact with to close deals
- **Purpose**: These are the decision-makers and influencers we message to secure company contracts
- **Data Source**: LinkedIn profiles, company directories, referrals
- **Key Fields**: `name`, `company_id`, `stage`, `lead_score`, `automation_started_at`, `reply_type`

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

### 1. **Lead Management**

- Track people through pipeline stages
- AI-powered lead scoring
- Automated LinkedIn outreach via Expandi/Prosp
- Response tracking and categorization

### 2. **Company Management**

- Company pipeline with drag-and-drop stages
- Industry/function-based analytics
- Automation status tracking
- Logo management system

### 3. **Job Management**

- Job posting tracking and analysis
- Priority-based organization
- Function and location analytics
- Company-job relationship mapping

### 4. **Pipeline Management**

- Visual drag-and-drop pipeline
- Stage-based workflow management
- Velocity tracking and analytics
- User performance metrics

### 5. **AI Integration**

- Lead scoring algorithm
- Automated response categorization
- Smart recommendations
- Conversation analysis

### 6. **Reporting & Analytics**

- Comprehensive dashboard with 5 tabs:
  - **Overview**: Key metrics and daily trends
  - **Automation**: LinkedIn automation performance
  - **LinkedIn**: Detailed LinkedIn analytics
  - **Jobs**: Job tracking and analytics
  - **Companies**: Company pipeline metrics
- Real-time data visualization
- Exportable reports and insights

### 7. **Automation Integration**

- **Expandi**: LinkedIn automation for connection requests and messaging
- **Prosp**: LinkedIn automation for prospecting and outreach
- Response tracking and analysis
- Performance metrics and optimization

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
- stage: text (pipeline stage)
- lead_score: integer (AI-generated score)
- automation_started_at: timestamp
- connected_at: timestamp
- last_reply_at: timestamp
- reply_type: text (interested, not_interested, maybe)
- linkedin_connected: boolean
- linkedin_responded: boolean
- created_at: timestamp
- updated_at: timestamp
```

#### `companies` (Client Prospects)

```sql
- id: uuid (primary key)
- name: text
- industry: text (represents function/department)
- stage: text (sales pipeline stage)
- automation_active: boolean
- logo_url: text
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
- created_at: timestamp
- updated_at: timestamp
```

#### `interactions` (LinkedIn Activities)

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

### LinkedIn Automation Process

1. **Lead Identification**: People are identified and added to the system
2. **Automation Trigger**: Automation is started via Expandi or Prosp
3. **Connection Request**: Automated LinkedIn connection request sent
4. **Connection Acceptance**: Track if connection is accepted
5. **Message Sequence**: Automated message sequence begins
6. **Response Tracking**: Monitor and categorize responses
7. **Lead Qualification**: Qualify leads based on responses
8. **Handoff to Sales**: Qualified leads are handed off for direct sales contact

### Pipeline Stages

#### People Pipeline

- **New**: Person identified as contact
- **Connection Requested**: LinkedIn connection request sent
- **Connected**: LinkedIn connection accepted
- **Messaged**: Initial message sent
- **Replied**: Person responded to message
- **Lead Lost**: Person not interested
- **In Queue**: Waiting for next action

#### Company Pipeline

- **New**: Company identified as potential client
- **Contacted**: Initial outreach made
- **Qualified**: Company shows interest
- **Proposal**: Proposal sent
- **Negotiation**: Terms being discussed
- **Closed Won**: Contract signed
- **Closed Lost**: Opportunity lost

### Metrics & KPIs

- **Connection Rate**: Percentage of connection requests accepted
- **Response Rate**: Percentage of messages that received replies
- **Positive Response Rate**: Percentage of responses that were interested
- **Conversion Rate**: Percentage of leads that became clients
- **Pipeline Velocity**: Average time spent in each stage
- **Automation Success Rate**: Overall automation effectiveness

## File Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── services/           # API and business logic
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── design-system/      # Design tokens and components
└── assets/             # Static assets

docs/
├── APP_OVERVIEW.md     # This file
├── DEVELOPMENT_GUIDE.md # Development setup and practices
├── TROUBLESHOOTING_GUIDE.md # Debugging and solutions
├── DESIGN_SYSTEM.md    # UI/UX guidelines
└── INTEGRATIONS_GUIDE.md # External integrations
```

## Application Status

**Current Status**: ✅ **STABLE** - All critical issues resolved  
**Last Updated**: January 2025  
**Version**: 1.0.0

### Recent Resolutions (January 2025)

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
6. **Deployment**: Deploy to Vercel or similar platform

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
