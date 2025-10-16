import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export interface ReplyAnalysisResult {
  replyType: 'interested' | 'not_interested' | 'maybe';
  confidence: number;
  reasoning: string;
}

/**
 * Analyze a lead's reply message using Google AI to determine interest level
 */
export async function analyzeReplyMessage(
  message: string
): Promise<ReplyAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Analyze the following message from a potential lead and determine their interest level in our recruitment services.

Message: "${message}"

Please classify this message into one of these categories:
1. "interested" - The person shows clear interest, wants to proceed, asks questions about next steps, or expresses enthusiasm
2. "not_interested" - The person clearly declines, says they're not interested, or asks to be removed from communications
3. "maybe" - The person is neutral, uncertain, asks for more information, or gives a non-committal response

Respond with a JSON object in this exact format:
{
  "replyType": "interested|not_interested|maybe",
  "confidence": 0.85,
  "reasoning": "Brief explanation of why you classified it this way"
}

The confidence should be a number between 0 and 1, where 1 is completely confident.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const analysis = JSON.parse(text.trim());

    return {
      replyType: analysis.replyType,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning,
    };
  } catch (error) {
    console.error('Error analyzing reply message:', error);

    // Fallback to neutral classification
    return {
      replyType: 'maybe',
      confidence: 0.5,
      reasoning: 'Unable to analyze message, defaulting to neutral',
    };
  }
}

/**
 * Get reply type emoji for UI display
 */
export function getReplyTypeEmoji(
  replyType: 'interested' | 'not_interested' | 'maybe'
): string {
  switch (replyType) {
    case 'interested':
      return '😊'; // Green smiling face
    case 'not_interested':
      return '😞'; // Red frowning face
    case 'maybe':
      return '😐'; // Orange neutral face
    default:
      return '❓';
  }
}

/**
 * Get reply type color for UI display
 */
export function getReplyTypeColor(
  replyType: 'interested' | 'not_interested' | 'maybe'
): string {
  switch (replyType) {
    case 'interested':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'not_interested':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'maybe':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Get reply type label for UI display
 */
export function getReplyTypeLabel(
  replyType: 'interested' | 'not_interested' | 'maybe'
): string {
  switch (replyType) {
    case 'interested':
      return 'Interested';
    case 'not_interested':
      return 'Not Interested';
    case 'maybe':
      return 'Maybe';
    default:
      return 'Unknown';
  }
}
