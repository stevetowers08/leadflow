import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Table, Eye, Download, RefreshCw } from 'lucide-react';
import { dbSchema, getTableInfo, getAllTables, exportSchema } from '@/utils/databaseSchema';
import { useToast } from '@/hooks/use-toast';

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

export const DatabaseExplorer: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      const tableList = await getAllTables();
      setTables(tableList);
      if (tableList.length > 0) {
        setSelectedTable(tableList[0]);
        await loadTableInfo(tableList[0]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tables",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTableInfo = async (tableName: string) => {
    setLoading(true);
    try {
      const info = await getTableInfo(tableName);
      setTableInfo(info);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to load info for ${tableName}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    loadTableInfo(tableName);
  };

  const handleExportSchema = async () => {
    try {
      const markdown = await exportSchema();
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database-schema-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Schema exported successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export schema",
        variant: "destructive"
      });
    }
  };

  const filteredTables = tables.filter(table => 
    table.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Database Explorer</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadTables} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportSchema} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Schema
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                Database Tables ({tables.length})
              </CardTitle>
              <Input
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredTables.map((table) => (
                    <Button
                      key={table}
                      variant={selectedTable === table ? "default" : "outline"}
                      onClick={() => handleTableSelect(table)}
                      className="justify-start h-auto p-3"
                    >
                      <div className="text-left">
                        <div className="font-medium">{table}</div>
                        <div className="text-xs text-muted-foreground">
                          Click to explore
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          {tableInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {selectedTable} Schema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Columns */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Columns ({tableInfo.columns.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-3 py-2 text-left">Column</th>
                          <th className="border border-gray-200 px-3 py-2 text-left">Type</th>
                          <th className="border border-gray-200 px-3 py-2 text-left">Nullable</th>
                          <th className="border border-gray-200 px-3 py-2 text-left">Default</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableInfo.columns.map((col) => (
                          <tr key={col.column_name}>
                            <td className="border border-gray-200 px-3 py-2 font-medium">
                              {col.column_name}
                            </td>
                            <td className="border border-gray-200 px-3 py-2">
                              <Badge variant="outline">{col.data_type}</Badge>
                            </td>
                            <td className="border border-gray-200 px-3 py-2">
                              <Badge variant={col.is_nullable === 'YES' ? 'secondary' : 'default'}>
                                {col.is_nullable}
                              </Badge>
                            </td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-muted-foreground">
                              {col.column_default || 'NULL'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sample Data */}
                {tableInfo.sample_data && tableInfo.sample_data.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Sample Data</h3>
                    <ScrollArea className="h-64 border rounded-md">
                      <pre className="p-4 text-sm">
                        {JSON.stringify(tableInfo.sample_data, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
