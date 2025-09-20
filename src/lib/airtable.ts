import { supabase } from "@/integrations/supabase/client";

export interface AirtableRecord {
  id?: string;
  fields: Record<string, any>;
}

export class AirtableClient {
  private baseId: string;

  constructor(baseId: string) {
    this.baseId = baseId;
  }

  async listRecords(tableName: string): Promise<AirtableRecord[]> {
    const { data, error } = await supabase.functions.invoke('airtable-sync', {
      body: {
        baseId: this.baseId,
        tableName,
        action: 'list'
      }
    });

    if (error) throw error;
    return data.records || [];
  }

  async createRecords(tableName: string, records: AirtableRecord[]): Promise<AirtableRecord[]> {
    const { data, error } = await supabase.functions.invoke('airtable-sync', {
      body: {
        baseId: this.baseId,
        tableName,
        action: 'create',
        data: records
      }
    });

    if (error) throw error;
    return data.records || [];
  }

  async updateRecords(tableName: string, records: AirtableRecord[]): Promise<AirtableRecord[]> {
    const { data, error } = await supabase.functions.invoke('airtable-sync', {
      body: {
        baseId: this.baseId,
        tableName,
        action: 'update',
        data: records
      }
    });

    if (error) throw error;
    return data.records || [];
  }
}

// Example usage:
// const airtable = new AirtableClient('your-base-id');
// const records = await airtable.listRecords('Companies');