# LeadFlow

LeadFlow is a web application for exhibition exhibitors to capture leads via business card photos, enrich them with AI research, and automatically follow up through customizable email workflows. The app syncs with HubSpot CRM and uses either Lemlist or Gmail for email automation, pausing when leads respond.

## Core Value

Transform exhibition leads into conversations by removing manual follow-up friction.

## Product Requirements

The complete Product Requirements Document (PDR) is available at [`docs/PDR`](docs/PDR). This document contains:

- Executive summary and design philosophy
- Complete app structure and navigation
- Detailed screen specifications
- Technical specifications (OCR, AI enrichment, workflow automation)
- Database schema and architecture
- Security and compliance requirements
- Development phases and success metrics
- Future enhancements roadmap

## Tech Stack

- **Framework:** Next.js 16.0.1 (App Router)
- **Language:** TypeScript 5.9
- **UI:** React 18.2, Radix UI, shadcn/ui, Tailwind CSS 3.4
- **Database:** Supabase (PostgreSQL with RLS)
- **State Management:** TanStack Query 5.90, React Context
- **AI:** Google Gemini AI for lead enrichment
- **Integrations:** HubSpot CRM, Gmail API, Lemlist API

## Getting Started

### Prerequisites

- Node.js >= 20.9.0
- npm or yarn
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local

# Run development server
npm run dev
```

The app will be available at `http://localhost:8086`

### Environment Variables

See `env.example` for required environment variables. Key variables include:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `GEMINI_API_KEY` - Google Gemini API key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-only)

## Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Database schema
npm run db:schema
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── (app)/       # Desktop application pages
│   ├── (mobile)/    # Mobile-specific pages
│   └── api/         # API routes
├── components/      # React components
├── services/        # API service layer
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript definitions
└── contexts/       # React Context providers
```

## Key Features

- 📸 **Business Card Capture** - Mobile-first camera interface with OCR
- 🤖 **AI Lead Enrichment** - Automatic company research and personalization
- 📧 **Email Workflows** - Automated sequences with Gmail or Lemlist
- 🔄 **CRM Integration** - Sync with HubSpot
- 📊 **Analytics Dashboard** - Track leads, responses, and performance
- ⚙️ **Settings & Integrations** - Configure email providers and preferences

## Documentation

- **Product Requirements:** [`docs/PDR`](docs/PDR)
- **Development Guide:** See `.cursor/rules/` for coding standards and architecture

## License

See [LICENSE](LICENSE) file for details.

