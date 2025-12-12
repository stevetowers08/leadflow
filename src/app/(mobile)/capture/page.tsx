'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2, AlertCircle, Camera } from 'lucide-react';
import { createLead } from '@/services/leadsService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { logger } from '@/utils/productionLogger';
import type { BusinessCardData } from '@/services/geminiVisionOcrService';
import { compressImage } from '@/utils/imageCompression';

/**
 * Mobile Scanner Page - PDR Section 4.1
 * 
 * OCR-only capture: Capture image → Process with Gemini Vision → Auto-save lead
 * Uses native getUserMedia API for better stability and mobile support
 */
export default function CapturePage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [ocrResult, setOcrResult] = useState<BusinessCardData | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { user } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      // Check if HTTPS (required for getUserMedia except localhost)
      if (
        typeof window !== 'undefined' &&
        window.location.protocol !== 'https:' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1'
      ) {
        setCameraError('Camera requires HTTPS connection');
        toast.error('Camera access requires secure connection');
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Back camera on mobile
          width: { ideal: 1920, max: 3840 },
          height: { ideal: 1080, max: 2160 },
          aspectRatio: { ideal: 16 / 9 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        let errorMessage = 'Failed to access camera';
        let toastMessage = 'Camera error';
        let toastDescription = 'Please try again';
        let shouldLogAsError = true;
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          // Permission denial - user action, but still an error state for the app
          // Log as warning since it's user-initiated, not a system failure
          logger.warn('Camera permission denied by user');
          errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
          toastMessage = 'Camera Permission Required';
          toastDescription = 'Click "Retry Camera" and allow access when prompted';
          shouldLogAsError = false;
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage = 'No camera device found. Please connect a camera.';
          toastMessage = 'No Camera Found';
          toastDescription = 'Please connect a camera device';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage = 'Camera is already in use by another application.';
          toastMessage = 'Camera In Use';
          toastDescription = 'Close other apps using the camera and try again';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'Camera does not support the requested settings.';
          toastMessage = 'Camera Settings Error';
          toastDescription = 'Your camera may not support the requested resolution';
        } else {
          errorMessage = error.message || 'Failed to access camera';
          toastDescription = error.message || 'Please try again';
        }
        
        // Only log unexpected errors
        if (shouldLogAsError) {
          logger.error('Camera access error:', error);
        }
        
        setCameraError(errorMessage);
        toast.error(toastMessage, {
          description: toastDescription,
          duration: 5000,
        });
      } else {
        logger.error('Camera access error:', error);
        setCameraError('Failed to access camera');
        toast.error('Camera error', {
          description: 'Please try again',
        });
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const saveLead = useCallback(async (ocrData: BusinessCardData, imageUrl: string) => {
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
  }, [user?.id]);

  const processImage = useCallback(async (imageData: string) => {
    setIsProcessing(true);
    setSaveStatus('idle');

    try {
      // Compress image for faster upload and API processing
      const compressedImage = await compressImage(imageData, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.92,
      });

      // Call OCR API
      const formData = new FormData();
      const response = await fetch(compressedImage);
      const blob = await response.blob();
      formData.append('image', blob, 'business-card.jpg');

      const ocrResponse = await fetch('/api/ocr/process', {
        method: 'POST',
        body: formData,
      });

      if (!ocrResponse.ok) {
        const errorData = await ocrResponse.json().catch(() => ({}));
        throw new Error(
          errorData.error || `OCR processing failed: ${ocrResponse.statusText}`
        );
      }

      const responseData = await ocrResponse.json();
      if (!responseData.success || !responseData.data) {
        throw new Error('Invalid OCR response');
      }
      const data = responseData.data as BusinessCardData;
      setOcrResult(data);

      // Auto-save lead with OCR data
      await saveLead(data, compressedImage);
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
  }, [saveLead]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isCameraActive) {
      toast.error('Camera not ready', {
        description: 'Please wait for camera to initialize',
      });
      return;
    }

    try {
      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to data URL
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(imageData);
      processImage(imageData);
    } catch (error) {
      logger.error('Capture error:', error);
      toast.error('Failed to capture image', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [isCameraActive, processImage]);

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-black">
      {/* Layer 1: Camera Stream */}
      <div className="absolute inset-0 z-0">
        {!capturedImage && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <Card className="w-[90%] max-w-md">
                  <CardContent className="p-6 text-center space-y-4">
                    <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                    <h3 className="text-lg font-semibold">Camera Error</h3>
                    <p className="text-sm text-muted-foreground">{cameraError}</p>
                    <Button onClick={startCamera} className="mt-4">
                      Retry Camera
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
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
        {!capturedImage && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
      {!isProcessing && !isSaving && saveStatus === 'idle' && isCameraActive && !cameraError && (
        <div className="absolute bottom-0 z-10 w-full h-32 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center">
          <Button
            onClick={capture}
            disabled={isProcessing || isSaving || !isCameraActive}
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







