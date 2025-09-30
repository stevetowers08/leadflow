import React from 'react';
import { 
  Briefcase, 
  Users, 
  Building2, 
  Clock, 
  Zap, 
  Target,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="text-muted-foreground">
        {icon}
      </div>
      <span className="font-medium">{value} {label}</span>
    </div>
  );
};

// Jobs Stats Cards
interface Job {
  id: string;
  priority?: string;
  automation_active?: boolean;
  lead_score_job?: number;
}

interface JobsStatsProps {
  jobs: Job[];
}

export const JobsStatsCards: React.FC<JobsStatsProps> = ({ jobs }) => {
  const totalJobs = jobs.length;
  const highPriorityJobs = jobs.filter(job => job.priority === 'HIGH' || job.priority === 'VERY HIGH').length;
  const automatedJobs = jobs.filter(job => job.automation_active).length;
  const notAutomatedJobs = totalJobs - automatedJobs;
  const avgLeadScore = jobs.length > 0 
    ? Math.round(jobs.reduce((sum, job) => sum + (job.lead_score_job || 0), 0) / jobs.length)
    : 0;

  return (
    <div className="flex items-center gap-6 mb-4 text-sm">
      <StatItem
        icon={<Briefcase className="h-4 w-4" />}
        value={totalJobs}
        label="jobs"
      />
      <StatItem
        icon={<Star className="h-4 w-4" />}
        value={highPriorityJobs}
        label="high priority"
      />
      <StatItem
        icon={<Zap className="h-4 w-4" />}
        value={automatedJobs}
        label="automated"
      />
      <StatItem
        icon={<Target className="h-4 w-4" />}
        value={avgLeadScore}
        label="avg score"
      />
    </div>
  );
};

// Leads Stats Cards
interface LeadsStatsProps {
  totalLeads: number;
  newLeads: number;
  connectedLeads: number;
  messagedLeads: number;
  repliedLeads: number;
  meetingBookedLeads: number;
  qualifiedLeads: number;
}

export const LeadsStatsCards: React.FC<LeadsStatsProps> = ({
  totalLeads,
  newLeads,
  connectedLeads,
  messagedLeads,
  repliedLeads,
  meetingBookedLeads,
  qualifiedLeads
}) => {
  return (
    <div className="flex items-center gap-6 mb-4 text-sm">
      <StatItem
        icon={<Users className="h-4 w-4" />}
        value={totalLeads}
        label="leads"
      />
      <StatItem
        icon={<Target className="h-4 w-4" />}
        value={newLeads}
        label="new prospects"
      />
      <StatItem
        icon={<CheckCircle className="h-4 w-4" />}
        value={connectedLeads}
        label="connected"
      />
      <StatItem
        icon={<Zap className="h-4 w-4" />}
        value={messagedLeads}
        label="follow-ups sent"
      />
      <StatItem
        icon={<CheckCircle className="h-4 w-4" />}
        value={repliedLeads}
        label="responded"
      />
      <StatItem
        icon={<Calendar className="h-4 w-4" />}
        value={meetingBookedLeads}
        label="meetings scheduled"
      />
      <StatItem
        icon={<Star className="h-4 w-4" />}
        value={qualifiedLeads}
        label="qualified"
      />
    </div>
  );
};

// Companies Stats Cards
interface CompaniesStatsProps {
  totalCompanies: number;
  activeCompanies: number;
  qualifiedCompanies: number;
  prospectCompanies: number;
  newCompanies: number;
  companiesWithLeads: number;
  companiesWithJobs: number;
}

export const CompaniesStatsCards: React.FC<CompaniesStatsProps> = ({
  totalCompanies,
  activeCompanies,
  qualifiedCompanies,
  prospectCompanies,
  newCompanies,
  companiesWithLeads,
  companiesWithJobs
}) => {
  return (
    <div className="flex items-center gap-6 mb-4 text-sm">
      <StatItem
        icon={<Building2 className="h-4 w-4" />}
        value={totalCompanies}
        label="companies"
      />
      <StatItem
        icon={<Zap className="h-4 w-4" />}
        value={activeCompanies}
        label="active"
      />
      <StatItem
        icon={<Star className="h-4 w-4" />}
        value={qualifiedCompanies}
        label="qualified"
      />
      <StatItem
        icon={<Target className="h-4 w-4" />}
        value={prospectCompanies}
        label="prospects"
      />
      <StatItem
        icon={<AlertCircle className="h-4 w-4" />}
        value={newCompanies}
        label="new"
      />
      <StatItem
        icon={<Users className="h-4 w-4" />}
        value={companiesWithLeads}
        label="with leads"
      />
      <StatItem
        icon={<Briefcase className="h-4 w-4" />}
        value={companiesWithJobs}
        label="with jobs"
      />
    </div>
  );
};

// Pipeline Stats Cards
interface PipelineStatsProps {
  leads: any[];
}

export const PipelineStatsCards: React.FC<PipelineStatsProps> = ({ leads }) => {
  const totalLeads = leads.length;
  const activeLeads = leads.filter(lead => lead.status !== 'CLOSED' && lead.status !== 'REJECTED').length;
  const closedLeads = leads.filter(lead => lead.status === 'CLOSED').length;
  const rejectedLeads = leads.filter(lead => lead.status === 'REJECTED').length;
  const avgLeadScore = leads.length > 0 
    ? Math.round(leads.reduce((sum, lead) => sum + (lead.lead_score || 0), 0) / leads.length)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatItem
        icon={<Users className="h-4 w-4" />}
        value={totalLeads}
        label="total leads"
      />
      <StatItem
        icon={<Target className="h-4 w-4" />}
        value={activeLeads}
        label="active"
      />
      <StatItem
        icon={<CheckCircle className="h-4 w-4" />}
        value={closedLeads}
        label="closed"
      />
      <StatItem
        icon={<Star className="h-4 w-4" />}
        value={avgLeadScore}
        label="avg score"
      />
    </div>
  );
};