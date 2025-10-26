# RECRUITEDGE

A comprehensive AI-powered recruitment platform built with React, TypeScript, and Supabase.

## 📍 Repository

**GitHub**: [https://github.com/stevetowers08/recruitedge](https://github.com/stevetowers08/recruitedge)

This is the main repository for the RECRUITEDGE project, containing the complete codebase, documentation, and deployment configurations.

## 🚀 Quick Start

1. **Environment Setup**: See [docs/SETUP/ENVIRONMENT_SETUP.md](docs/SETUP/ENVIRONMENT_SETUP.md)
2. **Onboarding Dashboard**: Access `/onboarding` for guided setup flow ✅ **New Feature**
3. **Deployment**: See [docs/DEPLOYMENT/VERCEL_DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT/VERCEL_DEPLOYMENT_GUIDE.md) ✅ **Successfully Deployed!**
4. **Security**: See [docs/SETUP/SECURITY_SETUP_GUIDE.md](docs/SETUP/SECURITY_SETUP_GUIDE.md)

## 📚 Documentation

### 🛠️ Setup & Configuration

- [Environment Setup](docs/SETUP/ENVIRONMENT_SETUP.md)
- [Vercel Deployment Guide](docs/DEPLOYMENT/VERCEL_DEPLOYMENT_GUIDE.md) ✅ **Working Solution**
- [Security Setup](docs/SETUP/SECURITY_SETUP_GUIDE.md)
- [Owner Setup](docs/SETUP/OWNER_SETUP.md)

### 🗄️ Database & Development

- [Database Best Practices](docs/DATABASE_BEST_PRACTICES.md) 📚 **Central Source of Truth**
- [Database Schema Reference](src/types/databaseSchema.ts) 🔧 **TypeScript Definitions**
- [Query Utilities](src/utils/databaseQueries.ts) 🛠️ **Safe Query Helpers**

**Quick Database Reference:**

```bash
npm run db:schema              # Show all tables
npm run db:schema people       # Show people table fields
npm run db:schema companies name  # Show field type
```

### 🔌 Integrations

- [Gmail Integration](docs/INTEGRATIONS/GMAIL_INTEGRATION_SETUP.md)
- [Google OAuth](docs/INTEGRATIONS/GOOGLE_OAUTH_SETUP.md)
- [N8N Workflows](docs/INTEGRATIONS/N8N_INTEGRATION_GUIDE.md)
- [Conversations Setup](docs/INTEGRATIONS/CONVERSATIONS_SETUP_GUIDE.md)

### 🏗️ Architecture

- [Database Schema](docs/ARCHITECTURE/DATABASE_SCHEMA.md) - Complete database structure and querying guide
- [Company Logo System](docs/ARCHITECTURE/COMPANY_LOGO_SYSTEM.md)
- [Badge System](docs/ARCHITECTURE/BADGE_SYSTEM_ARCHITECTURE.md)
- [Scoring System](docs/ARCHITECTURE/SCORING_SYSTEM_DOCS.md)
- [Popup System](docs/ARCHITECTURE/POPUP_SYSTEM_DOCUMENTATION.md)
- [User Management](docs/ARCHITECTURE/USER_MANAGEMENT_PROCESS.md)

### 💻 Development

- [Project Rules](docs/DEVELOPMENT/PROJECT_RULES.md)
- [Testing Guide](docs/DEVELOPMENT/TESTING_GUIDE.md)
- [Accessibility Testing](docs/DEVELOPMENT/TOUCH_ACCESSIBILITY_TESTING_SUMMARY.md)

### 🔧 Troubleshooting

- [White Screen Issues](docs/TROUBLESHOOTING/WHITE_SCREEN_TROUBLESHOOTING.md)

## 📄 Project Files

- [LICENSE](LICENSE) - MIT License
- [CHANGELOG](CHANGELOG.md) - Version history and changes
- [SECURITY](SECURITY.md) - Security policy and reporting

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0, TypeScript, Vite (conservative build settings)
- **UI**: Radix UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **State Management**: React Query
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 📋 Features

- **Pipeline Management** - Lead tracking and status management
- **Company Management** - Company profiles with logo integration
- **Job Management** - Simplified qualification workflow (New → Qualify → Skip)
- **People Management** - Streamlined status workflow (New → Qualified → Proceed → Skip)
- **AI Integration** - AI-powered lead scoring and insights
- **Real-time Updates** - Live data synchronization
- **Mobile Responsive** - Touch accessibility support

## 🔄 Workflows

### Job Qualification Workflow

Simple 3-step process for qualifying job postings:

1. **New** - Newly discovered jobs
2. **Qualify** - Jobs that meet your criteria
3. **Skip** - Jobs to skip for now

### People Status Workflow

Streamlined 4-step process for managing leads:

1. **New** - New leads to review
2. **Qualified** - Leads that meet criteria
3. **Proceed** - Ready for CRM or email outreach
4. **Skip** - Not pursuing at this time

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📄 License

This project is proprietary software developed for 4Twenty.
