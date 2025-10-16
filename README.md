# Empowr CRM

A comprehensive AI-powered recruitment platform built with React, TypeScript, and Supabase.

## 📍 Repository

**GitHub**: [https://github.com/stevetowers08/empowr-crm](https://github.com/stevetowers08/empowr-crm)

This is the main repository for the Empowr CRM project, containing the complete codebase, documentation, and deployment configurations.

## 🚀 Quick Start

1. **Environment Setup**: See [docs/SETUP/ENVIRONMENT_SETUP.md](docs/SETUP/ENVIRONMENT_SETUP.md)
2. **Deployment**: See [docs/DEPLOYMENT/VERCEL_DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT/VERCEL_DEPLOYMENT_GUIDE.md) ✅ **Successfully Deployed!**
3. **Security**: See [docs/SETUP/SECURITY_SETUP_GUIDE.md](docs/SETUP/SECURITY_SETUP_GUIDE.md)

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

- [LinkedIn Integration](docs/INTEGRATIONS/LINKEDIN_AUTH_SETUP.md)
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

- [LinkedIn Troubleshooting](docs/TROUBLESHOOTING/LINKEDIN_API_KEY_TROUBLESHOOTING.md)
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
- **Job Management** - Job posting and tracking
- **AI Integration** - AI-powered lead scoring and insights
- **Real-time Updates** - Live data synchronization
- **Mobile Responsive** - Touch accessibility support

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
