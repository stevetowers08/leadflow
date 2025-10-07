import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface TopCompaniesProps {
  topCompanies: Array<{
    id: string;
    name: string;
    industry: string;
    people_count: number;
    interactions_count: number;
  }>;
}

export const TopCompanies: React.FC<TopCompaniesProps> = ({ topCompanies }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Top Companies by Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>People</TableHead>
                <TableHead>Interactions</TableHead>
                <TableHead>Activity Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCompanies.map((company) => {
                const activityScore = company.people_count + company.interactions_count;
                return (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>{company.people_count}</TableCell>
                    <TableCell>{company.interactions_count}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (activityScore / 50) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{activityScore}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
