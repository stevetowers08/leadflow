# Architecture

This directory contains detailed documentation about the system architecture and core components.

## 🏗️ System Components

- **[Company Logo System](COMPANY_LOGO_SYSTEM.md)** - Clearbit logo integration and fallback system
- **[Badge System](BADGE_SYSTEM_ARCHITECTURE.md)** - Status badges and visual indicators
- **[Scoring System](SCORING_SYSTEM_DOCS.md)** - AI-powered lead scoring algorithms
- **[Popup System](POPUP_SYSTEM_DOCUMENTATION.md)** - Contextual popup and modal system
- **[User Management](USER_MANAGEMENT_PROCESS.md)** - User roles, permissions, and management

## 🎯 Architecture Overview

The Empowr CRM is built with a modern, scalable architecture:

- **Frontend**: React 19 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React Query for server state
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth with JWT
- **Real-time**: Supabase subscriptions

## 🔄 Data Flow

1. **User Authentication** → Supabase Auth
2. **Data Fetching** → React Query + Supabase client
3. **Real-time Updates** → Supabase subscriptions
4. **UI Updates** → React state management
5. **External Integrations** → Supabase Edge Functions

## 📚 Related Documentation

- [Setup](../SETUP/) - Environment and deployment configuration
- [Integrations](../INTEGRATIONS/) - Third-party service integrations
- [Development](../DEVELOPMENT/) - Development standards and testing
