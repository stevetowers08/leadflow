/**
 * Mindee Business Card OCR Service
 * 
 * PDR Section: Technical Specifications - OCR Implementation
 * API: https://platform.mindee.com/docs/business-card
 * 
 * Features:
 * - Extracts names, roles, company names, emails, phone numbers
 * - 90%+ accuracy
 * - Handles multilingual and non-standard layouts
 * - Processing time ~0.9 seconds per image
 */

export interface MindeeOcrResult {
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  jobTitle: string | null;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  confidence: {
    fullName: number;
    email: number;
    phone: number;
    company: number;
  };
  rawResponse: any;
}

export interface MindeeApiResponse {
  api_request: {
    resources: string[];
    status: string;
    status_code: number;
  };
  document: {
    inference: {
      prediction: {
        company_names: Array<{ value: string; confidence: number }>;
        emails: Array<{ value: string; confidence: number }>;
        job_titles: Array<{ value: string; confidence: number }>;
        names: Array<{ value: string; confidence: number }>;
        phones: Array<{ value: string; confidence: number }>;
        websites: Array<{ value: string; confidence: number }>;
      };
    };
  };
}

/**
 * Extract business card data from image using Mindee OCR API
 * 
 * @param imageData - Base64 encoded image or image URL
 * @param apiKey - Mindee API key (from env)
 * @returns Extracted business card data with confidence scores
 */
export async function extractBusinessCardData(
  imageData: string | File,
  apiKey?: string
): Promise<MindeeOcrResult> {
  // For server-side (API route), use server env var
  // For client-side, use public env var
  const apiKeyToUse =
    apiKey ||
    (typeof window === 'undefined'
      ? process.env.MINDEE_API_KEY
      : process.env.NEXT_PUBLIC_MINDEE_API_KEY) ||
    process.env.NEXT_PUBLIC_MINDEE_API_KEY;
  
  if (!apiKeyToUse) {
    throw new Error('Mindee API key is required. Set MINDEE_API_KEY (server) or NEXT_PUBLIC_MINDEE_API_KEY (client) in environment variables.');
  }

  const endpoint = 'https://api.mindee.net/v1/products/mindee/business_cards/v1/predict';

  // Prepare form data
  const formData = new FormData();
  
  if (imageData instanceof File) {
    formData.append('document', imageData);
  } else if (imageData.startsWith('data:image')) {
    // Convert base64 data URL to blob
    const response = await fetch(imageData);
    const blob = await response.blob();
    formData.append('document', blob, 'business-card.jpg');
  } else if (imageData.startsWith('http')) {
    // Download image from URL
    const response = await fetch(imageData);
    const blob = await response.blob();
    formData.append('document', blob, 'business-card.jpg');
  } else {
    // Assume base64 string
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    formData.append('document', blob, 'business-card.jpg');
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKeyToUse}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mindee API error: ${response.status} - ${errorText}`);
    }

    const data: MindeeApiResponse = await response.json();

    // Extract and parse data
    const prediction = data.document.inference.prediction;

    // Get best matches (highest confidence)
    const bestName = prediction.names?.[0];
    const bestEmail = prediction.emails?.[0];
    const bestPhone = prediction.phones?.[0];
    const bestCompany = prediction.company_names?.[0];
    const bestJobTitle = prediction.job_titles?.[0];
    const bestWebsite = prediction.websites?.[0];

    // Parse full name into first/last
    const fullName = bestName?.value || null;
    let firstName: string | null = null;
    let lastName: string | null = null;
    
    if (fullName) {
      const nameParts = fullName.trim().split(/\s+/);
      if (nameParts.length === 1) {
        firstName = nameParts[0];
      } else if (nameParts.length >= 2) {
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }
    }

    return {
      fullName,
      firstName,
      lastName,
      jobTitle: bestJobTitle?.value || null,
      companyName: bestCompany?.value || null,
      email: bestEmail?.value || null,
      phone: bestPhone?.value || null,
      website: bestWebsite?.value || null,
      confidence: {
        fullName: bestName?.confidence || 0,
        email: bestEmail?.confidence || 0,
        phone: bestPhone?.confidence || 0,
        company: bestCompany?.confidence || 0,
      },
      rawResponse: data,
    };
  } catch (error) {
    console.error('Mindee OCR error:', error);
    throw error;
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string | null): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string | null): string | null {
  if (!phone) return null;
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

