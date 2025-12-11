/**
 * OCR Processing API Route
 * 
 * PDR Section: Technical Specifications - OCR Implementation
 * Processes business card images using Mindee OCR API
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractBusinessCardData } from '@/services/mindeeOcrService';

export const runtime = 'nodejs';
export const maxDuration = 30;

// This is a server-side API route, so we can use server env vars

export async function POST(request: NextRequest) {
  try {
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

    // Process with Mindee OCR (server-side, use MINDEE_API_KEY)
    const apiKey = process.env.MINDEE_API_KEY || process.env.NEXT_PUBLIC_MINDEE_API_KEY;
    const result = await extractBusinessCardData(imageFile, apiKey);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('OCR processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

