import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';

const VoiceCloner = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mic className="h-6 w-6 text-orange-600" />
            <div>
              <CardTitle>Voice Cloner</CardTitle>
              <CardDescription>
                Configure voice cloning settings and models
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Voice cloning features coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceCloner;

