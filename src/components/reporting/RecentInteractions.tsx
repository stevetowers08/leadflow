import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface RecentInteractionsProps {
  recentInteractions: Array<{
    id: string;
    type: string;
    description: string;
    occurred_at: string;
    person_name: string;
    company_name: string;
  }>;
}

export const RecentInteractions: React.FC<RecentInteractionsProps> = ({ recentInteractions }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      email: 'bg-blue-100 text-blue-800',
      call: 'bg-green-100 text-green-800',
      meeting: 'bg-purple-100 text-purple-800',
      linkedin: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type.toLowerCase()] || colors.other;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Recent Interactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Person</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInteractions.map((interaction) => (
                <TableRow key={interaction.id}>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(interaction.type)}`}>
                      {interaction.type}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {interaction.description}
                  </TableCell>
                  <TableCell>{interaction.person_name}</TableCell>
                  <TableCell>{interaction.company_name}</TableCell>
                  <TableCell>{formatDate(interaction.occurred_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
