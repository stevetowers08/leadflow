'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2, AlertCircle, Camera } from 'lucide-react';
import dynamic from 'next/dynamic';
import { createLead } from '@/services/leadsService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { logger } from '@/utils/productionLogger';
import type { MindeeOcrResult } from '@/services/mindeeOcrService';

// Dynamically import react-webcam to avoid SSR issues
const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

/**
 * Mobile Scanner Page - PDR Section 4.1
 * 
 * OCR-only capture: Capture image → Process with Mindee OCR → Auto-save lead
 * No manual form entry required
 */
export default function CapturePage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [ocrResult, setOcrResult] = useState<MindeeOcrResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { user } = useAuth();

  const webcamRef = useRef<{ getScreenshot: () => string | null } | null>(null);

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setSaveStatus('idle');

    try {
      // Convert base64 data URL to blob for API
      let blob: Blob;
      if (imageData.startsWith('data:image')) {
        const response = await fetch(imageData);
        blob = await response.blob();
      } else {
        // If it's already a blob URL or file, handle accordingly
        throw new Error('Invalid image format');
      }
      
      // Call OCR API
      const formData = new FormData();
      formData.append('image', blob, 'business-card.jpg');

      const ocrResponse = await fetch('/api/ocr/process', {
        method: 'POST',
        body: formData,
      });

      if (!ocrResponse.ok) {
        throw new Error('OCR processing failed');
      }

      const response = await ocrResponse.json();
      if (!response.success || !response.data) {
        throw new Error('Invalid OCR response');
      }
      const data = response.data as MindeeOcrResult;
      setOcrResult(data);

      // Auto-save lead with OCR data
      await saveLead(data, imageData);
    } catch (error) {
      logger.error('OCR processing error:', error);
      setSaveStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      toast.error('Failed to process business card', {
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const saveLead = async (ocrData: MindeeOcrResult, imageUrl: string) => {
    setIsSaving(true);

    try {
      await createLead({
        first_name: ocrData.firstName || null,
        last_name: ocrData.lastName || null,
        email: ocrData.email || null,
        company: ocrData.companyName || null,
        job_title: ocrData.jobTitle || null,
        phone: ocrData.phone || null,
        scan_image_url: imageUrl,
        quality_rank: 'warm', // Default, can be updated later
        user_id: user?.id || null,
      });

      setSaveStatus('success');
      toast.success('Lead captured successfully!', {
        description: `${ocrData.fullName || 'Lead'} has been saved`,
      });

      // Reset after 2 seconds for next capture
      setTimeout(() => {
        setCapturedImage(null);
        setOcrResult(null);
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      logger.error('Save lead error:', error);
      setSaveStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      toast.error('Failed to save lead', {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        processImage(imageSrc);
      }
    }
  }, [processImage]);

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-black">
      {/* Layer 1: Camera Stream */}
      <div className="absolute inset-0 z-0">
        {!capturedImage && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="h-full w-full object-cover"
          />
        )}
        
        {/* Show captured image while processing */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured business card"
            className="h-full w-full object-cover"
          />
        )}
        
        {/* Guide Frame Overlay - Aspect Ratio 3.5:2 */}
        {!capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="aspect-[3.5/2] w-[85%] border-2 border-white/50 rounded-xl" />
          </div>
        )}
      </div>

      {/* Layer 2: Controls */}
      {/* Header */}
      <div className="absolute top-0 z-10 w-full h-16 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
        <div className="text-white font-semibold">LeadFlow</div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-white text-sm">Online</span>
        </div>
      </div>

      {/* Processing/Success Overlay */}
      {(isProcessing || isSaving || saveStatus !== 'idle') && (
        <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center">
          <Card className="w-[90%] max-w-md">
            <CardContent className="p-6 space-y-4 text-center">
              {isProcessing && (
                <>
                  <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                  <h3 className="text-lg font-semibold">Processing Business Card</h3>
                  <p className="text-sm text-muted-foreground">
                    Extracting contact details with OCR...
                  </p>
                </>
              )}
              
              {isSaving && (
                <>
                  <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                  <h3 className="text-lg font-semibold">Saving Lead</h3>
                  <p className="text-sm text-muted-foreground">
                    Adding to your leads...
                  </p>
                </>
              )}

              {saveStatus === 'success' && (
                <>
                  <CheckCircle2 className="h-12 w-12 mx-auto text-success" />
                  <h3 className="text-lg font-semibold">Lead Captured!</h3>
                  {ocrResult && (
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{ocrResult.fullName || 'Lead'}</p>
                      {ocrResult.companyName && (
                        <p className="text-muted-foreground">{ocrResult.companyName}</p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Ready for next capture...
                  </p>
                </>
              )}

              {saveStatus === 'error' && (
                <>
                  <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                  <h3 className="text-lg font-semibold">Processing Failed</h3>
                  <p className="text-sm text-muted-foreground">
                    Please try capturing again
                  </p>
                  <Button
                    onClick={() => {
                      setCapturedImage(null);
                      setOcrResult(null);
                      setSaveStatus('idle');
                    }}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer with Shutter Button */}
      {!isProcessing && !isSaving && saveStatus === 'idle' && (
        <div className="absolute bottom-0 z-10 w-full h-32 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center">
          <Button
            onClick={capture}
            disabled={isProcessing || isSaving}
            size="lg"
            className="size-20 rounded-full border-[6px] border-white/30 bg-white hover:bg-white/90 active:scale-95 transition-transform shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed p-0"
            aria-label="Capture business card"
          >
            <Camera className="h-8 w-8 text-foreground" />
          </Button>
        </div>
      )}
    </div>
  );
}







