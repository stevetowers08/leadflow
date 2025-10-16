// Database Schema Documentation Tool
import { supabase } from '@/integrations/supabase/client';

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

interface TableInfo {
  table_name: string;
  columns: ColumnInfo[];
  sample_data?: any[];
}

export class DatabaseSchemaExplorer {
  private static instance: DatabaseSchemaExplorer;

  static getInstance(): DatabaseSchemaExplorer {
    if (!DatabaseSchemaExplorer.instance) {
      DatabaseSchemaExplorer.instance = new DatabaseSchemaExplorer();
    }
    return DatabaseSchemaExplorer.instance;
  }

  async getTableSchema(tableName: string): Promise<TableInfo> {
    try {
      // Get column information
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_name', tableName)
        .eq('table_schema', 'public');

      if (columnsError) throw columnsError;

      // Get sample data (first 3 rows)
      const { data: sampleData, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);

      if (sampleError) throw sampleError;

      return {
        table_name: tableName,
        columns: columns || [],
        sample_data: sampleData || [],
      };
    } catch (error) {
      console.error(`Error getting schema for ${tableName}:`, error);
      throw error;
    }
  }

  async getAllTables(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .neq('table_name', 'information_schema')
        .order('table_name');

      if (error) throw error;
      return data?.map(row => row.table_name) || [];
    } catch (error) {
      console.error('Error getting all tables:', error);
      throw error;
    }
  }

  async getEnumValues(enumName: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.rpc('get_enum_values', {
        enum_name: enumName,
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error getting enum values for ${enumName}:`, error);
      return [];
    }
  }

  async generateFullSchema(): Promise<Record<string, TableInfo>> {
    const tables = await this.getAllTables();
    const schema: Record<string, TableInfo> = {};

    for (const tableName of tables) {
      try {
        schema[tableName] = await this.getTableSchema(tableName);
      } catch (error) {
        console.error(`Failed to get schema for ${tableName}:`, error);
      }
    }

    return schema;
  }

  async exportSchemaAsMarkdown(): Promise<string> {
    const schema = await this.generateFullSchema();

    let markdown = '# Database Schema Documentation\n\n';
    markdown += `Generated on: ${new Date().toISOString()}\n\n`;

    for (const [tableName, tableInfo] of Object.entries(schema)) {
      markdown += `## Table: ${tableName}\n\n`;

      // Columns
      markdown += '### Columns\n\n';
      markdown += '| Column | Type | Nullable | Default |\n';
      markdown += '|--------|------|----------|----------|\n';

      tableInfo.columns.forEach(col => {
        markdown += `| ${col.column_name} | ${col.data_type} | ${col.is_nullable} | ${col.column_default || 'NULL'} |\n`;
      });

      // Sample data
      if (tableInfo.sample_data && tableInfo.sample_data.length > 0) {
        markdown += '\n### Sample Data\n\n';
        markdown += '```json\n';
        markdown += JSON.stringify(tableInfo.sample_data, null, 2);
        markdown += '\n```\n';
      }

      markdown += '\n---\n\n';
    }

    return markdown;
  }
}

// Utility functions for easy access
export const dbSchema = DatabaseSchemaExplorer.getInstance();

export async function getTableInfo(tableName: string) {
  return await dbSchema.getTableSchema(tableName);
}

export async function getAllTables() {
  return await dbSchema.getAllTables();
}

export async function exportSchema() {
  return await dbSchema.exportSchemaAsMarkdown();
}
