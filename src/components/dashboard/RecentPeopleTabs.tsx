import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  StickyNote, 
  ExternalLink, 
  Mail, 
  MapPin, 
  Building2,
  User,
  UserCheck,
  UserX
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { usePopupNavigation } from "@/contexts/PopupNavigationContext";
import type { RecentPerson } from "@/services/dashboardService";

interface RecentPeopleTabsProps {
  people: RecentPerson[];
  loading: boolean;
}

export const RecentPeopleTabs: React.FC<RecentPeopleTabsProps> = ({ people, loading }) => {
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();
  const [activeTab, setActiveTab] = useState("unassigned");

  // Filter people by assignment status
  const filteredPeople = useMemo(() => {
    const unassigned = people.filter(person => !person.assigned_to);
    const assignedToMe = people.filter(person => person.assigned_to === user?.id);
    const recentlyAssigned = people.filter(person => 
      person.assigned_to && person.assigned_to !== user?.id
    );

    return {
      unassigned,
      assignedToMe,
      recentlyAssigned
    };
  }, [people, user?.id]);

  const renderPersonCard = (person: RecentPerson) => (
    <div
      key={person.id}
      className="group p-4 bg-white rounded-lg border border-gray-200 hover:border-primary/20 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => openPopup('lead', person.id, person.name)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900 truncate">{person.name}</h4>
            {person.notes_count && person.notes_count > 0 && (
              <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                <StickyNote className="h-3 w-3" />
                <span>{person.notes_count}</span>
              </div>
            )}
          </div>
          
          {person.email_address && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <Mail className="h-3 w-3" />
              <span className="truncate">{person.email_address}</span>
            </div>
          )}
          
          {person.company_name && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{person.company_name}</span>
            </div>
          )}
          
          {person.company_role && (
            <div className="text-sm text-gray-500 mb-1 truncate">
              {person.company_role}
            </div>
          )}
          
          {person.employee_location && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{person.employee_location}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {person.stage && (
                <Badge variant="outline" className="text-xs">
                  {person.stage}
                </Badge>
              )}
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(person.created_at), { addSuffix: true })}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                openPopup('lead', person.id, person.name);
              }}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {person.company_logo_url && (
          <div className="ml-3 flex-shrink-0">
            <img
              src={person.company_logo_url}
              alt={person.company_name || "Company"}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderPeopleList = (peopleList: RecentPerson[], emptyMessage: string) => {
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

    if (peopleList.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {peopleList.map(renderPersonCard)}
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/5 border border-primary/10">
            <Users className="h-4 w-4 text-primary" />
          </div>
          Recent People
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unassigned" className="flex items-center gap-1">
              <UserX className="h-3 w-3" />
              Unassigned
              {filteredPeople.unassigned.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredPeople.unassigned.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="assignedToMe" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Mine
              {filteredPeople.assignedToMe.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredPeople.assignedToMe.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="recentlyAssigned" className="flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Assigned
              {filteredPeople.recentlyAssigned.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredPeople.recentlyAssigned.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unassigned" className="mt-4">
            {renderPeopleList(
              filteredPeople.unassigned,
              "No unassigned people found"
            )}
          </TabsContent>
          
          <TabsContent value="assignedToMe" className="mt-4">
            {renderPeopleList(
              filteredPeople.assignedToMe,
              "No people assigned to you"
            )}
          </TabsContent>
          
          <TabsContent value="recentlyAssigned" className="mt-4">
            {renderPeopleList(
              filteredPeople.recentlyAssigned,
              "No recently assigned people"
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
