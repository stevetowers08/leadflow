# 📚 Empowr CRM Documentation

**Essential Files**: 14  
**Status**: ✅ Clean & Minimal

## 📖 Core Documentation

### Getting Started

- **[APP_OVERVIEW.md](./CORE/APP_OVERVIEW.md)** - Business model, architecture, features
- **[DEVELOPMENT_GUIDE.md](./CORE/DEVELOPMENT_GUIDE.md)** - Setup, standards, workflows

### Setup & Deployment

- **[ENVIRONMENT_VARIABLES.md](./SETUP/ENVIRONMENT_VARIABLES.md)** - Required configuration
- **[DEPLOYMENT_GUIDE.md](./SETUP/DEPLOYMENT_GUIDE.md)** - Deployment instructions
- **[GMAIL_REPLY_DETECTION_SETUP.md](./SETUP/GMAIL_REPLY_DETECTION_SETUP.md)** - Gmail integration

### Database

- **[DATABASE_BEST_PRACTICES.md](./DATABASE/DATABASE_BEST_PRACTICES.md)** - Query patterns, RLS policies
- **[DATABASE_SCHEMA.md](./DATABASE/DATABASE_SCHEMA.md)** - Complete schema reference

```bash
# Quick database reference
npm run db:schema              # Show all tables
npm run db:schema people       # Show people table
npm run db:schema companies name  # Show specific field
```

### Integration & AI

- **[INTEGRATIONS_GUIDE.md](./INTEGRATIONS/INTEGRATIONS_GUIDE.md)** - All integrations
- **[AI_INTEGRATION_GUIDE.md](./AI/AI_INTEGRATION_GUIDE.md)** - AI implementation

### Styling & Debugging

- **[DESIGN_SYSTEM.md](./STYLING/DESIGN_SYSTEM.md)** - UI/UX guidelines
- **[TROUBLESHOOTING_GUIDE.md](./DEBUGGING/TROUBLESHOOTING_GUIDE.md)** - Common issues

### Security

- **[SEMGREP_SECURITY_AUDIT.md](./SECURITY/SEMGREP_SECURITY_AUDIT.md)** - Security audit

---

## 📁 Full Structure

```
docs/
├── README.md                    # Docs overview
├── MASTER_INDEX.md             # This file
│
├── CORE/                       # Essential app docs (2 files)
│   ├── APP_OVERVIEW.md
│   └── DEVELOPMENT_GUIDE.md
│
├── SETUP/                      # Configuration (3 files)
│   ├── ENVIRONMENT_VARIABLES.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── GMAIL_REPLY_DETECTION_SETUP.md
│
├── DATABASE/                   # Database (2 files)
│   ├── DATABASE_BEST_PRACTICES.md
│   └── DATABASE_SCHEMA.md
│
├── INTEGRATIONS/              # Integrations (1 file)
│   └── INTEGRATIONS_GUIDE.md
│
├── AI/                        # AI docs (1 file)
│   └── AI_INTEGRATION_GUIDE.md
│
├── DEBUGGING/                 # Debugging (1 file)
│   └── TROUBLESHOOTING_GUIDE.md
│
├── STYLING/                   # Design (1 file)
│   └── DESIGN_SYSTEM.md
│
├── SECURITY/                  # Security (1 file)
│   └── SEMGREP_SECURITY_AUDIT.md
│
└── archive/                   # Historical docs
    ├── PDR/                   # Product design records
    ├── IMPLEMENTATION/         # Past implementations
    ├── SPECIFICATIONS/        # Original specs
    └── *.md                   # Archived individual files
```

---

## 🚀 Quick Start

**New developer?**

1. Read `CORE/APP_OVERVIEW.md`
2. Read `CORE/DEVELOPMENT_GUIDE.md`
3. Configure `SETUP/ENVIRONMENT_VARIABLES.md`

**Setting up deployment?**  
→ `SETUP/DEPLOYMENT_GUIDE.md`

**Working on database?**  
→ `DATABASE/DATABASE_BEST_PRACTICES.md` + `DATABASE/DATABASE_SCHEMA.md`

**Adding a feature?**  
→ Check `STYLING/DESIGN_SYSTEM.md` + `CORE/DEVELOPMENT_GUIDE.md`

---

**Last Updated**: January 2025  
**Approach**: Minimal essential docs only
