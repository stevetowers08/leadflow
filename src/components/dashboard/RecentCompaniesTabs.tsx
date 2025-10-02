import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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

  // Filter companies by assignment status
  const filteredCompanies = useMemo(() => {
    const unassigned = companies.filter(company => !company.assigned_to);
    const assignedToMe = companies.filter(company => company.assigned_to === user?.id);
    const recentlyAssigned = companies.filter(company => 
      company.assigned_to && company.assigned_to !== user?.id
    );

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

  const renderCompanyCard = (company: RecentCompany) => (
    <div
      key={company.id}
      className="group p-4 bg-white rounded-lg border border-gray-200 hover:border-primary/20 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => openPopup('company', company.id, company.name)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900 truncate">{company.name}</h4>
            {company.notes_count && company.notes_count > 0 && (
              <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                <StickyNote className="h-3 w-3" />
                <span>{company.notes_count}</span>
              </div>
            )}
          </div>
          
          {company.industry && (
            <div className="text-sm text-gray-600 mb-1 truncate">
              {company.industry}
            </div>
          )}
          
          {company.website && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <Globe className="h-3 w-3" />
              <span className="truncate">{company.website.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
          
          {company.employee_count && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <Users className="h-3 w-3" />
              <span>{formatEmployeeCount(company.employee_count)} employees</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {company.stage && (
                <Badge variant="outline" className="text-xs">
                  {company.stage}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(company.created_at), { addSuffix: true })}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                openPopup('company', company.id, company.name);
              }}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {company.logo_url && (
          <div className="ml-3 flex-shrink-0">
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
            />
          </div>
        )}
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
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {companiesList.map(renderCompanyCard)}
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
