import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Zap, User, Building2, Mail, MapPin, Star, Calendar, Briefcase, Users } from "lucide-react";

interface Lead {
  id: string;
  Name: string;
  Company: string | null;
  "Email Address": string | null;
  "Employee Location": string | null;
  "Company Role": string | null;
  Stage: string | null;
  stage_enum: string | null;
  priority_enum: string | null;
  "Lead Score": string | null;
  "LinkedIn URL": string | null;
  created_at: string;
}

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailModal({ lead, isOpen, onClose }: LeadDetailModalProps) {
  const [isAutomating, setIsAutomating] = useState(false);
  const { toast } = useToast();

  // Fetch related company data
  const { data: companyData } = useQuery({
    queryKey: ['company', lead?.Company],
    queryFn: async () => {
      if (!lead?.Company) return null;
      const { data, error } = await supabase
        .from('Companies')
        .select('*')
        .ilike('Company Name', lead.Company)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!lead?.Company && isOpen,
  });

  // Fetch related jobs from the same company
  const { data: relatedJobs } = useQuery({
    queryKey: ['company-jobs', lead?.Company],
    queryFn: async () => {
      if (!lead?.Company) return [];
      const { data, error } = await supabase
        .from('Jobs')
        .select('*')
        .ilike('Company', lead.Company)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!lead?.Company && isOpen,
  });

  // Fetch other leads from the same company
  const { data: relatedLeads } = useQuery({
    queryKey: ['company-leads', lead?.Company, lead?.id],
    queryFn: async () => {
      if (!lead?.Company || !lead?.id) return [];
      const { data, error } = await supabase
        .from('People')
        .select('*')
        .ilike('Company', lead.Company)
        .neq('id', lead.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!lead?.Company && !!lead?.id && isOpen,
  });

  if (!lead) return null;

  const handleAutomate = async () => {
    setIsAutomating(true);
    try {
      const { data, error } = await supabase.functions.invoke('trigger-automation', {
        body: {
          leadId: lead.id,
          leadData: {
            name: lead.Name,
            company: lead.Company,
            email: lead["Email Address"],
            stage: lead.stage_enum || lead.Stage,
            priority: lead.priority_enum,
            linkedinUrl: lead["LinkedIn URL"],
            leadScore: lead["Lead Score"]
          },
          action: 'lead_automation_trigger'
        }
      });

      if (error) throw error;

      toast({
        title: "Automation Started",
        description: `Automation workflow triggered for ${lead.Name}`,
      });
    } catch (error) {
      toast({
        title: "Automation Failed",
        description: "Failed to trigger automation workflow",
        variant: "destructive",
      });
    } finally {
      setIsAutomating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 80) return "text-green-600 bg-green-50";
    if (numScore >= 60) return "text-yellow-600 bg-yellow-50";
    if (numScore >= 40) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            {lead.Name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <StatusBadge 
                status={lead.stage_enum || lead.Stage?.toLowerCase() || "new"} 
                size="md"
              />
            </div>
            {lead.priority_enum && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Priority:</span>
                <StatusBadge status={lead.priority_enum} size="md" />
              </div>
            )}
            {lead["Lead Score"] && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(lead["Lead Score"])}`}>
                  Score: {lead["Lead Score"]}
                </span>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Personal Info</h3>
              
              {lead["Company Role"] && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead["Company Role"]}</span>
                </div>
              )}

              {lead["Employee Location"] && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead["Employee Location"]}</span>
                </div>
              )}

              {lead["Email Address"] && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${lead["Email Address"]}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {lead["Email Address"]}
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Company Info</h3>
              
              {lead.Company && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead.Company}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Added {formatDate(lead.created_at)}</span>
              </div>
            </div>
          </div>

          {/* LinkedIn Profile */}
          {lead["LinkedIn URL"] && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="font-medium text-blue-900">LinkedIn Profile</span>
                </div>
                <a
                  href={lead["LinkedIn URL"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span className="text-sm">View Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Company Details */}
          {companyData && (
            <div className="p-4 bg-muted/10 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Company Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {companyData.Industry && (
                  <div>
                    <span className="text-muted-foreground">Industry:</span>
                    <span className="ml-2">{companyData.Industry}</span>
                  </div>
                )}
                {companyData["Company Size"] && (
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <span className="ml-2">{companyData["Company Size"]}</span>
                  </div>
                )}
                {companyData["Head Office"] && (
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <span className="ml-2">{companyData["Head Office"]}</span>
                  </div>
                )}
                {companyData.Website && (
                  <div>
                    <span className="text-muted-foreground">Website:</span>
                    <a 
                      href={companyData.Website.startsWith('http') ? companyData.Website : `https://${companyData.Website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:underline"
                    >
                      {companyData.Website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Jobs */}
          {relatedJobs && relatedJobs.length > 0 && (
            <div className="p-4 bg-muted/10 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Related Jobs ({relatedJobs.length})</h3>
              </div>
              <div className="space-y-2">
                {relatedJobs.map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between p-2 bg-background rounded border">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{job["Job Title"]}</div>
                      <div className="text-xs text-muted-foreground">
                        {job["Job Location"]} • Posted {job["Posted Date"]}
                      </div>
                    </div>
                    {job["Lead Score"] && (
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(job["Lead Score"].toString())}`}>
                        {job["Lead Score"]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Leads */}
          {relatedLeads && relatedLeads.length > 0 && (
            <div className="p-4 bg-muted/10 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Other Leads from {lead.Company} ({relatedLeads.length})</h3>
              </div>
              <div className="space-y-2">
                {relatedLeads.map((otherLead: any) => (
                  <div key={otherLead.id} className="flex items-center justify-between p-2 bg-background rounded border">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{otherLead.Name}</div>
                      <div className="text-xs text-muted-foreground">
                        {otherLead["Company Role"]} • {otherLead["Employee Location"]}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {otherLead["Lead Score"] && (
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(otherLead["Lead Score"])}`}>
                          {otherLead["Lead Score"]}
                        </div>
                      )}
                      <StatusBadge 
                        status={otherLead.stage_enum || otherLead.Stage?.toLowerCase() || "new"} 
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={handleAutomate}
              disabled={isAutomating}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isAutomating ? "Starting Automation..." : "AUTOMATE"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}