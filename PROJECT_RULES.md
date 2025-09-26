# 🎯 4Twenty CRM - Project Rules & Standards

## 📋 **Overview**
This document establishes comprehensive project rules based on the current codebase analysis, performance optimizations, security audits, and development patterns established in the 4Twenty CRM project.

---

## 🏗️ **Architecture & Code Organization**

### **File Structure Standards**
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── forms/           # Form-specific components
│   └── modals/          # Modal/popup components
├── pages/               # Route-level components
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── services/            # External service integrations
├── utils/               # Pure utility functions
├── lib/                 # Configuration and setup
└── integrations/        # Third-party integrations
```

### **Component Naming Conventions**
- **Components**: PascalCase (`LeadDetailModal.tsx`)
- **Hooks**: camelCase with `use` prefix (`useDebounce.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`LeadData.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

### **Import Organization**
```typescript
// 1. React imports
import React from 'react';

// 2. Third-party libraries
import { supabase } from '@/integrations/supabase/client';

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';

// 4. Relative imports
import './Component.css';
```

---

## 🔧 **Development Standards**

### **TypeScript Configuration**
- **Strict Mode**: Enabled for production builds
- **Path Aliases**: Use `@/` for src directory
- **Interface over Types**: Prefer interfaces for object shapes
- **No Implicit Any**: Disabled for gradual migration
- **Null Checks**: Disabled for flexibility (review per component)

### **React Best Practices**
- **Functional Components**: Use function components over classes
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Props Interface**: Define explicit interfaces for component props
- **Error Boundaries**: Implement error boundaries for critical sections
- **Memoization**: Use `useMemo` and `useCallback` judiciously

### **State Management**
- **React Query**: Use for server state management
- **Local State**: Use `useState` for component-specific state
- **Context**: Use for global app state (auth, permissions)
- **Local Storage**: Use for user preferences and notes

---

## 🎨 **UI/UX Standards**

### **Design System**
- **shadcn/ui**: Primary component library
- **Tailwind CSS**: Utility-first styling approach
- **Consistent Spacing**: Use Tailwind spacing scale
- **Color Palette**: Maintain consistent color usage
- **Typography**: Use consistent font sizes and weights

### **Component Patterns**
- **Card-Based Layout**: Use Card components for content sections
- **Modal Hierarchy**: Implement proper modal stacking
- **Loading States**: Always show loading indicators
- **Error States**: Provide clear error messages
- **Empty States**: Handle empty data gracefully

### **Responsive Design**
- **Mobile-First**: Design for mobile, enhance for desktop
- **Breakpoints**: Use Tailwind's responsive breakpoints
- **Touch Targets**: Minimum 44px touch targets
- **Virtual Scrolling**: Use for lists with 100+ items

---

## 🚀 **Performance Standards**

### **Bundle Optimization**
- **Code Splitting**: Implement manual chunking strategy
- **Lazy Loading**: Use for heavy components (admin pages, modals)
- **Tree Shaking**: Remove unused code and dependencies
- **Bundle Analysis**: Monitor bundle sizes regularly

### **Database Optimization**
- **Batch Queries**: Use batch utilities for related data
- **Query Caching**: Implement 2-minute TTL for dashboard data
- **Field Selection**: Only fetch required fields
- **Indexing**: Add indexes for common query patterns

### **Image Optimization**
- **Lazy Loading**: Implement for all images
- **Fallback Strategy**: Clearbit → LinkedIn → Initials
- **Loading Skeletons**: Prevent layout shift
- **Optimized Formats**: Use appropriate image formats

---

## 🔒 **Security Standards**

### **Authentication & Authorization**
- **Role-Based Access Control (RBAC)**: Implement proper role system
- **Permission Guards**: Protect admin routes and features
- **Service Role Key**: Secure handling of elevated privileges
- **Environment Variables**: Never commit sensitive keys

### **Data Validation**
- **Input Sanitization**: Validate all user inputs
- **Type Safety**: Use TypeScript interfaces for data validation
- **Error Handling**: Implement comprehensive error boundaries
- **Audit Trails**: Log critical operations

### **Security Checklist**
- [ ] Remove temporary admin hacks
- [ ] Implement proper role assignment
- [ ] Add data validation
- [ ] Separate personal vs admin settings
- [ ] Implement audit trails

---

## 📊 **Data Management**

### **Database Schema**
- **Supabase PostgreSQL**: Primary database
- **Row Level Security**: Implement RLS policies
- **Real-time Subscriptions**: Use for live data updates
- **Migration Management**: Use Supabase migrations

### **Data Models**
```typescript
// Lead/Person Entity
interface LeadData {
  id: string;
  name: string;
  company: string;
  email?: string;
  linkedin?: string;
  stage: LeadStage;
  owner?: string;
  aiScore?: number;
  // Essential fields only
}

