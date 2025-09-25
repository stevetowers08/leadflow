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
interface JobsStatsProps {
  totalJobs: number;
  activeJobs: number;
  automatedJobs: number;
  notAutomatedJobs: number;
}

export const JobsStatsCards: React.FC<JobsStatsProps> = ({
  totalJobs,
  activeJobs,
  automatedJobs,
  notAutomatedJobs
}) => {
  return (
    <div className="flex items-center gap-6 mb-4 text-sm">
      <StatItem
        icon={<Briefcase className="h-4 w-4" />}
        value={totalJobs}
        label="jobs"
      />
      <StatItem
        icon={<CheckCircle className="h-4 w-4" />}
        value={activeJobs}
        label="active"
      />
      <StatItem
        icon={<Zap className="h-4 w-4" />}
        value={automatedJobs}
        label="automated"
      />
      <StatItem
        icon={<Target className="h-4 w-4" />}
        value={notAutomatedJobs}
        label="not automated"
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
        label="new"
      />
      <StatItem
        icon={<CheckCircle className="h-4 w-4" />}
        value={connectedLeads}
        label="connected"
      />
      <StatItem
        icon={<Zap className="h-4 w-4" />}
        value={messagedLeads}
        label="messaged"
      />
      <StatItem
        icon={<CheckCircle className="h-4 w-4" />}
        value={repliedLeads}
        label="replied"
      />
      <StatItem
        icon={<Calendar className="h-4 w-4" />}
        value={meetingBookedLeads}
        label="meetings booked"
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
