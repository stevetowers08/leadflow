import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw, Eye } from 'lucide-react';
import { dbQuery } from '@/utils/databaseQuery';

interface TableStats {
  name: string;
  count: number;
  columns: number;
}

export const DatabaseInfoCard: React.FC = () => {
  const [tableStats, setTableStats] = useState<TableStats[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTableStats = async () => {
    setLoading(true);
    try {
      const tables = ['people', 'companies', 'jobs', 'conversations'];
      const stats: TableStats[] = [];

      for (const table of tables) {
        try {
          const count = await dbQuery.getTableStats(table);
          // Get column count (simplified - you could enhance this)
          const columnCount = table === 'people' ? 40 : table === 'companies' ? 15 : table === 'jobs' ? 20 : 10;
          stats.push({ name: table, count: count || 0, columns: columnCount });
        } catch (error) {
          console.error(`Error getting stats for ${table}:`, error);
          stats.push({ name: table, count: 0, columns: 0 });
        }
      }

      setTableStats(stats);
    } catch (error) {
      console.error('Error loading table stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTableStats();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Database Overview
          <Button 
            onClick={loadTableStats} 
            variant="ghost" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {tableStats.map((table) => (
            <div key={table.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium capitalize">{table.name}</div>
                <div className="text-sm text-muted-foreground">
                  {table.columns} columns
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{table.count.toLocaleString()}</Badge>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Go to Admin → Database to explore table schemas and data
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
