# 🤖 AI Integration Guide - Google Gemini API

This guide shows you how to use the free Google Gemini API for AI-powered features in your Empowr CRM application.

## 🚀 Quick Setup

### 1. Get Your Free Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API key"
4. Copy your API key

### 2. Add to Environment Variables

Add to your `.env` file:
```bash
# Google Gemini AI API (FREE - 60 requests per minute)
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Install the AI Provider

Update your `App.tsx` to include the AI provider:

```tsx
import { AIProvider } from './contexts/AIContext';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AIProvider> {/* Add AI Provider */}
              <AppRoutes />
            </AIProvider>
          </AuthProvider>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

## 📋 Available AI Features

### 1. Job Summarization
Generate intelligent summaries of job postings from your Supabase database.

```tsx
import { JobSummaryGenerator } from './components/ai/AIComponents';

function JobPage() {
  const jobData = {
    title: "Senior React Developer",
    company: "Tech Corp",
    description: "We're looking for an experienced React developer...",
    location: "San Francisco, CA",
    salary: "$120,000 - $150,000"
  };

  return (
    <JobSummaryGenerator 
      jobData={jobData}
      onSummaryGenerated={(summary) => {
        console.log('Generated summary:', summary);
        // Update your database with the summary
      }}
    />
  );
}
```

### 2. Batch Job Processing
Process multiple jobs at once for summarization.

```tsx
import { BatchJobSummarization } from './components/ai/AIComponents';

function AdminPage() {
  return (
    <BatchJobSummarization 
      onComplete={(results) => {
        console.log('Batch processing complete:', results);
      }}
    />
  );
}
```

### 3. Lead Scoring
Calculate AI-powered scores for your leads.

```tsx
import { LeadScoring } from './components/ai/AIComponents';

function LeadPage() {
  const leadData = {
    name: "John Doe",
    company: "Startup Inc",
    role: "CTO",
    location: "New York, NY",
    experience: "10+ years",
    industry: "Technology",
    company_size: "50-200 employees"
  };

  return (
    <LeadScoring 
      leadData={leadData}
      onScoreGenerated={(score) => {
        console.log('Lead score:', score.score);
        // Update lead score in database
      }}
    />
  );
}
```

### 4. Lead Optimization
Get AI recommendations for lead outreach.

```tsx
import { LeadOptimization } from './components/ai/AIComponents';

function OutreachPage() {
  const leadData = {
    name: "Jane Smith",
    company: "Enterprise Corp",
    role: "VP Engineering",
    industry: "Fintech",
    previous_interactions: ["LinkedIn connection", "Email sent"]
  };

  return (
    <LeadOptimization 
      leadData={leadData}
      onOptimizationGenerated={(optimization) => {
        console.log('Optimization suggestions:', optimization.suggested_actions);
      }}
    />
  );
}
```

## 🔧 Using AI Hooks Directly

### Job Summary Hook
```tsx
import { useAIJobSummary } from './hooks/useAI';

function CustomJobComponent() {
  const { generateSummary, isLoading, error, lastResult } = useAIJobSummary({
    enableCaching: true,
    enableAutoRetry: true
  });

  const handleGenerate = async () => {
    const summary = await generateSummary({
      title: "Software Engineer",
      company: "Tech Company",
      description: "Job description here...",
      location: "Remote"
    });
    
    if (summary) {
      // Use the summary
      console.log(summary.summary);
      console.log(summary.key_requirements);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Summary'}
      </button>
      {error && <div className="error">{error}</div>}
      {lastResult && <div>{lastResult.summary}</div>}
    </div>
  );
}
```

### Supabase Integration Hook
```tsx
import { useAISupabaseJobSummary } from './hooks/useAI';

function SupabaseJobProcessor() {
  const { 
    summarizeJob, 
    batchSummarizeJobs, 
    processWorkflow,
    isLoading, 
    progress 
  } = useAISupabaseJobSummary();

  const handleProcessJob = async (jobId: string) => {
    const result = await summarizeJob(jobId);
    if (result) {
      // Update your UI with the result
      console.log('Job summarized:', result);
    }
  };

  const handleBatchProcess = async (jobIds: string[]) => {
    const results = await batchSummarizeJobs(jobIds);
    console.log('Batch results:', results);
  };

  const handleWorkflow = async () => {
    const results = await processWorkflow(10);
    console.log('Workflow complete:', results);
  };

  return (
    <div>
      <button onClick={() => handleWorkflow()} disabled={isLoading}>
        Process 10 Jobs
      </button>
      {progress.total > 0 && (
        <div>
          Progress: {progress.current}/{progress.total} ({progress.percentage}%)
        </div>
      )}
    </div>
  );
}
```

