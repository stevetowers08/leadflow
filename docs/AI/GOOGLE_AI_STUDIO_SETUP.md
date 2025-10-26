# 🚀 Google AI Studio Setup Guide - Best Practices 2025

This guide covers the complete setup and optimization of Google AI Studio (Gemini) integration for job summarization and AI-powered features.

## 📋 Quick Setup Checklist

### 1. Get Your Google AI Studio API Key

1. **Visit Google AI Studio**: [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. **Sign in** with your Google account
3. **Create API key** - Click "Create API key"
4. **Copy the key** - Save it securely

### 2. Environment Configuration

Add to your `.env` file:

```bash
# Google Gemini AI API (FREE - 60 requests per minute)
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Server-Side Configuration (Production)

For secure server-side processing:

```bash
# Set Gemini API key securely on server
supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here
```

## 🏗️ Architecture Overview

### Hybrid Implementation

Our system uses a **hybrid approach** combining client-side and server-side processing:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │───▶│  Supabase Edge   │───▶│  Google Gemini  │
│                 │    │     Function      │    │      API        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐             │
         └─────────────▶│   Supabase DB    │◀────────────┘
                        └──────────────────┘
```

### Benefits

- **Security**: API keys stored server-side
- **Performance**: Intelligent rate limiting and queuing
- **Reliability**: Automatic retry with exponential backoff
- **Scalability**: Batch processing capabilities

## 🔧 Implementation Features

### 1. Intelligent Rate Limiting

```typescript
// Automatic rate limiting (50 requests/minute conservative)
const rateLimitStatus = geminiService.getRateLimitStatus();
console.log(
  `Current: ${rateLimitStatus.currentRequests}/${rateLimitStatus.maxRequests}`
);
console.log(`Queue: ${rateLimitStatus.queueLength} requests`);
```

### 2. Structured Outputs

```typescript
// Consistent JSON responses with validation
const result = await geminiService.generateJobSummary(jobData);
// Returns validated, structured data
```

### 3. Retry Logic with Exponential Backoff

```typescript
// Automatic retry on failures
// Attempt 1: Immediate
// Attempt 2: 2 second delay
// Attempt 3: 4 second delay
```

### 4. Batch Processing

```typescript
// Process multiple jobs efficiently
const results = await geminiService.batchSummarizeJobs(jobs);
```

## 📊 Performance Optimizations

### Generation Configuration

```typescript
generationConfig: {
  temperature: 0.1,        // Lower for consistency
  topK: 20,               // Focused responses
  topP: 0.8,              // Better consistency
  maxOutputTokens: 2048,   // Detailed responses
  candidateCount: 1,      // Single response
  stopSequences: [],      // No early stopping
}
```

### Prompt Engineering Best Practices

1. **Role Definition**: "You are an expert recruitment analyst"
2. **Structured Instructions**: Clear step-by-step tasks
3. **Response Format**: Explicit JSON schema
4. **Guidelines**: Specific criteria for classifications
5. **Validation**: Built-in response validation

## 🛡️ Security Best Practices

### 1. API Key Protection

- ✅ **Server-side storage**: Keys stored in Supabase secrets
- ✅ **Environment variables**: Never commit keys to code
- ✅ **RLS policies**: Database access controls

### 2. Input Validation

```typescript
// Validate job data before processing
if (!jobData.title || !jobData.description) {
  throw new Error('Missing required job data');
}
```

### 3. Response Validation

```typescript
// Validate AI responses
const validatedData = parseAndValidateResponse(aiResponse);
```

## 📈 Monitoring & Analytics

### Service Status

```typescript
const status = geminiService.getStatus();
console.log('Available:', status.available);
console.log('Model:', status.model);
console.log('Rate Limit:', status.rateLimit);
console.log('Queue Length:', status.performance.requestsInQueue);
```

### Rate Limit Monitoring

```typescript
const rateLimit = geminiService.getRateLimitStatus();
if (rateLimit.currentRequests > rateLimit.maxRequests * 0.8) {
  console.warn('Approaching rate limit');
}
```

## 🔄 Usage Examples

### Basic Job Summarization

```typescript
import { geminiService } from './services/geminiService';

const jobData = {
  title: 'Senior React Developer',
  company: 'Tech Corp',
  description: 'We are looking for...',
  location: 'San Francisco, CA',
  salary: '$120,000 - $150,000',
};

const result = await geminiService.generateJobSummary(jobData);

if (result.success) {
  console.log('Summary:', result.data.summary);
  console.log('Requirements:', result.data.key_requirements);
  console.log('Skills:', result.data.skills_extracted);
}
```

### Batch Processing

```typescript
const jobs = [
  { id: '1', title: 'Dev', company: 'A', description: '...' },
  { id: '2', title: 'Designer', company: 'B', description: '...' },
];

const results = await geminiService.batchSummarizeJobs(jobs);
results.forEach(({ id, result }) => {
  if (result.success) {
    console.log(`Job ${id}: ${result.data.summary}`);
  }
});
```

### Error Handling

```typescript
try {
  const result = await geminiService.generateJobSummary(jobData);

  if (!result.success) {
    console.error('AI Error:', result.error);
    // Handle fallback logic
  }
} catch (error) {
  console.error('Service Error:', error);
  // Handle service errors
}
```

## 🚨 Troubleshooting

### Common Issues

1. **API Key Not Configured**

   ```
   Error: Gemini API key not configured
   Solution: Add VITE_GEMINI_API_KEY to .env file
   ```

2. **Rate Limit Exceeded**

   ```
   Error: Rate limit reached
   Solution: Wait for rate limit reset or reduce request frequency
   ```

3. **Invalid Response Format**
   ```
   Error: Failed to parse API response
   Solution: Check prompt format and response validation
   ```

### Debug Mode

```typescript
// Enable debug logging
console.log('Rate Limit Status:', geminiService.getRateLimitStatus());
console.log('Service Status:', geminiService.getStatus());

// Clear rate limits for testing
geminiService.clearRateLimit();
```

## 📚 API Reference

### GeminiService Methods

| Method                       | Description              | Parameters                 | Returns                |
| ---------------------------- | ------------------------ | -------------------------- | ---------------------- |
| `generateJobSummary()`       | Generate job summary     | `JobData`                  | `GeminiAnalysisResult` |
| `summarizeJobDescription()`  | Summarize description    | `string, string?, string?` | `GeminiAnalysisResult` |
| `batchSummarizeJobs()`       | Batch process jobs       | `JobData[]`                | `Result[]`             |
| `analyzeJobForLeadScoring()` | Analyze for lead scoring | `JobData`                  | `GeminiAnalysisResult` |
| `getStatus()`                | Get service status       | -                          | `ServiceStatus`        |
| `getRateLimitStatus()`       | Get rate limit info      | -                          | `RateLimitStatus`      |
| `isAvailable()`              | Check availability       | -                          | `boolean`              |

### Response Format

```typescript
interface GeminiJobSummary {
  summary: string;
  key_requirements: string[];
  ideal_candidate: string;
  urgency_level: 'low' | 'medium' | 'high';
  market_demand: 'low' | 'medium' | 'high';
  skills_extracted: string[];
  salary_range?: string;
  remote_flexibility?: boolean;
}
```

## 🎯 Best Practices Summary

### ✅ Do This

1. **Use server-side processing** for production
2. **Implement rate limiting** to avoid API limits
3. **Validate all responses** before using data
4. **Use structured prompts** for consistent outputs
5. **Monitor performance** and adjust accordingly
6. **Handle errors gracefully** with fallbacks
7. **Cache results** when appropriate

### ❌ Don't Do This

1. **Don't expose API keys** in client-side code
2. **Don't ignore rate limits** - implement proper queuing
3. **Don't trust AI responses** without validation
4. **Don't use high temperature** for structured outputs
5. **Don't process large batches** without rate limiting
6. **Don't ignore error handling** - always have fallbacks

## 🔗 Related Documentation

- [AI Integration Guide](./AI_INTEGRATION_GUIDE.md)
- [AI Best Practices](./AI_BEST_PRACTICES.md)
- [Database Best Practices](../DATABASE/DATABASE_BEST_PRACTICES.md)
- [Development Guide](../CORE/DEVELOPMENT_GUIDE.md)

---

**Last Updated**: January 2025  
**Version**: 2.0 - Google AI Studio Best Practices  
**Status**: Production Ready ✅
