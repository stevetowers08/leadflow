# Empowr CRM Documentation

Welcome to the comprehensive documentation for Empowr CRM - a modern recruitment-focused customer relationship management system.

## 📚 Documentation Overview

This documentation is organized into 5 comprehensive guides that cover everything you need to know about Empowr CRM:

### 🏢 [App Overview](./APP_OVERVIEW.md)
**Complete application information, architecture, and business model**
- Business model and core entities (Jobs → Companies → People)
- Application architecture and technology stack
- Key features and functionality
- Database schema and user roles
- Automation workflow and metrics

### 🛠️ [Development Guide](./DEVELOPMENT_GUIDE.md)
**Development setup, best practices, and workflows**
- Quick start and environment setup
- Development workflow and code standards
- Testing guidelines and database management
- Deployment process and best practices
- Performance optimization and security

### 🔧 [Troubleshooting Guide](./TROUBLESHOOTING_GUIDE.md)
**Debugging, common issues, and solutions**
- Common issues (white screen, charts not displaying, drag & drop)
- Development issues (TypeScript errors, build errors, hot reload)
- Database issues (Supabase connection, query performance)
- Authentication and integration issues
- Performance and deployment troubleshooting

### 🎨 [Design System](./DESIGN_SYSTEM.md)
**UI/UX guidelines, styling, and design standards**
- Design philosophy and principles
- Design tokens and typography system
- Color system and layout guidelines
- Component library and usage patterns
- Responsive design and accessibility

### 🔗 [Integrations Guide](./INTEGRATIONS_GUIDE.md)
**All external integrations and setup guides**
- Supabase integration (database, auth, real-time)
- Google OAuth and Gmail integration
- LinkedIn API integration
- Expandi/Prosp automation tools
- N8N workflows and error tracking

## 🚀 Quick Start

1. **New to the project?** Start with [App Overview](./APP_OVERVIEW.md) to understand the business model and architecture
2. **Setting up development?** Follow the [Development Guide](./DEVELOPMENT_GUIDE.md) for complete setup instructions
3. **Encountering issues?** Check the [Troubleshooting Guide](./TROUBLESHOOTING_GUIDE.md) for common solutions
4. **Working on UI?** Reference the [Design System](./DESIGN_SYSTEM.md) for consistent styling
5. **Configuring integrations?** Use the [Integrations Guide](./INTEGRATIONS_GUIDE.md) for step-by-step setup

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

### Common Issues
- **White screen on load**: Check environment variables and clear cache
- **Charts not displaying**: Verify data structure and React keys
- **Authentication issues**: Check Google OAuth and Supabase configuration
- **Database errors**: Verify RLS policies and connection settings

### Support Resources
- **Documentation**: Comprehensive guides in this `/docs` folder
- **Code Comments**: Inline documentation for complex logic
- **Error Messages**: Detailed error logging and tracking
- **Development Tools**: Built-in debugging and performance tools

## 📁 Documentation Structure

```
docs/
├── README.md                    # This overview (start here)
├── APP_OVERVIEW.md             # Complete app information
├── DEVELOPMENT_GUIDE.md        # Development setup and practices
├── TROUBLESHOOTING_GUIDE.md    # Debugging and solutions
├── DESIGN_SYSTEM.md            # UI/UX guidelines
├── INTEGRATIONS_GUIDE.md       # External integrations
└── TERMINOLOGY.md              # Business terminology reference
```

## 🔄 Documentation Updates

This documentation is actively maintained and updated with:
- New features and functionality
- Bug fixes and solutions
- Integration updates and changes
- Best practices and optimizations

**Last Updated**: October 2024  
**Version**: 1.0.0

---

*For specific technical questions or issues not covered in these guides, please check the inline code comments or create an issue in the project repository.*