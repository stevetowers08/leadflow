import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { AIScoreBadge } from "@/components/AIScoreBadge";
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
  Eye,
  Star,
  Bot,
  Info,
  Activity,
  BarChart3,
  Zap,
  Heart,
  Linkedin
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
                  {company["Lead Score"] && (
                    <AIScoreBadge
                      leadData={{
                        name: "Company",
                        company: company["Company Name"] || "",
                        role: "Company",
                        location: company["Head Office"] || "",
                        industry: company["Industry"],
                        company_size: company["Company Size"] || "Unknown"
                      }}
                      initialScore={parseInt(company["Lead Score"].toString())}
                      showDetails={false}
                    />
                  )}
                </div>
              </div>
              
              {/* Score Reason */}
              {company["Score Reason"] && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-blue-900">Score Reason</div>
                      <div className="text-sm text-blue-700 mt-1">{company["Score Reason"]}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Intelligence */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AI Info */}
                {company["AI Info"] && (
                  <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Bot className="h-4 w-4 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-purple-900 mb-2">AI Intelligence</div>
                          <div className="text-sm text-purple-700">{company["AI Info"]}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Company Info */}
                {company["Company Info"] && (
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-green-900 mb-2">Company Details</div>
                          <div className="text-sm text-green-700">{company["Company Info"]}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Key Info Raw */}
              {company["Key Info Raw"] && (
                <Card className="mt-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <Activity className="h-4 w-4 text-indigo-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-indigo-900 mb-2">Key Information</div>
                        <div className="text-sm text-indigo-700 whitespace-pre-wrap">{company["Key Info Raw"]}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Company Analytics */}
              <Card className="mt-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                    <div className="text-sm font-medium text-orange-900">Company Analytics</div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Jobs Count */}
                    <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">{relatedJobs?.length || 0}</div>
                      <div className="text-xs text-orange-700">Active Jobs</div>
                    </div>
                    
                    {/* Leads Count */}
                    <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">{relatedLeads?.length || 0}</div>
                      <div className="text-xs text-orange-700">Total Leads</div>
                    </div>
                    
                    {/* Automation Status */}
                    <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">
                        {company.Automation ? "✓" : "○"}
                      </div>
                      <div className="text-xs text-orange-700">Automation</div>
                    </div>
                    
                    {/* Priority Level */}
                    <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">
                        {company.Priority === "high" ? "🔴" : company.Priority === "medium" ? "🟡" : "🟢"}
                      </div>
                      <div className="text-xs text-orange-700 capitalize">{company.Priority || "Low"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Actions */}
              <Card className="mt-4 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-gray-600" />
                    <div className="text-sm font-medium text-gray-900">Quick Actions</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {/* LinkedIn */}
                    {company["LinkedIn URL"] && (
                      <a
                        href={company["LinkedIn URL"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        <Linkedin className="h-3 w-3" />
                        LinkedIn
                      </a>
                    )}
                    
                    {/* Website */}
                    {company.Website && (
                      <a
                        href={company.Website.startsWith('http') ? company.Website : `https://${company.Website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        <Globe className="h-3 w-3" />
                        Website
                      </a>
                    )}
                    
                    {/* Favorite */}
                    <button className="inline-flex items-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm">
                      <Heart className="h-3 w-3" />
                      {company.Favourite ? "Favorited" : "Add to Favorites"}
                    </button>
                    
                    {/* Automation */}
                    <button className="inline-flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                      <Bot className="h-3 w-3" />
                      {company.Automation ? "Automated" : "Enable Automation"}
                    </button>
                  </div>
                </CardContent>
              </Card>
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
