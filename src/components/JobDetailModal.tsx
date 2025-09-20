import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Clock, DollarSign, Calendar, Briefcase, Star, Users } from "lucide-react";

interface Job {
  id: string;
  "Job Title": string;
  Company: string;
  Logo: string | null;
  "Job Location": string | null;
  Industry: string | null;
  Function: string | null;
  "Lead Score": number | null;
  "Score Reason (from Company)": string | null;
  "Posted Date": string | null;
  "Valid Through": string | null;
  Priority: string | null;
  "Job Description": string | null;
  "Employment Type": string | null;
  Salary: string | null;
  created_at: string;
}

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  if (!job) return null;

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

  const isJobExpired = job["Valid Through"] && new Date(job["Valid Through"]) < new Date();
  const daysRemaining = job["Valid Through"] 
    ? Math.ceil((new Date(job["Valid Through"]).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {job.Logo ? (
                <img src={job.Logo} alt="Company logo" className="w-8 h-8 rounded object-cover" />
              ) : (
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div>
                <div className="font-semibold">{job["Job Title"]}</div>
                <div className="text-sm text-muted-foreground">{job.Company}</div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
            {job.Priority && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Priority:</span>
                <StatusBadge status={job.Priority.toLowerCase()} size="md" />
              </div>
            )}
            {job["Lead Score"] && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(job["Lead Score"])}`}>
                  Score: {job["Lead Score"]}
                </span>
              </div>
            )}
            {isJobExpired ? (
              <Badge variant="destructive">Expired</Badge>
            ) : daysRemaining !== null && daysRemaining <= 7 && (
              <Badge variant="secondary">
                {daysRemaining <= 0 ? "Expires today" : `${daysRemaining} days left`}
              </Badge>
            )}
          </div>

          {/* Job Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Job Details</h3>
              
              {job["Job Location"] && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job["Job Location"]}</span>
                </div>
              )}

              {job.Industry && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job.Industry}</span>
                </div>
              )}

              {job.Function && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job.Function}</span>
                </div>
              )}

              {job["Employment Type"] && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job["Employment Type"]}</span>
                </div>
              )}

              {job.Salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job.Salary}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Timeline</h3>
              
              {job["Posted Date"] && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Posted {formatDate(job["Posted Date"])}</span>
                </div>
              )}

              {job["Valid Through"] && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-sm ${isJobExpired ? 'text-red-600' : ''}`}>
                    {isJobExpired ? "Expired" : "Valid until"} {formatDate(job["Valid Through"])}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Added {formatDate(job.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          {job["Job Description"] && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Job Description</h3>
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {job["Job Description"]}
                </div>
              </div>
            </div>
          )}

          {/* Score Reason */}
          {job["Score Reason (from Company)"] && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Score Analysis</h3>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-900 leading-relaxed">
                  {job["Score Reason (from Company)"]}
                </div>
              </div>
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