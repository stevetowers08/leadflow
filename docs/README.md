# Empowr CRM Documentation

**14 essential documentation files** organized by topic.

## 📋 Quick Index

**[MASTER_INDEX.md](./MASTER_INDEX.md)** - Complete navigation to all docs

## 📖 Documentation

### Core (2 files)

- [APP_OVERVIEW.md](./CORE/APP_OVERVIEW.md) - Business model, architecture
- [DEVELOPMENT_GUIDE.md](./CORE/DEVELOPMENT_GUIDE.md) - Setup, coding standards

### Setup (3 files)

- [ENVIRONMENT_VARIABLES.md](./SETUP/ENVIRONMENT_VARIABLES.md) - Configuration
- [DEPLOYMENT_GUIDE.md](./SETUP/DEPLOYMENT_GUIDE.md) - Deployment
- [GMAIL_REPLY_DETECTION_SETUP.md](./SETUP/GMAIL_REPLY_DETECTION_SETUP.md) - Gmail setup

### Database (2 files)

- [DATABASE_BEST_PRACTICES.md](./DATABASE/DATABASE_BEST_PRACTICES.md) - Query patterns
- [DATABASE_SCHEMA.md](./DATABASE/DATABASE_SCHEMA.md) - Schema reference

### Integration & AI (2 files)

- [INTEGRATIONS_GUIDE.md](./INTEGRATIONS/INTEGRATIONS_GUIDE.md) - All integrations
- [AI_INTEGRATION_GUIDE.md](./AI/AI_INTEGRATION_GUIDE.md) - AI setup

### Style & Debug (2 files)

- [DESIGN_SYSTEM.md](./STYLING/DESIGN_SYSTEM.md) - UI/UX guidelines
- [TROUBLESHOOTING_GUIDE.md](./DEBUGGING/TROUBLESHOOTING_GUIDE.md) - Common issues

### Security (1 file)

- [SEMGREP_SECURITY_AUDIT.md](./SECURITY/SEMGREP_SECURITY_AUDIT.md) - Security audit

## 🚀 Common Tasks

**New developer?**

1. Read [APP_OVERVIEW.md](./CORE/APP_OVERVIEW.md)
2. Read [DEVELOPMENT_GUIDE.md](./CORE/DEVELOPMENT_GUIDE.md)
3. Configure [ENVIRONMENT_VARIABLES.md](./SETUP/ENVIRONMENT_VARIABLES.md)

**Database reference:**

```bash
npm run db:schema              # Show all tables
npm run db:schema people       # Show people table
npm run db:schema companies name  # Show specific field
```

---

**Last Updated**: January 2025  
**Files**: 14 essential + archive
