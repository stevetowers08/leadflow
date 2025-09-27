import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { DataTable } from "@/components/DataTable";

const TestJobsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jobs Test Page</h1>
        <p className="text-muted-foreground">
          Testing Jobs page components one by one
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testing Card Components</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-2">This uses Card components from UI library</p>
          <p className="text-green-600">✅ Card components working!</p>
          
          <div className="mt-4">
            <p className="text-gray-600 mb-2">Testing StatusBadge component:</p>
            <StatusBadge status="active" />
            <p className="text-green-600 mt-2">✅ StatusBadge component working!</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔧 Testing Fixed DataTable Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-2">Testing the fixed DataTable component:</p>
          <DataTable 
            data={[]} 
            columns={[]} 
            onRowClick={() => {}} 
          />
          <p className="text-green-600 mt-2">✅ Fixed DataTable component working!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestJobsPage;
