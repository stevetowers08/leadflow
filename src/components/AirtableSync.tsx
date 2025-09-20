import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AirtableClient } from "@/lib/airtable";
import { supabase } from "@/integrations/supabase/client";
import { Download, Upload } from "lucide-react";

interface AirtableSyncProps {
  onSyncComplete?: () => void;
}

export function AirtableSync({ onSyncComplete }: AirtableSyncProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [baseId, setBaseId] = useState("");
  const [tableName, setTableName] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!baseId || !tableName) {
      toast({
        title: "Error",
        description: "Please provide both Base ID and Table Name",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);

    try {
      const airtable = new AirtableClient(baseId);
      const records = await airtable.listRecords(tableName);

      if (!records || records.length === 0) {
        toast({
          title: "No Data",
          description: "No records found in the Airtable",
        });
        return;
      }

      // Transform Airtable data to match our schema
      const companies = records.map((record: any) => ({
        name: record.fields.Name || record.fields.name || "Unknown Company",
        industry: record.fields.Industry || record.fields.industry || null,
        email: record.fields.Email || record.fields.email || null,
        phone: record.fields.Phone || record.fields.phone || null,
        website: record.fields.Website || record.fields.website || null,
        address: record.fields.Address || record.fields.address || null,
        status: record.fields.Status || record.fields.status || "prospect",
        notes: record.fields.Notes || record.fields.notes || null,
      }));

      // Insert into Supabase
      const { error } = await supabase
        .from("companies")
        .upsert(companies, { onConflict: "name" });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Synced ${companies.length} companies from Airtable`,
      });
      
      setIsDialogOpen(false);
      setBaseId("");
      setTableName("");
      onSyncComplete?.();
      
    } catch (error: any) {
      console.error("Sync error:", error);
      toast({
        title: "Sync Error",
        description: error.message || "Failed to sync data from Airtable",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs px-2">
          <Download className="h-3 w-3 mr-1" />
          Sync Airtable
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">Sync from Airtable</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSync} className="space-y-3">
          <div>
            <Label htmlFor="baseId" className="text-xs">Base ID</Label>
            <Input
              id="baseId"
              placeholder="appXXXXXXXXXXXXXX"
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
              className="h-8 text-xs"
              required
            />
          </div>
          <div>
            <Label htmlFor="tableName" className="text-xs">Table Name</Label>
            <Input
              id="tableName"
              placeholder="Companies"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="h-8 text-xs"
              required
            />
          </div>
          <div className="text-xs text-muted-foreground">
            This will sync data from your Airtable to Supabase. Existing companies with the same name will be updated.
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isSyncing}
              className="flex-1 h-8 text-xs"
            >
              {isSyncing ? (
                <>
                  <Upload className="h-3 w-3 mr-1 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Download className="h-3 w-3 mr-1" />
                  Sync Data
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}