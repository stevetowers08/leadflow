import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Mail, Linkedin } from 'lucide-react';

const IntegrationsPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="h-20 border-b border-gray-200 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-purple-600" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Integrations</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Connect your favorite tools and services to streamline your workflow
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
        {/* Gmail Integration */}
        <Card className="h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Gmail</CardTitle>
                <CardDescription>
                  Sync emails and send messages
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <Badge variant="secondary">Not Connected</Badge>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Connect Gmail
            </Button>
          </CardContent>
        </Card>

        {/* LinkedIn Integration */}
        <Card className="h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Linkedin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">LinkedIn</CardTitle>
                <CardDescription>
                  Sync messages and track conversations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <Badge variant="secondary">Not Connected</Badge>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Connect LinkedIn
            </Button>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
