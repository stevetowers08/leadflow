# 🚀 4Twenty CRM - B2B Lead Discovery & Outreach Management Platform

## Project Overview
- **Name**: 4Twenty CRM
- **Purpose**: B2B lead discovery and prospect management dashboard for outreach automation
- **Goal**: Help businesses discover potential client companies from job postings, identify decision makers, and track outreach activities via LinkedIn/email automation tools

## 🌟 Current Features

### ✅ **Core Functionality**
- **Dashboard** - Overview with key metrics and quick actions
- **Lead Management** - Track prospects through pipeline stages
- **Company Management** - Manage target companies and their information
- **Job Tracking** - Monitor job postings for lead discovery opportunities
- **Visual Pipeline** - Kanban-style opportunity management

### ✅ **Advanced Features (Recently Added)**

#### 📈 **Activity Timeline**
- **Visual timeline** showing all lead interactions
- **Automatic tracking** of LinkedIn connections, email exchanges, meetings
- **Timeline events**: Lead creation, connection requests, messages, responses
- **Date formatting** with relative time display

#### 👥 **Lead Assignment System**  
- **Team member management** with avatar display
- **Lead assignment** and ownership tracking
- **Performance metrics** by team member
- **Visual assignment indicators** throughout the UI

#### 📋 **Deal/Opportunity Pipeline**
- **Kanban board interface** with drag-and-drop-like functionality
- **Pipeline stages**: NEW LEAD → IN QUEUE → CONNECT SENT → MSG SENT → CONNECTED → REPLIED → LEAD LOST
- **Real-time stage updates** with dropdown controls
- **Pipeline analytics** with conversion rates and metrics
- **Owner assignments** visible on pipeline cards

#### 💬 **Notes & Comments System**
- **Rich notes section** for leads and companies  
- **Threaded comments** with timestamps
- **User avatars** and edit functionality
- **Local storage** with export capabilities

#### 📊 **Advanced Analytics & Reporting**
- **Comprehensive dashboard** with KPIs and metrics
- **Conversion rate tracking** and pipeline analysis
- **Team performance metrics** and leaderboards
- **Industry and stage distribution** charts
- **Time-based filtering** (7d, 30d, 90d)
- **Activity summaries** and trend analysis

#### 🔍 **Enhanced Search & Filtering**
- **Global search** across leads, companies, and jobs
- **Advanced filters** with multiple criteria
- **Real-time search results** with highlighting
- **Filter persistence** and quick date ranges
- **Multi-entity search** with type-based grouping

## 🔗 URLs & Access
- **Development**: https://8080-iel8oqvaaql96xtsxotlc-6532622b.e2b.dev
- **GitHub Repository**: https://github.com/stevetowers08/empowr-crm.git
- **Original Project**: https://lovable.dev/projects/1c51fd91-59e3-4818-9382-0845e113f866

## 🏗️ Data Architecture

### **Database Schema (Supabase)**
- **People Table**: Lead information, contact details, pipeline stages, assignments
- **Companies Table**: Company profiles, industry data, scoring, priorities  
- **Jobs Table**: Job postings, requirements, company associations

### **Key Data Models**
```typescript
// Lead/Person Entity
{
  Name, Company, Email, LinkedIn, Stage, Owner,
  "Lead Score", "Company Role", "Employee Location",
  "Last Contact Date", "Meeting Date", etc.
}

// Company Entity  
{
  "Company Name", Industry, Website, "Company Size", 
  "Head Office", "Lead Score", Priority, STATUS
}

// Job Entity
{
  "Job Title", Company, "Job Location", Industry,
  "Posted Date", "Valid Through", Priority
}
```

### **Storage Services**
- **Supabase PostgreSQL** - Primary database for all entities
- **Local Storage** - Notes/comments and UI preferences
- **Real-time subscriptions** - Live data updates

## 📱 User Guide

### **Getting Started**
1. **Dashboard** - View key metrics and recent activity
2. **Add Leads** - Import or manually add prospect information  
3. **Assign Ownership** - Distribute leads among team members
4. **Track Pipeline** - Move leads through outreach stages
5. **Monitor Analytics** - Review performance and conversion rates

### **Daily Workflow**
1. **Check Dashboard** - Review new leads and activities
2. **Pipeline Management** - Update lead stages based on outreach results
3. **Activity Tracking** - Log interactions and schedule follow-ups
4. **Notes Management** - Add context and collaboration notes
5. **Performance Review** - Analyze team metrics and conversion rates

### **Key Features Usage**
- **Global Search**: Use the search bar in sidebar for quick lead/company lookup
- **Pipeline View**: Access via Opportunities page for visual stage management
- **Team Assignment**: Click on leads to assign ownership and track performance
- **Activity Timeline**: View detailed interaction history in lead details
- **Analytics**: Visit Reporting page for comprehensive performance insights

## 🚀 Technical Stack

### **Frontend**
- **React 18** + **TypeScript** - Modern component-based UI
- **Vite** - Fast development and building
- **shadcn/ui** + **Radix UI** - Comprehensive UI component library  
- **Tailwind CSS** - Utility-first styling
- **TanStack Query** - Server state management
- **React Router** - Client-side routing

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time subscriptions
- **REST API** - Database operations and queries
- **Row Level Security** - Data access control

### **Development Tools**
- **ESLint** + **TypeScript** - Code quality and type safety
- **Date-fns** - Date formatting and manipulation
- **Lucide React** - Icon library

## 🔧 Development Setup

```bash
# Clone the repository
git clone https://github.com/stevetowers08/empowr-crm.git
cd empowr-crm

# Install dependencies  
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📈 Deployment Status
- ✅ **Frontend**: React SPA with modern tooling
- ✅ **Database**: Supabase PostgreSQL with real-time features
- ✅ **Hosting**: Ready for deployment to Vercel, Netlify, or similar platforms
- ✅ **Version Control**: Git repository with regular commits
- **Environment**: Development server running with hot reload

## 🎯 Use Cases

### **Primary Use Case: B2B Lead Discovery**
- **Job Monitoring**: Track job postings to identify companies with specific needs
- **Decision Maker Identification**: Find and profile key contacts at target companies
- **Outreach Management**: Coordinate LinkedIn and email automation campaigns
- **Pipeline Tracking**: Monitor lead progression through outreach stages

### **Team Collaboration**
- **Lead Assignment**: Distribute prospects among team members
- **Activity Sharing**: Track team interactions and progress
- **Performance Analytics**: Measure individual and team effectiveness
- **Knowledge Sharing**: Collaborative notes and company intelligence

## 🔮 Future Enhancements
- **Email Integration**: Direct email sending and tracking
- **LinkedIn Automation**: API integration for automated outreach
- **Advanced AI Scoring**: Machine learning for lead prioritization  
- **Custom Workflows**: Configurable automation rules
- **Advanced Reporting**: Custom dashboards and export capabilities

---

## Original Lovable Project Information

This project was initially created with Lovable and enhanced with advanced B2B CRM functionality.

**Original Project URL**: https://lovable.dev/projects/1c51fd91-59e3-4818-9382-0845e113f866

For the original development workflow, you can still use Lovable for visual editing, or work locally with your preferred IDE.

### Local Development
```sh
npm install
npm run dev
```

The application will be available at `http://localhost:8080` with hot reloading enabled.

**Last Updated**: September 24, 2025