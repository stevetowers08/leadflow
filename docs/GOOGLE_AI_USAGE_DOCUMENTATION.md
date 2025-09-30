# 🤖 Google AI Integration Documentation - Empowr CRM

## Overview

This document provides a comprehensive overview of how Google AI (Gemini) is currently integrated and used throughout the Empowr CRM application. The integration spans both client-side and server-side implementations, with a focus on secure processing and optimal performance.

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Environment Configuration](#environment-configuration)
3. [Client-Side Integration](#client-side-integration)
4. [Server-Side Integration](#server-side-integration)
5. [AI Services](#ai-services)
6. [React Hooks & Context](#react-hooks--context)
7. [UI Components](#ui-components)
8. [Utility Functions](#utility-functions)
9. [Edge Functions](#edge-functions)
10. [Usage Examples](#usage-examples)
11. [Security Considerations](#security-considerations)
12. [Performance & Rate Limits](#performance--rate-limits)
13. [Troubleshooting](#troubleshooting)

## 🏗️ Architecture Overview

The Google AI integration follows a hybrid architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client-Side   │    │   Server-Side    │    │   Google AI     │
│                 │    │                  │    │   (Gemini)      │
│ • React Hooks   │◄──►│ • Edge Functions │◄──►│ • API Calls     │
│ • UI Components │    │ • Secure Keys    │    │ • Rate Limits   │
│ • Context API   │    │ • Database       │    │ • Free Tier     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Key Design Principles:
- **Security First**: API keys stored server-side, never exposed to client
- **Fallback Strategy**: Graceful degradation when AI services are unavailable
- **Rate Limit Respect**: Built-in throttling and batch processing
- **Cost Optimization**: Preference for free Gemini tier over paid OpenAI

## 🔧 Environment Configuration

### Required Environment Variables

#### Client-Side (.env)
```bash
# Google Gemini AI API (FREE - 60 requests per minute)
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

#### Server-Side (Supabase Secrets)
```bash
# For Edge Functions
GEMINI_API_KEY=your-gemini-api-key-here
GOOGLE_AI_API_KEY=your-gemini-api-key-here  # Alternative naming
```

### API Key Setup
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with Google account
3. Create API key
4. Add to environment variables

## 💻 Client-Side Integration

### Core Services

#### 1. GeminiService (`src/services/geminiService.ts`)
**Primary client-side AI service for job analysis and summarization**

**Key Features:**
- Job summarization with structured output
- Batch processing with rate limiting
- Lead scoring analysis
- Skill extraction and market analysis
- Free tier optimization (60 requests/minute)

**Main Methods:**
```typescript
// Generate comprehensive job summary
async generateJobSummary(jobData: JobData): Promise<GeminiAnalysisResult>

// Summarize raw job descriptions
async summarizeJobDescription(description: string): Promise<GeminiAnalysisResult>

// Batch process multiple jobs
async batchSummarizeJobs(jobs: JobData[]): Promise<BatchResult[]>

// Analyze jobs for lead scoring
async analyzeJobForLeadScoring(jobData: JobData): Promise<GeminiAnalysisResult>
```

**Configuration:**
- Model: `gemini-1.5-flash` (free tier)
- Temperature: 0.3 (consistent output)
- Max tokens: 1024
- Safety settings: Medium threshold for all categories

#### 2. AIService (`src/services/aiService.ts`)
**Unified AI service with provider fallback**

**Features:**
- Multi-provider support (Gemini + OpenAI)
- Automatic provider selection
- Lead scoring algorithms
- Outreach optimization
- Batch processing capabilities

**Provider Selection Logic:**
```typescript
// Auto mode prefers Gemini (free) over OpenAI (paid)
if (config.provider === 'auto') {
  return !!this.geminiApiKey; // Use Gemini if available
}
```

#### 3. ServerAIService (`src/services/serverAIService.ts`)
**Client-side wrapper for server-side AI processing**

**Purpose:**
- Secure API key handling
- Server-side processing via Supabase Edge Functions
- Fallback to client-side if server fails

## ⚙️ Server-Side Integration

### Edge Functions

#### 1. AI Job Summary (`supabase/functions/ai-job-summary/index.ts`)
**Server-side job summarization using Gemini API**

**Features:**
- Secure API key storage
- Database integration
- Error handling and logging
- CORS support

**API Endpoint:**
```
POST /functions/v1/ai-job-summary
```

**Request Format:**
```json
{
  "jobData": {
    "title": "Software Engineer",
    "company": "Tech Corp",
    "description": "Job description...",
    "location": "Remote",
    "salary": "$80,000 - $120,000"
  },
  "jobId": "job-uuid"
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "summary": "Comprehensive job summary",
    "key_requirements": ["requirement1", "requirement2"],
    "ideal_candidate": "Candidate profile",
    "urgency_level": "medium",
    "market_demand": "high",
    "skills_extracted": ["skill1", "skill2"],
    "salary_range": "$80,000 - $120,000",
    "remote_flexibility": true
  },
  "tokens_used": 150
}
```

#### 2. Reply Analysis (`supabase/functions/analyze-reply/index.ts`)
**AI-powered lead reply analysis**

**Purpose:**
- Classify lead responses (interested/not interested/maybe)
- Update database with analysis results
- Confidence scoring

**Analysis Categories:**
- `interested`: Clear interest, wants to proceed
- `not_interested`: Declines, asks to be removed
- `maybe`: Neutral, uncertain, asks for more info

## 🎣 React Hooks & Context

### AI Context (`src/contexts/AIContext.tsx`)
**Global AI state management**

**State Management:**
- Service availability status
- Active provider selection
- Usage statistics tracking
- Error handling
- Configuration management

**Key Components:**
- `AIProvider`: Context provider wrapper
- `useAI`: Hook for accessing AI context
- `AIStatusIndicator`: Visual status component
- `AIConfigurationPanel`: Settings management

### AI Hooks (`src/hooks/useAI.ts`)
**Specialized hooks for AI operations**

#### Available Hooks:

1. **`useAIJobSummary`**
   - Generate job summaries
   - Caching support
   - Error handling
   - Retry logic

2. **`useAISupabaseJobSummary`**
   - Supabase integration
   - Batch processing
   - Progress tracking
   - Workflow management

3. **`useAILeadScoring`**
   - Lead quality assessment
   - Confidence scoring
   - Factor analysis

4. **`useAILeadOptimization`**
   - Outreach strategy optimization
   - Contact method recommendations
   - Timing suggestions

5. **`useAIServiceStatus`**
   - Service availability checking
   - Provider status monitoring
   - Capability detection

## 🎨 UI Components

### AI Components (`src/components/ai/`)

#### 1. GeminiAPITest (`GeminiAPITest.tsx`)
**Testing component for API verification**

**Features:**
- Real-time API testing
- Status verification
- Error reporting
- Result display

#### 2. AIJobIntegration (`AIJobIntegration.tsx`)
**Complete AI integration example**

**Features:**
- Job summary generation
- Batch processing interface
- Status indicators
- Feature overview

### Integration Examples

#### Basic Job Summary Generation:
```tsx
import { useAIJobSummary } from '../hooks/useAI';

function JobSummaryComponent({ jobData }) {
  const { generateSummary, isLoading, error } = useAIJobSummary();
  
  const handleGenerateSummary = async () => {
    const summary = await generateSummary(jobData);
    console.log('Generated summary:', summary);
  };
  
  return (
    <Button onClick={handleGenerateSummary} disabled={isLoading}>
      {isLoading ? 'Generating...' : 'Generate AI Summary'}
    </Button>
  );
}
```

#### Batch Processing:
```tsx
import { useAISupabaseJobSummary } from '../hooks/useAI';

function BatchProcessor() {
  const { batchSummarizeJobs, progress, isLoading } = useAISupabaseJobSummary();
  
  const handleBatchProcess = async (jobIds: string[]) => {
    const results = await batchSummarizeJobs(jobIds);
    console.log('Batch results:', results);
  };
  
  return (
    <div>
      <div>Progress: {progress.percentage}%</div>
      <Button onClick={() => handleBatchProcess(['job1', 'job2'])}>
        Process Batch
      </Button>
    </div>
  );
}
```

## 🛠️ Utility Functions

### Job Summarization (`src/utils/jobSummarization.ts`)
**Supabase integration utilities**

**Key Functions:**
- `summarizeJobFromSupabase()`: Single job processing
- `batchSummarizeJobsFromSupabase()`: Batch processing
- `processJobSummarizationWorkflow()`: Complete workflow
- `getJobsNeedingSummarization()`: Data retrieval

### Reply Analysis (`src/utils/replyAnalysis.ts`)
**Lead response analysis utilities**

**Features:**
- Message classification
- Confidence scoring
- UI helper functions (emojis, colors, labels)
- Fallback handling

## 🔒 Security Considerations

### Current Implementation Issues

#### ❌ Client-Side Security Risks
- API keys exposed in client-side code
- Sensitive data sent directly from browser
- Potential for API key abuse

#### ✅ Server-Side Best Practices
- API keys stored securely in Supabase secrets
- Server-side processing for sensitive operations
- No client-side exposure of credentials

### Recommended Security Measures

1. **Use Server-Side Processing**
   ```typescript
   // ✅ Good: Server-side processing
   const response = await fetch('/functions/v1/ai-job-summary', {
     method: 'POST',
     body: JSON.stringify({ jobData })
   });
   
   // ❌ Avoid: Client-side API calls
   const response = await fetch('https://generativelanguage.googleapis.com/...', {
     headers: { 'Authorization': `Bearer ${apiKey}` }
   });
   ```

2. **Environment Variable Management**
   - Never commit API keys to version control
   - Use Supabase secrets for server-side keys
   - Rotate keys regularly

3. **Input Validation**
   - Sanitize all user inputs
   - Validate data before sending to AI APIs
   - Implement rate limiting

## ⚡ Performance & Rate Limits

### Gemini API Limits
- **Free Tier**: 60 requests per minute
- **Model**: `gemini-1.5-flash` (optimized for speed)
- **Token Limit**: 1024 tokens per response

### Optimization Strategies

#### 1. Batch Processing
```typescript
// Process jobs in batches of 5 with 2-second delays
const batchSize = 5;
const delayMs = 2000;

for (let i = 0; i < jobs.length; i += batchSize) {
  const batch = jobs.slice(i, i + batchSize);
  await Promise.all(batch.map(processJob));
  await new Promise(resolve => setTimeout(resolve, delayMs));
}
```

#### 2. Caching
```typescript
// Cache results to avoid duplicate API calls
const cacheKey = `${jobData.title}-${jobData.company}-${jobData.description.slice(0, 100)}`;
const cached = cache.get(cacheKey);
if (cached) return cached;
```

#### 3. Fallback Mechanisms
```typescript
// Graceful degradation when AI fails
try {
  const aiResult = await generateAISummary(data);
  return aiResult;
} catch (error) {
  console.warn('AI failed, using fallback:', error);
  return generateFallbackSummary(data);
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. API Key Not Configured
**Error**: `Gemini API key not configured`
**Solution**: 
- Check environment variables
- Verify API key is valid
- Ensure proper naming (`VITE_GEMINI_API_KEY`)

#### 2. Rate Limit Exceeded
**Error**: `429 Too Many Requests`
**Solution**:
- Implement proper batching
- Add delays between requests
- Monitor usage patterns

#### 3. Invalid Response Format
**Error**: `Invalid response format from Gemini API`
**Solution**:
- Check API response structure
- Implement proper error handling
- Add response validation

### Debug Tools

#### 1. API Test Component
```tsx
import { GeminiAPITest } from '../components/ai/GeminiAPITest';

// Use in development to test API connectivity
<GeminiAPITest />
```

#### 2. Service Status Check
```typescript
import { geminiService } from '../services/geminiService';

const status = geminiService.getStatus();
console.log('Gemini Status:', status);
```

#### 3. Environment Verification
```typescript
console.log('API Key Available:', !!import.meta.env.VITE_GEMINI_API_KEY);
console.log('Service Available:', geminiService.isAvailable());
```

## 📊 Usage Statistics

### Current Implementation Status

| Feature | Status | Implementation | Security Level |
|---------|--------|----------------|----------------|
| Job Summarization | ✅ Active | Client + Server | Mixed |
| Reply Analysis | ✅ Active | Server-side | Secure |
| Lead Scoring | ✅ Active | Client-side | ⚠️ Risky |
| Batch Processing | ✅ Active | Client + Server | Mixed |
| UI Components | ✅ Active | Client-side | Safe |
| Context Management | ✅ Active | Client-side | Safe |

### Recommended Actions

1. **Migrate Lead Scoring to Server-Side**
   - Create new Edge Function for lead scoring
   - Remove client-side API key usage
   - Implement secure processing

2. **Consolidate Job Summarization**
   - Standardize on server-side processing
   - Remove client-side Gemini calls
   - Improve error handling

3. **Add Monitoring**
   - Implement usage tracking
   - Add performance metrics
   - Create alerting for failures

## 🔄 Migration Path

### Phase 1: Security Hardening
- [ ] Move all AI processing to server-side
- [ ] Remove client-side API key usage
- [ ] Implement proper error handling

### Phase 2: Performance Optimization
- [ ] Add comprehensive caching
- [ ] Implement request queuing
- [ ] Optimize batch processing

### Phase 3: Monitoring & Analytics
- [ ] Add usage tracking
- [ ] Implement performance metrics
- [ ] Create admin dashboard

## 📚 Additional Resources

- [Google AI Studio Documentation](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest)
- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [AI Best Practices Guide](./AI_BEST_PRACTICES.md)
- [AI Integration Guide](./AI_INTEGRATION_GUIDE.md)

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: Empowr CRM Development Team
