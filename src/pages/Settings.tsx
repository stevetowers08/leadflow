import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Automations from "./Automations";
import Reporting from "./Reporting";
import PersonalSettings from "./PersonalSettings";
import { Bot, BarChart3, Settings } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your automations, reports, and personal settings
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="automations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="automations" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Automations
          </TabsTrigger>
          <TabsTrigger value="reporting" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reporting
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="automations" className="mt-6">
          <Automations />
        </TabsContent>

        <TabsContent value="reporting" className="mt-6">
          <Reporting />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <PersonalSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
