import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Building2, TrendingUp, Users } from 'lucide-react';
import React from 'react';

interface CompanyData {
  id: string;
  name: string;
  industry: string;
  people_count: number;
  interactions_count: number;
}

interface CompanyAutomationOverviewProps {
  topCompanies: CompanyData[];
}

const CompanyAutomationOverview: React.FC<CompanyAutomationOverviewProps> = ({
  topCompanies,
}) => {
  // Calculate automation metrics for companies
  const companiesWithMetrics = topCompanies.map(company => ({
    ...company,
    automationRate:
      company.people_count > 0
        ? Math.round((company.interactions_count / company.people_count) * 100)
        : 0,
    responseRate:
      company.interactions_count > 0
        ? Math.round(company.interactions_count * 0.15)
        : 0,
    meetingRate:
      company.interactions_count > 0
        ? Math.round(company.interactions_count * 0.03)
        : 0,
  }));

  const totalCompanies = companiesWithMetrics.length;
  const totalPeople = companiesWithMetrics.reduce(
    (sum, company) => sum + company.people_count,
    0
  );
  const totalInteractions = companiesWithMetrics.reduce(
    (sum, company) => sum + company.interactions_count,
    0
  );
  const avgAutomationRate =
    totalPeople > 0 ? Math.round((totalInteractions / totalPeople) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Building2 className='h-5 w-5' />
          Company Automation Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Summary Stats */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='text-center p-4 bg-primary/10 rounded-lg'>
              <Building2 className='h-8 w-8 text-primary mx-auto mb-2' />
              <div className='text-2xl font-bold text-blue-900'>
                {totalCompanies}
              </div>
              <div className='text-sm text-primary'>Total Companies</div>
            </div>
            <div className='text-center p-4 bg-success/10 rounded-lg'>
              <Users className='h-8 w-8 text-success mx-auto mb-2' />
              <div className='text-2xl font-bold text-green-900'>
                {totalPeople}
              </div>
              <div className='text-sm text-success'>Total People</div>
            </div>
            <div className='text-center p-4 bg-purple-50 rounded-lg'>
              <Bot className='h-8 w-8 text-primary mx-auto mb-2' />
              <div className='text-2xl font-bold text-purple-900'>
                {totalInteractions}
              </div>
              <div className='text-sm text-purple-700'>Total Interactions</div>
            </div>
            <div className='text-center p-4 bg-warning/10 rounded-lg'>
              <TrendingUp className='h-8 w-8 text-warning mx-auto mb-2' />
              <div className='text-2xl font-bold text-orange-900'>
                {avgAutomationRate}%
              </div>
              <div className='text-sm text-warning'>Avg Automation Rate</div>
            </div>
          </div>

          {/* Top Companies Table */}
          <div>
            <h4 className='font-semibold text-foreground mb-4'>
              Top Performing Companies
            </h4>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-border'>
                    <th className='text-left py-3 px-4 font-medium text-foreground'>
                      Company
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-foreground'>
                      Industry
                    </th>
                    <th className='text-center py-3 px-4 font-medium text-foreground'>
                      People
                    </th>
                    <th className='text-center py-3 px-4 font-medium text-foreground'>
                      Interactions
                    </th>
                    <th className='text-center py-3 px-4 font-medium text-foreground'>
                      Automation Rate
                    </th>
                    <th className='text-center py-3 px-4 font-medium text-foreground'>
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companiesWithMetrics.slice(0, 10).map((company, index) => (
                    <tr
                      key={company.id}
                      className='border-b border-gray-100 hover:bg-muted'
                    >
                      <td className='py-3 px-4'>
                        <div className='flex items-center gap-2'>
                          <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                            <Building2 className='h-4 w-4 text-primary' />
                          </div>
                          <span className='font-medium text-foreground'>
                            {company.name}
                          </span>
                        </div>
                      </td>
                      <td className='py-3 px-4 text-muted-foreground'>
                        {company.industry}
                      </td>
                      <td className='py-3 px-4 text-center'>
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-primary'>
                          {company.people_count}
                        </span>
                      </td>
                      <td className='py-3 px-4 text-center'>
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-success'>
                          {company.interactions_count}
                        </span>
                      </td>
                      <td className='py-3 px-4 text-center'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            company.automationRate >= 80
                              ? 'bg-green-100 text-success'
                              : company.automationRate >= 60
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-destructive'
                          }`}
                        >
                          {company.automationRate}%
                        </span>
                      </td>
                      <td className='py-3 px-4 text-center'>
                        <div className='flex items-center justify-center gap-1'>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              company.automationRate >= 80
                                ? 'bg-success/100'
                                : company.automationRate >= 60
                                  ? 'bg-warning/100'
                                  : 'bg-destructive/100'
                            }`}
                          />
                          <span className='text-xs text-muted-foreground'>
                            {company.automationRate >= 80
                              ? 'Excellent'
                              : company.automationRate >= 60
                                ? 'Good'
                                : 'Needs Improvement'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Industry Breakdown */}
          <div>
            <h4 className='font-semibold text-foreground mb-4'>
              Industry Performance
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Array.from(new Set(companiesWithMetrics.map(c => c.industry)))
                .slice(0, 6)
                .map(industry => {
                  const industryCompanies = companiesWithMetrics.filter(
                    c => c.industry === industry
                  );
                  const industryPeople = industryCompanies.reduce(
                    (sum, c) => sum + c.people_count,
                    0
                  );
                  const industryInteractions = industryCompanies.reduce(
                    (sum, c) => sum + c.interactions_count,
                    0
                  );
                  const industryRate =
                    industryPeople > 0
                      ? Math.round(
                          (industryInteractions / industryPeople) * 100
                        )
                      : 0;

                  return (
                    <div key={industry} className='p-4 bg-muted rounded-lg'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='font-medium text-foreground'>
                          {industry}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                          {industryCompanies.length} companies
                        </span>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>
                          {industryPeople} people
                        </span>
                        <span className='text-muted-foreground'>
                          {industryInteractions} interactions
                        </span>
                        <span
                          className={`font-medium ${
                            industryRate >= 80
                              ? 'text-success'
                              : industryRate >= 60
                                ? 'text-yellow-600'
                                : 'text-destructive'
                          }`}
                        >
                          {industryRate}%
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyAutomationOverview;
