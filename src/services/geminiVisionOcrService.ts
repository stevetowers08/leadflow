/**
 * Google Gemini Vision OCR Service for Business Cards
 * 
 * Uses Gemini 2.0 Flash (latest vision-capable model)
 * Free tier: 15 RPM, 1,500 RPD
 * 
 * Replaces Mindee OCR with free, AI-powered alternative
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface BusinessCardData {
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  jobTitle: string | null;
  website: string | null;
  confidence?: {
    fullName: number;
    email: number;
    phone: number;
    company: number;
  };
  rawResponse?: any;
}

/**
 * Extract business card data using Gemini Vision API
 */
export async function extractBusinessCardWithGemini(
  imageData: string | File | Blob,
  apiKey?: string
): Promise<BusinessCardData> {
  const apiKeyToUse =
    apiKey ||
    (typeof window === 'undefined'
      ? process.env.GEMINI_API_KEY
      : process.env.NEXT_PUBLIC_GEMINI_API_KEY) ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKeyToUse) {
    throw new Error(
      'Gemini API key is required. Set GEMINI_API_KEY (server) or NEXT_PUBLIC_GEMINI_API_KEY (client) in environment variables.'
    );
  }

  // Convert image to base64
  let base64Image: string;
  if (typeof imageData === 'string') {
    base64Image = imageData;
  } else {
    // Server-side: Use Buffer API
    if (typeof window === 'undefined') {
      const arrayBuffer = await imageData.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = imageData instanceof File ? imageData.type : 'image/jpeg';
      base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;
    } else {
      // Client-side: Use FileReader API
      const reader = new FileReader();
      base64Image = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert image to base64'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageData);
      });
    }
  }

  // Extract base64 data (remove data:image/jpeg;base64, prefix)
  const base64Match = base64Image.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!base64Match) {
    throw new Error('Invalid image format. Expected data URL.');
  }

  const mimeType = base64Match[1];
  const base64Data = base64Match[2];

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(apiKeyToUse);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `Extract all information from this business card image. 
Return ONLY valid JSON with this exact structure (use null for missing fields):
{
  "fullName": "string or null",
  "firstName": "string or null",
  "lastName": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "companyName": "string or null",
  "jobTitle": "string or null",
  "website": "string or null"
}

Rules:
- Extract the person's full name and split into firstName/lastName if possible
- Extract email address (validate format)
- Extract phone number (include country code if present)
- Extract company name
- Extract job title/position
- Extract website URL if present
- Return null for any field that cannot be found
- Do not include any text outside the JSON object`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: `image/${mimeType}`,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse JSON from response (may have markdown code blocks)
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');
    }

    // Parse JSON
    let parsed: Partial<BusinessCardData>;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      // Try to extract JSON from text if wrapped in other content
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse JSON from Gemini response');
      }
    }

    // Parse full name into first/last
    let firstName: string | null = null;
    let lastName: string | null = null;
    
    if (parsed.fullName) {
      const nameParts = parsed.fullName.trim().split(/\s+/);
      if (nameParts.length === 1) {
        firstName = nameParts[0];
      } else if (nameParts.length >= 2) {
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }
    }

    // Validate email format
    const email = parsed.email && validateEmail(parsed.email) ? parsed.email : null;

    return {
      fullName: parsed.fullName || null,
      firstName: parsed.firstName || firstName,
      lastName: parsed.lastName || lastName,
      email,
      phone: parsed.phone || null,
      companyName: parsed.companyName || null,
      jobTitle: parsed.jobTitle || null,
      website: parsed.website || null,
      rawResponse: text,
    };
  } catch (error) {
    console.error('Gemini Vision OCR error:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to extract business card data');
  }
}

/**
 * Validate email format
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

