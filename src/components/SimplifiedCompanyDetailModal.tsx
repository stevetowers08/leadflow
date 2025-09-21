import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Building2, 
  ExternalLink, 
  MapPin, 
  Users, 
  Globe, 
  Briefcase,
  Calendar,
  TrendingUp,
  Target,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";

interface SimplifiedCompanyDetailModalProps {
  company: Tables<"Companies">;
  isOpen: boolean;
  onClose: () => void;
}

export function SimplifiedCompanyDetailModal({ company, isOpen, onClose }: SimplifiedCompanyDetailModalProps) {
  // Fetch related jobs for this company
  const { data: relatedJobs } = useQuery({
    queryKey: ["company-jobs", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("Jobs")
        .select(`
          id,
          "Job Title",
          Company,
          "Job Location",
          Industry,
          "Lead Score",
          "Posted Date",
          "Valid Through",
          Priority,
          "Employment Type",
          status_enum,
          created_at
        `)
        .ilike("Company", `%${company["Company Name"]}%`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id && isOpen,
  });

  // Fetch related leads for this company
  const { data: relatedLeads } = useQuery({
    queryKey: ["company-leads", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("People")
        .select(`
          id,
          Name,
          Company,
          "Company Role",
          "Email Address", 
          "LinkedIn URL",
          Stage,
          stage_enum,
          "Lead Score",
          "Employee Location",
          automation_status_enum,
          "Message Sent",
          "Connection Request",
          "Email Reply",
          "Meeting Booked",
          created_at
        `)
        .ilike("Company", `%${company["Company Name"]}%`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id && isOpen,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!company) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-full">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="font-bold">{company["Company Name"] || "Unknown Company"}</div>
              <div className="text-sm font-normal text-muted-foreground">
                {company.Industry || "Industry not specified"} • {company["Head Office"] || "Location not specified"}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Company Overview - Clean */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {company.Logo ? (
                    <img src={company.Logo} alt="Company logo" className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-lg font-medium">
                      {company["Company Name"]?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {company["Company Size"] && (
                      <Badge className="bg-blue-100 text-blue-800 border text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {company["Company Size"]}
                      </Badge>
                    )}
                    
                    {company.Website && (
                      <a 
                        href={company.Website.startsWith('http') ? company.Website : `https://${company.Website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline text-xs"
                      >
                        <Globe className="h-3 w-3" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 border text-xs">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {relatedJobs?.length || 0} Jobs
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 border text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {relatedLeads?.length || 0} Leads
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                window.location.href = `/jobs?filter=${encodeURIComponent(company["Company Name"] || "")}`;
              }}
              className="flex-1"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              View All Jobs ({relatedJobs?.length || 0})
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                window.location.href = `/leads?filter=${encodeURIComponent(company["Company Name"] || "")}`;
              }}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              View All People ({relatedLeads?.length || 0})
            </Button>
          </div>

          {/* Company Details - Compact */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {company.Industry && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-muted-foreground">Industry:</span>
                    <span>{company.Industry}</span>
                  </div>
                )}
                
                {company["Company Size"] && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-muted-foreground">Size:</span>
                    <span>{company["Company Size"]}</span>
                  </div>
                )}
                
                {company["Head Office"] && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-muted-foreground">Location:</span>
                    <span>{company["Head Office"]}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-muted-foreground">Added:</span>
                  <span>{formatDate(company.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Jobs */}
          {relatedJobs && relatedJobs.length > 0 && (
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Recent Jobs ({relatedJobs.length})
                  </h3>
                </div>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {relatedJobs.map((job) => (
                      <div key={job.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{job["Job Title"]}</div>
                            <div className="text-xs text-muted-foreground">
                              {job["Job Location"]} • {job.Industry} • {job["Employment Type"]}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Posted {formatDate(job["Posted Date"] || job.created_at)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {job.Priority && (
                              <StatusBadge status={job.Priority.toLowerCase()} size="sm" />
                            )}
                            {job["Lead Score"] && (
                              <Badge variant="outline" className="text-xs">
                                Score: {job["Lead Score"]}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Recent Leads */}
          {relatedLeads && relatedLeads.length > 0 && (
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Recent Leads ({relatedLeads.length})
                  </h3>
                </div>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {relatedLeads.map((lead) => (
                      <div key={lead.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{lead.Name}</div>
                            <div className="text-xs text-muted-foreground">
                              {lead["Company Role"]} • {lead["Employee Location"]}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Added {formatDate(lead.created_at)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge 
                              status={lead.stage_enum || lead.Stage?.toLowerCase() || "new"} 
                              size="sm"
                            />
                            {lead["Lead Score"] && (
                              <Badge variant="outline" className="text-xs">
                                Score: {lead["Lead Score"]}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
