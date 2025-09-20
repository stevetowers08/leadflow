import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Building2, ExternalLink, MapPin, Users, Star, Calendar, Globe, Info } from "lucide-react";

interface Company {
  id: string;
  "Company Name": string;
  "Industry": string | null;
  "Website": string | null;
  "Company Size": string | null;
  "Head Office": string | null;
  "Lead Score": number | null;
  "Priority": string | null;
  "STATUS": string | null;
  "Company Info": string | null;
  "LinkedIn URL": string | null;
  "Profile Image URL": string | null;
  created_at: string;
}

interface CompanyDetailModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyDetailModal({ company, isOpen, onClose }: CompanyDetailModalProps) {
  if (!company) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    if (score >= 40) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            {company["Company Name"]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Metrics */}
          <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
            {company["STATUS"] && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <StatusBadge status={company["STATUS"].toLowerCase()} size="md" />
              </div>
            )}
            {company["Priority"] && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Priority:</span>
                <StatusBadge status={company["Priority"].toLowerCase()} size="md" />
              </div>
            )}
            {company["Lead Score"] && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(company["Lead Score"])}`}>
                  Score: {company["Lead Score"]}
                </span>
              </div>
            )}
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Company Details</h3>
              
              {company["Industry"] && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{company["Industry"]}</span>
                </div>
              )}

              {company["Company Size"] && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{company["Company Size"]} employees</span>
                </div>
              )}

              {company["Head Office"] && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{company["Head Office"]}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Added {formatDate(company.created_at)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Contact Info</h3>
              
              {company["Website"] && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={company["Website"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {company["Website"]}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {company["LinkedIn URL"] && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
                  </svg>
                  <a 
                    href={company["LinkedIn URL"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    LinkedIn Profile
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Company Information */}
          {company["Company Info"] && (
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <h3 className="font-semibold text-sm">Company Information</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {company["Company Info"]}
              </p>
            </div>
          )}

          {/* Profile Image */}
          {company["Profile Image URL"] && (
            <div className="flex justify-center">
              <img 
                src={company["Profile Image URL"]} 
                alt={`${company["Company Name"]} profile`}
                className="max-w-xs rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}