// Company Entity
interface CompanyData {
  id: string;
  companyName: string;
  industry?: string;
  website?: string;
  companySize?: string;
  headOffice?: string;
  logo?: string;
}

// Job Entity
interface JobData {
  id: string;
  jobTitle: string;
  company: string;
  jobLocation?: string;
  industry?: string;
  postedDate?: string;
  validThrough?: string;
  jobSummary?: string;
  employmentType?: string;
  aiScore?: number;
}
```

### **Query Patterns**
- **Batch Operations**: Use `batchFetchCompanyData()`
- **Optimized Queries**: Only select required fields
- **Caching Strategy**: 2-minute TTL for dashboard data
- **Error Handling**: Graceful fallbacks for missing data

---

## 🧪 **Testing Standards**

### **Testing Strategy**
- **Component Testing**: Test critical user flows
- **Integration Testing**: Test admin functionality
- **Error Handling**: Test error scenarios
- **Performance Testing**: Monitor bundle sizes and load times

### **Testing Checklist**
- [ ] Admin pages load with proper permissions
- [ ] User management functions work completely
- [ ] Settings persist across page refreshes
- [ ] Permission guards block unauthorized access
- [ ] Error handling provides clear feedback
- [ ] No console errors or crashes

---

## 📝 **Documentation Standards**

### **Code Documentation**
- **README Files**: Maintain up-to-date README for each major feature
- **Inline Comments**: Document complex logic
- **Type Definitions**: Use descriptive interface names
- **API Documentation**: Document service integrations

### **Project Documentation**
- **Architecture Decisions**: Document major architectural choices
- **Performance Reports**: Maintain performance optimization reports
- **Security Audits**: Document security findings and fixes
- **User Guides**: Provide clear user documentation

---

## 🔄 **Deployment & Environment**

### **Environment Configuration**
```bash
# Required Environment Variables
VITE_SUPABASE_URL=https://jedfundfhzytpnbjkspn.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### **Build Configuration**
- **Production Builds**: Remove console logs and debugger statements
- **Development Mode**: Enable hot reloading and debugging
- **Bundle Analysis**: Monitor chunk sizes and dependencies
- **Performance Tracking**: Enable performance monitoring

### **Deployment Checklist**
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Performance optimizations active
- [ ] Security measures implemented
- [ ] Error handling comprehensive
- [ ] Documentation up-to-date

---

## 🚨 **Critical Issues to Address**

### **Immediate Actions Required**
1. **Remove "everyone is admin" hack** - Security vulnerability
2. **Fix admin settings persistence** - Functionality issue
3. **Separate personal vs admin settings** - UX improvement
4. **Implement proper role assignment** - Security requirement
5. **Add comprehensive error handling** - Reliability improvement

### **Security Priorities**
- Implement proper RBAC system
- Add data validation and sanitization
- Create audit trails for critical operations
- Separate admin and personal settings
- Remove temporary security hacks

---

## 📈 **Performance Monitoring**

### **Key Metrics to Track**
- **Bundle Size**: Monitor chunk sizes (target: <100KB per chunk)
- **Load Time**: Track initial page load (target: <3 seconds)
- **Database Queries**: Monitor query count and performance
- **User Experience**: Track Core Web Vitals scores

### **Optimization Targets**
- **LCP (Largest Contentful Paint)**: <2.5 seconds
- **FID (First Input Delay)**: <100 milliseconds
- **CLS (Cumulative Layout Shift)**: <0.1
- **Bundle Size**: <1MB total, <100KB per chunk

---

## 🎯 **Success Criteria**

### **Technical Excellence**
- Zero critical security vulnerabilities
- 100% admin functionality working
- Settings persist across sessions
- Proper role-based access control
- Comprehensive error handling

### **User Experience**
- <3 clicks to any setting
- Clear permission boundaries
- Consistent navigation patterns
- Responsive design on all devices
- Fast loading times (<3 seconds)

### **Maintainability**
- Clean, documented code
- Consistent patterns and conventions
- Comprehensive testing coverage
- Up-to-date documentation
- Regular performance monitoring

---

## 🔮 **Future Considerations**

### **Planned Enhancements**
- Email integration for direct outreach
- LinkedIn automation API integration
- Advanced AI scoring with machine learning
- Custom workflow automation
- Progressive Web App (PWA) capabilities

### **Scalability Planning**
- Database indexing optimization
- CDN implementation for images
- Service worker for offline support
- Advanced caching strategies
- Microservices architecture consideration

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: Active - All team members must follow these rules







