// Quick Database Query Tool
import { supabase } from '@/integrations/supabase/client';

export class DatabaseQueryTool {
  static async quickQuery(query: string, params?: any[]) {
    try {
      const { data, error } = await supabase.rpc('execute_sql', {
        query,
        params: params || [],
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  static async getTableStats(tableName: string) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count;
    } catch (error) {
      console.error(`Error getting stats for ${tableName}:`, error);
      return 0;
    }
  }

  static async getColumnValues(tableName: string, columnName: string) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select(columnName)
        .not(columnName, 'is', null);

      if (error) throw error;

      const uniqueValues = [...new Set(data?.map(row => row[columnName]))];
      return uniqueValues.sort();
    } catch (error) {
      console.error(
        `Error getting values for ${tableName}.${columnName}:`,
        error
      );
      return [];
    }
  }

  static async getRecentRecords(tableName: string, limit: number = 5) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error getting recent records from ${tableName}:`, error);
      return [];
    }
  }
}

// Convenience functions
export const dbQuery = DatabaseQueryTool;

// Example usage:
// const peopleCount = await dbQuery.getTableStats('people');
// const stages = await dbQuery.getColumnValues('people', 'stage');
// const recentPeople = await dbQuery.getRecentRecords('people', 10);
