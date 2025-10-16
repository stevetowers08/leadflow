# 🤖 AI Integration Guide - Hybrid Client/Server Implementation

This guide shows you how to use AI-powered features in your Empowr CRM application with our secure hybrid approach that combines client-side and server-side processing.

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

### 3. Server-Side Configuration (Recommended)

For production use, configure server-side processing:

```bash
# Set Gemini API key securely on server
supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Server-Side Configuration (Recommended)

For production use, configure server-side processing:

```bash
# Set Gemini API key securely on server
supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here
```

## 🔄 Hybrid Implementation Approach

Our AI system uses a **hybrid approach** that combines the best of both client-side and server-side processing:

### Client-Side Processing

- **Lead Scoring**: Fast, real-time scoring for immediate feedback
- **UI Components**: Interactive AI features with instant responses
- **Development**: Quick iteration and testing

### Server-Side Processing

- **Job Summarization**: Secure, scalable processing via Supabase Edge Functions
- **Batch Operations**: Large-scale data processing
- **Production**: Secure API key handling

### Automatic Fallback

The system automatically falls back to client-side processing if server-side fails, ensuring reliability.

## 📋 Available AI Features

### 1. Job Summarization (Server-Side)

Generate intelligent summaries using secure server-side processing:

```tsx
import { AIJobSummary } from './components/popup/AIJobSummary';

function JobPage() {
  const jobData = {
    id: 'job-uuid',
    title: 'Senior React Developer',
    company: 'Tech Corp',
    description: "We're looking for an experienced React developer...",
    location: 'San Francisco, CA',
  };

  return (
    <AIJobSummary
      job={jobData}
      onSummaryGenerated={summary => {
        console.log('Generated summary:', summary);
        // Automatically saved to database
      }}
    />
  );
}
```

### 2. Lead Scoring (Client-Side)

Calculate AI-powered scores with instant feedback:

```tsx
import { AIScoreBadge } from './components/ai/AIScoreBadge';

function LeadPage() {
  const leadData = {
    name: 'John Doe',
    company: 'Startup Inc',
    role: 'CTO',
    location: 'New York, NY',
    experience: '10+ years',
    industry: 'Technology',
    company_size: '50-200 employees',
  };

  return (
    <AIScoreBadge
      leadData={leadData}
      onScoreUpdate={score => {
        console.log('Lead score:', score.score);
        // Update lead score in database
      }}
    />
  );
}
```

### 3. AI Context Usage

Check AI status and configuration:

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

## 🔧 Using AI Hooks Directly

### Job Summary Hook (Server-Side)

```tsx
import { useAIJobSummary } from './hooks/useAI';

function CustomJobComponent() {
  const { generateSummary, isLoading, error, lastResult } = useAIJobSummary({
    enableCaching: true,
    enableAutoRetry: true,
  });

  const handleGenerate = async () => {
    const summary = await generateSummary({
      id: 'job-uuid', // Required for server-side processing
      title: 'Software Engineer',
      company: 'Tech Company',
      description: 'Job description here...',
      location: 'Remote',
    });

    if (summary) {
      console.log(summary.summary);
      console.log(summary.key_requirements);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Summary'}
      </button>
      {error && <div className='error'>{error}</div>}
      {lastResult && <div>{lastResult.summary}</div>}
    </div>
  );
}
```

### Lead Scoring Hook (Client-Side)

```tsx
import { useAI } from './hooks/useAI';

function LeadScoringComponent() {
  const { calculateLeadScore } = useAI();

  const handleScore = async () => {
    const score = await calculateLeadScore({
      name: 'Jane Smith',
      company: 'Enterprise Corp',
      role: 'VP Engineering',
      location: 'San Francisco, CA',
    });

    console.log('Score:', score.score);
    console.log('Reason:', score.reason);
  };

  return <button onClick={handleScore}>Calculate AI Score</button>;
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
import { aiService } from './services/aiService';
import { serverAIService } from './services/serverAIService';

// Client-side lead scoring
const score = await aiService.calculateLeadScore(leadData);

// Server-side job summarization
const summary = await serverAIService.generateJobSummary({
  id: jobId,
  title: jobData.title,
  company: jobData.company,
  description: jobData.description,
  location: jobData.location,
});
```

## 📊 Rate Limits & Costs

### Google Gemini API (FREE)

- **Rate Limit**: 60 requests per minute
- **Cost**: FREE for basic usage
- **Model**: gemini-1.5-flash
- **Features**: Job summarization, lead scoring, text analysis

### Hybrid Benefits

- **Security**: Server-side processing protects API keys
- **Performance**: Client-side provides instant feedback
- **Reliability**: Automatic fallback ensures uptime
- **Scalability**: Server-side handles batch operations

## 🛠️ Advanced Configuration

### Custom AI Service Configuration

```tsx
import { AIService } from './services/aiService';

// Create custom AI service instance
const customAIService = new AIService({
  provider: 'gemini', // Force Gemini usage
  fallbackProvider: 'openai',
});

// Use the custom service
const score = await customAIService.calculateLeadScore(leadData);
```

### Error Handling

```tsx
import { useAIJobSummary } from './hooks/useAI';

function RobustJobComponent() {
  const { generateSummary, isLoading, error, retry } = useAIJobSummary({
    enableAutoRetry: true,
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
        <div className='error'>
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

1. **Use Hybrid Approach**: Leverage both client and server processing
2. **Enable Caching**: Reduce API calls and improve performance
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
    <div className='debug-panel'>
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

This hybrid AI integration provides powerful, secure, and reliable AI capabilities for your CRM application!
