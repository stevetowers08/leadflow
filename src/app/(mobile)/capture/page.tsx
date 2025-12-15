'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Camera,
  Settings,
  X,
} from 'lucide-react';
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
 *
 * Updated: Dec 2025 - Migrated from react-webcam to native getUserMedia
 * OCR: Google Gemini 2.0 Flash Vision API (free tier: 15 RPM, 1,500 RPD)
 *
 * Dec 2025 Best Practices Implemented:
 * ✅ Video validation (readyState, dimensions check)
 * ✅ Memory management (canvas cleanup)
 * ✅ Battery optimization (pause video during processing)
 * ✅ Accessibility (ARIA labels, keyboard support)
 * ✅ Error handling (timeout, network errors, retry guidance)
 * ✅ Performance (optimized canvas context, video constraints)
 * ✅ Security (HTTPS check, input validation)
 * ✅ Visual feedback (capture flash effect)
 */
export default function CapturePage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [ocrResult, setOcrResult] = useState<BusinessCardData | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showCaptureFlash, setShowCaptureFlash] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showName, setShowName] = useState<string>('');
  const [showDate, setShowDate] = useState<string>('');
  const { user } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRefs = useRef<{
    flashTimeout?: NodeJS.Timeout;
    processTimeout?: NodeJS.Timeout;
    resetTimeout?: NodeJS.Timeout;
  }>({});

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      // Cleanup all timeouts on unmount (bug fix: prevent memory leaks)
      if (timeoutRefs.current.flashTimeout) {
        clearTimeout(timeoutRefs.current.flashTimeout);
      }
      if (timeoutRefs.current.processTimeout) {
        clearTimeout(timeoutRefs.current.processTimeout);
      }
      if (timeoutRefs.current.resetTimeout) {
        clearTimeout(timeoutRefs.current.resetTimeout);
      }
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

      // Dec 2025 best practice: Optimized constraints for document scanning
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Back camera on mobile
          width: { ideal: 1920, max: 3840 },
          height: { ideal: 1080, max: 2160 },
          aspectRatio: { ideal: 16 / 9 },
          // Note: focusMode/exposureMode are experimental and not widely supported
          // Browser will use defaults (usually continuous auto-focus/exposure)
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

        if (
          error.name === 'NotAllowedError' ||
          error.name === 'PermissionDeniedError'
        ) {
          // Permission denial - user action, but still an error state for the app
          // Log as warning since it's user-initiated, not a system failure
          logger.warn('Camera permission denied by user');
          errorMessage =
            'Camera permission denied. Please allow camera access in your browser settings.';
          toastMessage = 'Camera Permission Required';
          toastDescription =
            'Click "Retry Camera" and allow access when prompted';
          shouldLogAsError = false;
        } else if (
          error.name === 'NotFoundError' ||
          error.name === 'DevicesNotFoundError'
        ) {
          errorMessage = 'No camera device found. Please connect a camera.';
          toastMessage = 'No Camera Found';
          toastDescription = 'Please connect a camera device';
        } else if (
          error.name === 'NotReadableError' ||
          error.name === 'TrackStartError'
        ) {
          errorMessage = 'Camera is already in use by another application.';
          toastMessage = 'Camera In Use';
          toastDescription = 'Close other apps using the camera and try again';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'Camera does not support the requested settings.';
          toastMessage = 'Camera Settings Error';
          toastDescription =
            'Your camera may not support the requested resolution';
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
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const saveLead = useCallback(
    async (ocrData: BusinessCardData, imageUrl: string) => {
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
          show_name: showName || null,
          show_date: showDate || null,
          user_id: user?.id || null,
        });

        setSaveStatus('success');
        toast.success('Lead captured successfully!', {
          description: `${ocrData.fullName || 'Lead'} has been saved`,
        });

        // Reset after 2 seconds for next capture
        // Bug fix: Store timeout ref for cleanup
        if (timeoutRefs.current.resetTimeout) {
          clearTimeout(timeoutRefs.current.resetTimeout);
        }
        timeoutRefs.current.resetTimeout = setTimeout(() => {
          setCapturedImage(null);
          setOcrResult(null);
          setSaveStatus('idle');
          // Re-enable video track for next capture (Dec 2025 best practice)
          if (streamRef.current) {
            streamRef.current.getVideoTracks().forEach(track => {
              track.enabled = true;
            });
          }
          timeoutRefs.current.resetTimeout = undefined;
        }, 2000);
      } catch (error) {
        logger.error('Save lead error:', error);
        setSaveStatus('error');
        const errorMessage =
          error instanceof Error ? error.message : 'Please try again';
        toast.error('Failed to save lead', {
          description: errorMessage,
        });
      } finally {
        setIsSaving(false);
      }
    },
    [user?.id, showName, showDate]
  );

  const processImage = useCallback(
    async (imageData: string) => {
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

        // Dec 2025 best practice: Add timeout and AbortController for network requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        let ocrResponse: Response;
        try {
          ocrResponse = await fetch('/api/ocr/process', {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
        } catch (fetchError) {
          // Bug fix: Always clear timeout, even on error
          clearTimeout(timeoutId);
          throw fetchError;
        }

        if (!ocrResponse.ok) {
          const errorData = await ocrResponse.json().catch(() => ({}));

          // Provide more specific error messages based on status code
          let errorMessage =
            errorData.error ||
            `OCR processing failed: ${ocrResponse.statusText}`;

          if (ocrResponse.status === 503) {
            errorMessage =
              'OCR service is temporarily unavailable. Please try again later or contact support.';
          } else if (ocrResponse.status === 429) {
            errorMessage =
              errorData.error ||
              'OCR service rate limit exceeded. Please try again in a moment.';
          } else if (ocrResponse.status >= 500) {
            errorMessage =
              'OCR service error. Please try again or contact support if the issue persists.';
          }

          throw new Error(errorMessage);
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

        // Dec 2025 best practice: Better error handling with retry guidance
        let errorMessage = 'Please try again';
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            errorMessage =
              'Request timed out. Please check your connection and try again.';
          } else if (
            error.message.includes('network') ||
            error.message.includes('fetch') ||
            error.message.includes('Failed to fetch')
          ) {
            // More specific network error message
            errorMessage =
              'Unable to connect to OCR service. Please check your internet connection and try again.';
          } else if (
            error.message.includes('service') ||
            error.message.includes('unavailable')
          ) {
            // Service configuration errors
            errorMessage = error.message;
          } else {
            errorMessage = error.message;
          }
        }

        toast.error('Failed to process business card', {
          description: errorMessage,
        });

        // Re-enable video track on error for retry
        if (streamRef.current) {
          streamRef.current.getVideoTracks().forEach(track => {
            track.enabled = true;
          });
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [saveLead]
  );

  const capture = useCallback(() => {
    // Bug fix: Prevent multiple simultaneous captures
    if (isProcessing || isSaving) {
      return;
    }

    const video = videoRef.current;
    if (!video || !isCameraActive) {
      toast.error('Camera not ready', {
        description: 'Please wait for camera to initialize',
      });
      return;
    }

    // Validate video is ready (Dec 2025 best practice)
    if (video.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
      toast.error('Video not ready', {
        description: 'Please wait for camera to stabilize',
      });
      return;
    }

    // Validate video dimensions (Dec 2025 best practice)
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error('Invalid video dimensions', {
        description: 'Please try again',
      });
      return;
    }

    try {
      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', {
        willReadFrequently: false, // Performance optimization
        alpha: false, // No transparency needed for photos
      });

      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to data URL
      const imageData = canvas.toDataURL('image/jpeg', 0.95);

      // Cleanup canvas immediately (Dec 2025 best practice - prevent memory leaks)
      canvas.width = 0;
      canvas.height = 0;

      // Pause video stream during processing (Dec 2025 best practice - battery optimization)
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach(track => {
          track.enabled = false; // Disable track to save battery
        });
      }

      // Show capture flash effect
      // Bug fix: Cleanup previous timeouts to prevent race conditions
      if (timeoutRefs.current.flashTimeout) {
        clearTimeout(timeoutRefs.current.flashTimeout);
      }
      if (timeoutRefs.current.processTimeout) {
        clearTimeout(timeoutRefs.current.processTimeout);
      }

      setShowCaptureFlash(true);
      timeoutRefs.current.flashTimeout = setTimeout(() => {
        setShowCaptureFlash(false);
        timeoutRefs.current.flashTimeout = undefined;
      }, 200);

      // Small delay to show flash before switching to captured image
      timeoutRefs.current.processTimeout = setTimeout(() => {
        setCapturedImage(imageData);
        processImage(imageData);
        timeoutRefs.current.processTimeout = undefined;
      }, 100);
    } catch (error) {
      logger.error('Capture error:', error);
      toast.error('Failed to capture image', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      // Re-enable video track on error
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach(track => {
          track.enabled = true;
        });
      }
    }
  }, [isCameraActive, processImage, isProcessing, isSaving]);

  return (
    <div className='relative h-[100dvh] w-screen overflow-hidden bg-black'>
      {/* Layer 1: Camera Stream */}
      <div className='absolute inset-0 z-0'>
        {!capturedImage && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className='h-full w-full object-cover'
              aria-label='Camera preview for business card capture'
            />
            {cameraError && (
              <div className='absolute inset-0 flex items-center justify-center bg-black/80'>
                <Card className='w-[90%] max-w-md'>
                  <CardContent className='p-6 text-center space-y-4'>
                    <AlertCircle className='h-12 w-12 mx-auto text-destructive' />
                    <h3 className='text-lg font-semibold'>Camera Error</h3>
                    <p className='text-sm text-muted-foreground'>
                      {cameraError}
                    </p>
                    <Button onClick={startCamera} className='mt-4'>
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
            alt='Captured business card'
            className='h-full w-full object-cover'
          />
        )}

        {/* Guide Frame Overlay - Aspect Ratio 3.5:2 */}
        {!capturedImage && !cameraError && (
          <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
            <div className='aspect-[3.5/2] w-[85%] border-2 border-white/50 rounded-xl' />
          </div>
        )}

        {/* Capture Flash Effect */}
        {showCaptureFlash && (
          <div className='absolute inset-0 bg-white animate-flash pointer-events-none z-10' />
        )}
      </div>

      {/* Layer 2: Controls */}
      {/* Header */}
      <div className='absolute top-0 z-10 w-full h-16 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between'>
        <div className='text-white font-semibold'>LeadFlow</div>
        <div className='flex items-center gap-3'>
          {(showName || showDate) && (
            <div className='text-white text-xs bg-white/20 px-2 py-1 rounded'>
              {showName || 'Show'}
            </div>
          )}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setShowSettings(true)}
            className='text-white hover:bg-white/20'
            aria-label='Show settings'
          >
            <Settings className='h-5 w-5' />
          </Button>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
            <span className='text-white text-sm'>Online</span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className='absolute inset-0 z-30 bg-black/90 flex items-center justify-center p-4'>
          <Card className='w-full max-w-md'>
            <CardContent className='p-6 space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>
                  Exhibition Show Settings
                </h3>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowSettings(false)}
                  aria-label='Close settings'
                >
                  <X className='h-5 w-5' />
                </Button>
              </div>
              <p className='text-sm text-muted-foreground'>
                Set the show name and date for all leads captured in this
                session.
              </p>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <label htmlFor='show-name' className='text-sm font-medium'>
                    Show Name
                  </label>
                  <Input
                    id='show-name'
                    placeholder='e.g., Tech Expo 2025'
                    value={showName}
                    onChange={e => setShowName(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='show-date' className='text-sm font-medium'>
                    Show Date
                  </label>
                  <Input
                    id='show-date'
                    type='date'
                    value={showDate}
                    onChange={e => setShowDate(e.target.value)}
                  />
                </div>
              </div>
              <div className='flex gap-2 pt-2'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setShowName('');
                    setShowDate('');
                  }}
                  className='flex-1'
                >
                  Clear
                </Button>
                <Button
                  onClick={() => setShowSettings(false)}
                  className='flex-1'
                >
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Processing/Success Overlay */}
      {(isProcessing || isSaving || saveStatus !== 'idle') && (
        <div className='absolute inset-0 z-20 bg-black/80 flex items-center justify-center'>
          <Card className='w-[90%] max-w-md'>
            <CardContent className='p-6 space-y-4 text-center'>
              {isProcessing && (
                <>
                  <Loader2 className='h-12 w-12 mx-auto animate-spin text-primary' />
                  <h3 className='text-lg font-semibold'>
                    Processing Business Card
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Extracting contact details with OCR...
                  </p>
                </>
              )}

              {isSaving && (
                <>
                  <Loader2 className='h-12 w-12 mx-auto animate-spin text-primary' />
                  <h3 className='text-lg font-semibold'>Saving Lead</h3>
                  <p className='text-sm text-muted-foreground'>
                    Adding to your leads...
                  </p>
                </>
              )}

              {saveStatus === 'success' && (
                <>
                  <CheckCircle2 className='h-12 w-12 mx-auto text-success' />
                  <h3 className='text-lg font-semibold'>Lead Captured!</h3>
                  {ocrResult && (
                    <div className='text-sm space-y-1'>
                      <p className='font-medium'>
                        {ocrResult.fullName || 'Lead'}
                      </p>
                      {ocrResult.companyName && (
                        <p className='text-muted-foreground'>
                          {ocrResult.companyName}
                        </p>
                      )}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground mt-2'>
                    Ready for next capture...
                  </p>
                </>
              )}

              {saveStatus === 'error' && (
                <>
                  <AlertCircle className='h-12 w-12 mx-auto text-destructive' />
                  <h3 className='text-lg font-semibold'>Processing Failed</h3>
                  <p className='text-sm text-muted-foreground'>
                    Please try capturing again
                  </p>
                  <Button
                    onClick={() => {
                      setCapturedImage(null);
                      setOcrResult(null);
                      setSaveStatus('idle');
                      // Bug fix: Re-enable video track when retrying
                      if (streamRef.current) {
                        streamRef.current.getVideoTracks().forEach(track => {
                          track.enabled = true;
                        });
                      }
                    }}
                    className='mt-4'
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
      {!isProcessing &&
        !isSaving &&
        saveStatus === 'idle' &&
        isCameraActive &&
        !cameraError && (
          <div className='absolute bottom-0 z-10 w-full h-32 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center'>
            <Button
              onClick={capture}
              disabled={isProcessing || isSaving || !isCameraActive}
              size='lg'
              className='size-20 rounded-full border-[6px] border-white/30 bg-white hover:bg-white/90 active:scale-95 transition-transform shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed p-0'
              aria-label='Capture business card'
              aria-describedby='capture-button-description'
              onKeyDown={e => {
                // Dec 2025 best practice: Keyboard accessibility
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!isProcessing && !isSaving && isCameraActive) {
                    capture();
                  }
                }
              }}
            >
              <Camera className='h-8 w-8 text-foreground' />
              <span id='capture-button-description' className='sr-only'>
                Press Enter or Space to capture business card image
              </span>
            </Button>
          </div>
        )}
    </div>
  );
}
