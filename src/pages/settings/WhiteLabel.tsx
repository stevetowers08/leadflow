import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from 'lucide-react';

const WhiteLabel = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Tag className="h-6 w-6 text-indigo-600" />
            <div>
              <CardTitle>White Label</CardTitle>
              <CardDescription>
                Customize branding and white label settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">White label customization features coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhiteLabel;

