'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Mic } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import react-webcam to avoid SSR issues
const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

/**
 * Mobile Scanner Page - PDR Section 4.1
 * 
 * Full viewport camera interface for business card capture
 * Auto-opens enrichment drawer after capture
 */
export default function CapturePage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    job: '',
    company: '',
    qualityRank: 'warm' as 'hot' | 'warm' | 'cold',
    notes: '',
  });

  const webcamRef = useRef<typeof Webcam>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = (webcamRef.current as any).getScreenshot();
      setCapturedImage(imageSrc);
      setIsDrawerOpen(true);
      setIsProcessing(true);
      
      // Simulate AI processing (2.5s per PDR)
      setTimeout(() => {
        setIsProcessing(false);
      }, 2500);
    }
  }, [webcamRef]);

  const handleSyncAndAutomate = () => {
    // TODO: Implement sync and automation logic
    console.log('Sync & Automate', { formData, capturedImage });
  };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-black">
      {/* Layer 1: Camera Stream */}
      <div className="absolute inset-0 z-0">
        {typeof window !== 'undefined' && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="h-full w-full object-cover"
          />
        )}
        
        {/* Guide Frame Overlay - Aspect Ratio 3.5:2 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="aspect-[3.5/2] w-[85%] border-2 border-white/50 rounded-lg" />
        </div>
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

      {/* Footer with Shutter Button */}
      <div className="absolute bottom-0 z-10 w-full h-32 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center">
        <button
          onClick={capture}
          className="size-20 rounded-full border-[6px] border-zinc-200/30 bg-white active:scale-95 transition-transform shadow-2xl"
          aria-label="Capture business card"
        />
      </div>

      {/* Enrichment Drawer - PDR Section 4.2 */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Enrich Lead</DrawerTitle>
          </DrawerHeader>
          
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Image Preview - Aspect Ratio 16/9 */}
            {capturedImage && (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-zinc-100">
                <img
                  src={capturedImage}
                  alt="Captured business card"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Form Group: Identity */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Identity</h3>
              
              {isProcessing ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <Input
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    placeholder="Job Title"
                    value={formData.job}
                    onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                  />
                  <Input
                    placeholder="Company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </>
              )}
            </div>

            {/* Form Group: Context */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Context</h3>
              
              {/* Lead Rank ToggleGroup */}
              <ToggleGroup
                type="single"
                value={formData.qualityRank}
                onValueChange={(value) => {
                  if (value) setFormData({ ...formData, qualityRank: value as 'hot' | 'warm' | 'cold' });
                }}
                className="w-full"
              >
                <ToggleGroupItem
                  value="hot"
                  className="flex-1 data-[state=on]:bg-rose-100 data-[state=on]:text-rose-700"
                >
                  🔥 Hot
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="warm"
                  className="flex-1 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700"
                >
                  🌤️ Warm
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="cold"
                  className="flex-1 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
                >
                  ❄️ Cold
                </ToggleGroupItem>
              </ToggleGroup>

              {/* Notes with Voice Transcription */}
              <div className="relative">
                <Textarea
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-[100px] bg-zinc-50 pr-12"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-2 right-2"
                  onClick={() => {
                    // TODO: Implement Web Speech API
                    console.log('Voice transcription');
                  }}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Footer Action */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleSyncAndAutomate}
            >
              Sync & Automate
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

