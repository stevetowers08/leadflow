# Empowr CRM Documentation

Welcome to the comprehensive documentation for Empowr CRM - a modern recruitment-focused customer relationship management system.

## 🚀 Quick Start

**📋 [Master Documentation Index](./MASTER_INDEX.md)** - Complete navigation to all 23 essential documentation files

## 📚 Documentation Overview

This documentation is organized into comprehensive guides that cover everything you need to know about Empowr CRM:

### 🏢 [App Overview](./CORE/APP_OVERVIEW.md)

**Complete application information, architecture, and business model**

- Business model and core entities (Jobs → Companies → People)
- Application architecture and technology stack
- Key features and functionality
- Database schema and user roles
- Automation workflow and metrics

### 🛠️ [Development Guide](./CORE/DEVELOPMENT_GUIDE.md)

**Development setup, best practices, and workflows**

- Quick start and environment setup
- Development workflow and code standards
- Testing guidelines and database management
- Deployment process and best practices
- Performance optimization and security

### 🔧 [Troubleshooting Guide](./DEBUGGING/TROUBLESHOOTING_GUIDE.md)

**Debugging, common issues, and solutions**

- Common issues (white screen, charts not displaying, drag & drop)
- Development issues (TypeScript errors, build errors, hot reload)
- Database issues (Supabase connection, query performance)
- Authentication and integration issues
- Performance and deployment troubleshooting

### 🎨 [Design System](./STYLING/DESIGN_SYSTEM.md)

**UI/UX guidelines, styling, and design standards**

- Design philosophy and principles
- Design tokens and typography system
- Color system and layout guidelines
- Component library and usage patterns
- Responsive design and accessibility

### 🔗 [Integrations Guide](./INTEGRATIONS/INTEGRATIONS_GUIDE.md)

**All external integrations and setup guides**

- Supabase integration (database, auth, real-time)
- Google OAuth and Gmail integration
- LinkedIn API integration
- Expandi/Prosp automation tools
- N8N workflows and error tracking

## 🚀 Quick Start

1. **New to the project?** Start with [App Overview](./CORE/APP_OVERVIEW.md) to understand the business model and architecture
2. **Setting up development?** Follow the [Development Guide](./CORE/DEVELOPMENT_GUIDE.md) for complete setup instructions
3. **Encountering issues?** Check the [Troubleshooting Guide](./DEBUGGING/TROUBLESHOOTING_GUIDE.md) for common solutions
4. **Working on UI?** Reference the [Design System](./STYLING/DESIGN_SYSTEM.md) for consistent styling
5. **Configuring integrations?** Use the [Integrations Guide](./INTEGRATIONS/INTEGRATIONS_GUIDE.md) for step-by-step setup

## 📋 Key Information

### Business Model

```
Jobs → Companies → People → Automation → Responses → Deals
```

### Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Charts**: Recharts for data visualization
- **Automation**: Expandi/Prosp for LinkedIn outreach

### Core Features

- **Lead Management**: Track people through pipeline stages
- **Company Management**: Manage client prospects and pipeline
- **Job Management**: Track job postings and analytics
- **Automation**: LinkedIn outreach via external tools
- **Reporting**: Comprehensive analytics with 5 dashboard tabs

### Environment Setup

```bash
# Quick setup
git clone <repository-url>
cd empowr-crm
npm install
cp .env.example .env.local
# Configure environment variables
npm run dev
```

## 🆘 Getting Help

### Common Issues (✅ RESOLVED)

- ✅ **White screen on load**: Fixed - Check environment variables and clear cache
- ✅ **Charts not displaying**: Fixed - Verify data structure and React keys
- ✅ **Authentication issues**: Fixed - Check Google OAuth and Supabase configuration
- ✅ **Database errors**: Fixed - Verify RLS policies and connection settings
- ✅ **App crashes**: RESOLVED - Application stability issues fixed
- ✅ **Navigation failures**: RESOLVED - TopNavigation component working properly
- ✅ **React Hook violations**: RESOLVED - All hook violations fixed

### Support Resources

- **Documentation**: Comprehensive guides in this `/docs` folder
- **Code Comments**: Inline documentation for complex logic
- **Error Messages**: Detailed error logging and tracking
- **Development Tools**: Built-in debugging and performance tools

## 📁 Documentation Structure

**📋 [Master Documentation Index](./MASTER_INDEX.md)** - Complete navigation to all 23 essential files

### Organized Documentation Structure

```
docs/
├── README.md                    # This overview (start here)
├── MASTER_INDEX.md             # Complete navigation index
├── CORE/                       # Core application documentation
│   ├── APP_OVERVIEW.md
│   ├── DEVELOPMENT_GUIDE.md
│   └── TERMINOLOGY.md
├── AI/                         # AI integration guides
│   ├── AI_INTEGRATION_GUIDE.md
│   └── AI_BEST_PRACTICES.md
├── COMPONENTS/                 # Component architecture
│   ├── LAYOUT_COMPONENTS.md
│   ├── POPUP_SYSTEM_DOCUMENTATION.md
│   ├── BADGE_SYSTEM_ARCHITECTURE.md
│   ├── SCORING_SYSTEM_DOCS.md
│   └── COMPANY_LOGO_SYSTEM.md
├── STYLING/                    # Design system and styling
│   ├── DESIGN_SYSTEM.md
│   ├── CARD_STYLING_GUIDE.md
│   └── UNIFIED_DESIGN_SYSTEM.md
├── DATABASE/                   # Database documentation
│   ├── DATABASE_SCHEMA.md
│   └── DATABASE_BEST_PRACTICES.md
├── SETUP/                      # Setup and deployment
│   ├── ENVIRONMENT_SETUP.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── ENVIRONMENT_VARIABLES.md
├── INTEGRATIONS/               # External integrations
│   └── INTEGRATIONS_GUIDE.md
├── TESTING/                    # Testing documentation
│   └── TESTING_PLAN.md
└── DEBUGGING/                  # Troubleshooting and debugging
    ├── TROUBLESHOOTING_GUIDE.md
    └── DEBUGGING_GUIDE.md
```

## 🔄 Documentation Updates

This documentation is actively maintained and updated with:

- New features and functionality
- Bug fixes and solutions
- Integration updates and changes
- Best practices and optimizations
- **Linear project management integration**
- **Resolved stability issues**

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: ✅ Stable - All critical issues resolved

---

_For specific technical questions or issues not covered in these guides, please check the inline code comments or create an issue in the project repository._
