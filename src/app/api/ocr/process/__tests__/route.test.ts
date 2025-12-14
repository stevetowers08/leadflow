/**
 * OCR Process API Route Tests
 * Tests for business card OCR processing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';
import * as geminiService from '@/services/geminiVisionOcrService';

vi.mock('@/services/geminiVisionOcrService', () => ({
  extractBusinessCardWithGemini: vi.fn(),
}));

describe('POST /api/ocr/process', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-api-key';
  });

  it('should process a valid image file', async () => {
    const mockImageFile = new File(['test'], 'business-card.jpg', {
      type: 'image/jpeg',
    });

    const mockResult: geminiService.BusinessCardData = {
      fullName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: null,
      companyName: 'Acme Corp',
      jobTitle: null,
      website: null,
    };

    vi.mocked(geminiService.extractBusinessCardWithGemini).mockResolvedValue(
      mockResult
    );

    const formData = new FormData();
    formData.append('image', mockImageFile);

    // Create a mock request with FormData
    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockResult);
  });

  it('should return 400 if no image file provided', async () => {
    const formData = new FormData();

    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('No image file provided');
  });

  it('should return 400 if file is not an image', async () => {
    const mockFile = new File(['test'], 'document.pdf', {
      type: 'application/pdf',
    });

    const formData = new FormData();
    formData.append('image', mockFile);

    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('File must be an image');
  });

  it('should return 400 if file is too large', async () => {
    const largeBuffer = new ArrayBuffer(11 * 1024 * 1024); // 11MB
    const mockFile = new File([largeBuffer], 'large-image.jpg', {
      type: 'image/jpeg',
    });

    const formData = new FormData();
    formData.append('image', mockFile);

    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Image file too large. Maximum size is 10MB');
  });

  it('should return 500 on processing error', async () => {
    const mockImageFile = new File(['test'], 'business-card.jpg', {
      type: 'image/jpeg',
    });

    vi.mocked(geminiService.extractBusinessCardWithGemini).mockRejectedValue(
      new Error('OCR processing failed')
    );

    const formData = new FormData();
    formData.append('image', mockImageFile);

    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('OCR processing failed');
  });
});