## 🎯 AI Context Usage

### Check AI Status
```tsx
import { useAI, AIStatusIndicator } from './contexts/AIContext';

function Dashboard() {
  const { isAvailable, activeProvider, usage } = useAI();

  return (
    <div>
      <AIStatusIndicator />
      <div>
        AI Available: {isAvailable ? 'Yes' : 'No'}
        Active Provider: {activeProvider}
        Total Requests: {usage.totalRequests}
      </div>
    </div>
  );
}
```

### AI Configuration Panel
```tsx
import { AIConfigurationPanel } from './contexts/AIContext';

function SettingsPage() {
  return (
    <div>
      <h2>AI Settings</h2>
      <AIConfigurationPanel />
    </div>
  );
}
```

## 🔄 Utility Functions

### Direct Service Usage
```tsx
import { geminiService } from './services/geminiService';
import { summarizeJobFromSupabase } from './utils/jobSummarization';

// Direct Gemini service usage
const result = await geminiService.generateJobSummary({
  title: "Developer",
  company: "Company",
  description: "Job description...",
  location: "Remote"
});

// Supabase integration
const summaryResult = await summarizeJobFromSupabase('job-uuid-here');
if (summaryResult.success) {
  console.log('Summary:', summaryResult.data);
}
```

## 📊 Rate Limits & Costs

### Google Gemini API (FREE)
- **Rate Limit**: 60 requests per minute
- **Cost**: FREE for basic usage
- **Model**: gemini-1.5-flash
- **Features**: Job summarization, lead scoring, text analysis

### Fallback to OpenAI
- If Gemini is unavailable, the system automatically falls back to OpenAI
- Configure with `VITE_OPENAI_API_KEY` in your environment

## 🛠️ Advanced Configuration

### Custom AI Service Configuration
```tsx
import { AIService } from './services/aiService';

// Create custom AI service instance
const customAIService = new AIService({
  provider: 'gemini', // Force Gemini usage
  fallbackProvider: 'openai'
});

// Use the custom service
const summary = await customAIService.generateJobSummary(jobData);
```

### Error Handling
```tsx
import { useAIJobSummary } from './hooks/useAI';

function RobustJobComponent() {
  const { generateSummary, isLoading, error, retry } = useAIJobSummary({
    enableAutoRetry: true
  });

  const handleGenerate = async () => {
    try {
      const summary = await generateSummary(jobData);
      // Handle success
    } catch (err) {
      console.error('AI generation failed:', err);
      // Handle error, maybe show fallback UI
    }
  };

  return (
    <div>
      {error && (
        <div className="error">
          <p>AI generation failed: {error}</p>
          <button onClick={retry}>Retry</button>
        </div>
      )}
      {/* Your component content */}
    </div>
  );
}
```

## 🚀 Best Practices

1. **Use Caching**: Enable caching for repeated requests
2. **Batch Processing**: Use batch operations for multiple items
3. **Error Handling**: Always handle AI service errors gracefully
4. **Rate Limiting**: Respect the 60 requests/minute limit
5. **Fallback UI**: Provide manual alternatives when AI fails
6. **Progress Indicators**: Show progress for long-running operations

## 🔍 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the key is correctly set in environment variables
   - Check that the key has proper permissions

2. **Rate Limit Exceeded**
   - Implement delays between requests
   - Use batch processing to reduce individual requests

3. **AI Service Unavailable**
   - Check your internet connection
   - Verify API endpoints are accessible
   - Check browser console for errors

### Debug Mode
```tsx
import { useAI } from './contexts/AIContext';

function DebugPanel() {
  const { status, usage, lastError } = useAI();
  
  return (
    <div className="debug-panel">
      <h3>AI Debug Info</h3>
      <pre>{JSON.stringify({ status, usage, lastError }, null, 2)}</pre>
    </div>
  );
}
```

## 📈 Monitoring Usage

The AI context automatically tracks usage statistics:

```tsx
const { usage } = useAI();

console.log('Total requests:', usage.totalRequests);
console.log('Success rate:', usage.successfulRequests / usage.totalRequests);
console.log('Tokens used:', usage.tokensUsed);
console.log('Last used:', usage.lastUsed);
```

This comprehensive AI integration gives you powerful, free AI capabilities for your CRM application using Google's Gemini API!
