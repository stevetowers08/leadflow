# Empowr CRM Documentation

**Last Updated:** January 2025  
**Status:** Production Ready

## 📚 Documentation Overview

This documentation follows a purpose-driven structure (Diátaxis framework) organized by what you need to accomplish:

- **01-overview/** - Understanding the product and system
- **02-architecture/** - System design and decisions
- **03-development/** - Setting up and developing
- **04-guides/** - Step-by-step tutorials and how-tos
- **05-explanations/** - Deep dives into concepts
- **06-reference/** - Quick lookup for developers
- **07-operations/** - Runbooks and operational procedures
- **08-migrations/** - Migration guides and changelogs

---

## 🚀 Quick Start

**New to the project?**

1. Read [Product Overview](01-overview/product-overview.md)
2. Read [Status Campaigns](01-overview/status-campaigns.md)
3. Follow [Environment Setup](03-development/environment-setup.md)
4. Review [Development Guide](03-development/local-development.md)

**Setting up locally?**

→ [Environment Setup](03-development/environment-setup.md)

**Deploying to production?**

→ [Deployment Guide](07-operations/runbooks/deploy.md)

**Working on a feature?**

→ [Development Guide](03-development/local-development.md) + [Coding Standards](03-development/coding-standards.md)

**Understanding the database?**

→ [Database Schema](06-reference/database/schema.md) + [Database Best Practices](06-reference/database/queries.md)

---

## 📖 Documentation Index

### 01 Overview

- [Product Overview](01-overview/product-overview.md) - What Empowr CRM is, business model, key features
- [Status Campaigns](01-overview/status-campaigns.md) - Job and People status enums and workflows
- [Architecture Overview](01-overview/architecture-overview.md) - High-level system design
- [Project Structure](01-overview/project-structure.md) - Repository layout and organization

### 02 Architecture

- [Data Model](02-architecture/data-model.md) - Database structure and relationships
- [RLS Policies](02-architecture/rls-policies.md) - Row Level Security strategy
- [Services & APIs](02-architecture/services-and-apis.md) - API routes and service layer patterns
- [Design Decisions](02-architecture/design-decisions/) - Architecture Decision Records (ADRs)

### 03 Development

- [Environment Setup](03-development/environment-setup.md) - Configuration and prerequisites
- [Local Development](03-development/local-development.md) - Running locally, scripts, workflow
- [Coding Standards](03-development/coding-standards.md) - TypeScript, React, naming conventions
- [Workflows](03-development/workflows.md) - Common development tasks and commands

### 04 Guides

**Tutorials** (Step-by-step learning):
- [Getting Started](04-guides/tutorials/getting-started.md) - First-time setup walkthrough

**How-To** (Task-focused):
- [Migrate Edge Functions to API Routes](04-guides/how-to/migrate-edge-to-api.md)
- [Integrate Gmail Reply Detection](04-guides/how-to/integrate-gmail-replies.md)

### 05 Explanations

- [Performance Strategy](05-explanations/performance-strategy.md) - Optimization approaches
- [Multi-Tenant Strategy](05-explanations/multi-tenant-strategy.md) - Tenant isolation and RLS
- [AI Integration Approach](05-explanations/ai-integration-approach.md) - Gemini AI usage patterns

### 06 Reference

**Database:**
- [Schema Reference](06-reference/database/schema.md) - Complete database schema
- [Query Patterns](06-reference/database/queries.md) - Common query patterns and utilities

**Frontend:**
- [Next.js Configuration](06-reference/frontend/nextjs-config.md) - Next.js settings
- [Routing Reference](06-reference/frontend/routing-reference.md) - App Router patterns

**Backend:**
- [API Routes](06-reference/backend/api-routes.md) - Available API endpoints
- [Supabase Client Usage](06-reference/backend/supabase-client-usage.md) - Client setup and patterns

**Design System:**
- [Components](06-reference/design-system/components.md) - UI component library

**Integrations:**
- [Gmail Integration](06-reference/integrations/gmail.md)
- [n8n Integration](06-reference/integrations/n8n.md)

**Security:**
- [Security Audits](06-reference/security/security-audits.md) - Semgrep findings
- [Secrets Management](06-reference/security/secrets-management.md) - Environment variables

### 07 Operations

**Runbooks:**
- [Deployment](07-operations/runbooks/deploy.md) - Production deployment process
- [Rollback](07-operations/runbooks/rollback.md) - Rolling back deployments
- [Incident Response](07-operations/runbooks/incident-response.md) - Troubleshooting common issues

**Playbooks:**
- [Email Deliverability](07-operations/playbooks/email-deliverability.md)
- [Database Maintenance](07-operations/playbooks/db-maintenance.md)

### 08 Migrations

- [Migration Guides](08-migrations/migration-guides.md) - Breaking changes and upgrade paths
- [Edge Functions → API Routes](08-migrations/edge-functions-to-api-routes.md) - Migration completed

---

## 🗄️ Archived Documentation

Historical documentation has been moved to `90-archive/`:

- `90-archive/legacy-pdr/` - Old Product Design Records
- `90-archive/2024/` - 2024 documentation
- `90-archive/2025/` - 2025 archived docs

---

## 📝 Documentation Standards

### Front Matter Template

Each documentation file should include:

```yaml
---
owner: [team/person]
last-reviewed: YYYY-MM-DD
status: draft | final
product-area: [core | features | infrastructure]
---
```

### Update Frequency

- **Core docs** (01-02): Review quarterly
- **Development docs** (03-04): Update with code changes
- **Reference docs** (06): Update with API changes
- **Operations docs** (07): Update after incidents

---

## 🔍 Finding Information

**I want to...**

- **Understand the product** → Start with [01-overview/](01-overview/)
- **Set up development environment** → [03-development/environment-setup.md](03-development/environment-setup.md)
- **Deploy to production** → [07-operations/runbooks/deploy.md](07-operations/runbooks/deploy.md)
- **Look up API details** → [06-reference/backend/api-routes.md](06-reference/backend/api-routes.md)
- **Understand a decision** → [02-architecture/design-decisions/](02-architecture/design-decisions/)
- **Troubleshoot an issue** → [07-operations/runbooks/incident-response.md](07-operations/runbooks/incident-response.md)

---

## 📞 Getting Help

- **Code questions**: Check [06-reference/](06-reference/)
- **Setup issues**: See [03-development/](03-development/)
- **Deployment problems**: Review [07-operations/runbooks/](07-operations/runbooks/)
- **Architecture questions**: Read [02-architecture/](02-architecture/)

---

**Last Updated:** January 2025  
**Maintained By:** Development Team  
**Feedback:** Open an issue or submit a PR

