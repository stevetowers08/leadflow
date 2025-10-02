import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  StickyNote, 
  ExternalLink, 
  Globe, 
  Users,
  User,
  UserCheck,
  UserX,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { usePopupNavigation } from "@/contexts/PopupNavigationContext";
import type { RecentCompany } from "@/services/dashboardService";

interface RecentCompaniesTabsProps {
  companies: RecentCompany[];
  loading: boolean;
}

export const RecentCompaniesTabs: React.FC<RecentCompaniesTabsProps> = ({ companies, loading }) => {
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();
  const [activeTab, setActiveTab] = useState("unassigned");

  // Get company logo using Clearbit
  const getCompanyLogo = (company: RecentCompany) => {
    if (company.logo) return company.logo;
    if (!company.website) return null;
    const cleanWebsite = company.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    return `https://logo.clearbit.com/${cleanWebsite}`;
  };

  // Filter companies by assignment status and sort by date created
  const filteredCompanies = useMemo(() => {
    const sortByDate = (a: RecentCompany, b: RecentCompany) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

    const unassigned = companies
      .filter(company => !company.assigned_to)
      .sort(sortByDate);
    const assignedToMe = companies
      .filter(company => company.assigned_to === user?.id)
      .sort(sortByDate);
    const recentlyAssigned = companies
      .filter(company => company.assigned_to && company.assigned_to !== user?.id)
      .sort(sortByDate);

    return {
      unassigned,
      assignedToMe,
      recentlyAssigned
    };
  }, [companies, user?.id]);

  const formatEmployeeCount = (count?: number | null) => {
    if (!count) return null;
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  const getStageColor = (stage?: string | null) => {
    switch (stage?.toLowerCase()) {
      case 'new_lead':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'automated':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'meeting_scheduled':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'closed_won':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'closed_lost':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderCompanyCard = (company: RecentCompany) => (
    <div
      key={company.id}
      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
      onClick={() => openPopup('company', company.id, company.name)}
    >
      <div className="flex items-center gap-3">
        {/* Company Logo Only */}
        <div className="flex-shrink-0 w-8 h-8 rounded-md border border-gray-200 bg-white flex items-center justify-center">
          {getCompanyLogo(company) ? (
            <img
              src={getCompanyLogo(company)!}
              alt={company.name}
              className="w-full h-full rounded-md object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.display = 'none';
              }}
            />
          ) : (
            <Building2 className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        {/* Company Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{company.name}</div>
          <div className="text-xs text-gray-500 truncate">
            {company.industry && company.head_office ? `${company.industry} • ${company.head_office}` : company.industry || company.head_office || 'No industry'}
          </div>
        </div>
        
        {/* Stage, Employee Count and Notes */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {company.employee_count && (
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              <Users className="h-3 w-3" />
              <span>{formatEmployeeCount(company.employee_count)}</span>
            </div>
          )}
          {company.stage && (
            <Badge variant="outline" className={`text-xs ${getStageColor(company.stage)}`}>
              {company.stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          )}
          {company.notes_count && company.notes_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              <StickyNote className="h-3 w-3" />
              <span>{company.notes_count}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCompaniesList = (companiesList: RecentCompany[], emptyMessage: string) => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      );
    }

    if (companiesList.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {companiesList.slice(0, 5).map(renderCompanyCard)}
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
            <Building2 className="h-4 w-4 text-success" />
          </div>
          Recent Companies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unassigned" className="flex items-center gap-1">
              <UserX className="h-3 w-3" />
              Unassigned
              {filteredCompanies.unassigned.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredCompanies.unassigned.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="assignedToMe" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Mine
              {filteredCompanies.assignedToMe.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredCompanies.assignedToMe.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="recentlyAssigned" className="flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Assigned
              {filteredCompanies.recentlyAssigned.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredCompanies.recentlyAssigned.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unassigned" className="mt-4">
            {renderCompaniesList(
              filteredCompanies.unassigned,
              "No unassigned companies found"
            )}
          </TabsContent>
          
          <TabsContent value="assignedToMe" className="mt-4">
            {renderCompaniesList(
              filteredCompanies.assignedToMe,
              "No companies assigned to you"
            )}
          </TabsContent>
          
          <TabsContent value="recentlyAssigned" className="mt-4">
            {renderCompaniesList(
              filteredCompanies.recentlyAssigned,
              "No recently assigned companies"
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
