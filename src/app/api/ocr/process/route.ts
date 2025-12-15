/**
 * OCR Processing API Route
 *
 * PDR Section: Technical Specifications - OCR Implementation
 * Processes business card images using Google Gemini Vision API
 * Free tier: 15 RPM, 1,500 RPD
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  extractBusinessCardWithGemini,
  GeminiQuotaError,
} from '@/services/geminiVisionOcrService';

export const runtime = 'nodejs';
export const maxDuration = 30;

// This is a server-side API route, so we can use server env vars

export async function POST(request: NextRequest) {
  try {
    // Validate API key first - critical for production
    // Trim whitespace/newlines that might be present in env vars
    const apiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY
    ) // Fallback for legacy Vite format
      ?.trim();

    if (!apiKey) {
      console.error(
        'OCR API: GEMINI_API_KEY is missing in environment variables'
      );
      console.error('Available env vars:', {
        hasGEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
        hasNEXT_PUBLIC_GEMINI_API_KEY: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        hasVITE_GEMINI_API_KEY: !!process.env.VITE_GEMINI_API_KEY,
        nodeEnv: process.env.NODE_ENV,
      });
      return NextResponse.json(
        {
          error: 'OCR service is not configured. Please contact support.',
          code: 'CONFIGURATION_ERROR',
        },
        { status: 503 }
      );
    }

    // Log API key status (first 10 chars only for security)
    console.log('OCR API: GEMINI_API_KEY found', {
      keyPrefix: apiKey.substring(0, 10) + '...',
      keyLength: apiKey.length,
    });

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image file too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Process with Gemini Vision OCR (server-side, use GEMINI_API_KEY)
    const result = await extractBusinessCardWithGemini(imageFile, apiKey);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('OCR processing error:', error);

    // Handle quota errors with 429 status
    if (error instanceof GeminiQuotaError) {
      return NextResponse.json(
        {
          error: error.message,
          retryAfter: error.retryAfter,
          code: 'QUOTA_EXCEEDED',
        },
        {
          status: 429,
          headers: error.retryAfter
            ? {
                'Retry-After': String(error.retryAfter),
              }
            : undefined,
        }
      );
    }

    // Handle API key errors specifically
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to process image';

    if (errorMessage.includes('API key') || errorMessage.includes('required')) {
      return NextResponse.json(
        {
          error: 'OCR service configuration error. Please contact support.',
          code: 'CONFIGURATION_ERROR',
        },
        { status: 503 }
      );
    }

    const errorStack = error instanceof Error ? error.stack : undefined;

    // Log full error details for debugging (server-side only)
    console.error('OCR API error details:', {
      message: errorMessage,
      stack: errorStack,
      nodeEnv: process.env.NODE_ENV,
    });

    return NextResponse.json(
      {
        error: errorMessage,
        code: 'PROCESSING_ERROR',
        details:
          process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}
