import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { User, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lead {
  id: string;
  name: string;
  email_address?: string;
  company_role?: string;
  employee_location?: string;
  stage?: string;
  owner_id?: string;
  company_id?: string;
}

interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
}

interface SimpleLeadPopupProps {
  leadId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleLeadPopup: React.FC<SimpleLeadPopupProps> = ({ leadId, isOpen, onClose }) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [assigning, setAssigning] = useState(false);

  // Fetch lead data
  useEffect(() => {
    if (!isOpen || !leadId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch lead data
        const { data: leadData, error: leadError } = await supabase
          .from('people')
          .select('id, name, email_address, company_role, employee_location, stage, owner_id, company_id')
          .eq('id', leadId)
          .single();

        if (leadError) throw leadError;

        setLead(leadData);

        // Fetch company data if lead has company
        if (leadData.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('id, name, website, industry')
            .eq('id', leadData.company_id)
            .single();

          if (!companyError && companyData) {
            setCompany(companyData);
          }
        }

        // Fetch team members for assignment
        const { data: membersData, error: membersError } = await supabase
          .from('user_profiles')
          .select('id, full_name, email, role')
          .eq('is_active', true)
          .order('full_name');

        if (!membersError && membersData) {
          setTeamMembers(membersData);
        }

      } catch (err) {
        console.error('Error fetching lead data:', err);
        setError('Failed to load lead data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, leadId]);

  // Handle assignment
  const handleAssign = async (userId: string | null) => {
    if (!lead) return;

    setAssigning(true);
    try {
      const { error } = await supabase
        .from('people')
        .update({ owner_id: userId })
        .eq('id', lead.id);

      if (error) throw error;

      // Update local state
      setLead(prev => prev ? { ...prev, owner_id: userId } : null);
      
      console.log('✅ Lead assigned successfully');
    } catch (err) {
      console.error('Error assigning lead:', err);
    } finally {
      setAssigning(false);
    }
  };

  // Get current owner name
  const getCurrentOwnerName = () => {
    if (!lead?.owner_id) return 'Unassigned';
    const owner = teamMembers.find(m => m.id === lead.owner_id);
    return owner?.full_name || 'Unknown';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-gray-600" />
            <div>
              <h2 className="text-xl font-semibold">
                {loading ? 'Loading...' : lead?.name || 'Lead Details'}
              </h2>
              <p className="text-sm text-gray-600">
                {lead?.company_role || 'Role not specified'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading lead data...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          ) : lead ? (
            <div className="space-y-6">
              {/* Lead Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{lead.email_address || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">{lead.employee_location || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Stage</label>
                  <p className="text-sm text-gray-900">{lead.stage || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Current Owner</label>
                  <p className="text-sm text-gray-900">{getCurrentOwnerName()}</p>
                </div>
              </div>

              {/* Company Information */}
              {company && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-3">Company</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Company Name</label>
                      <p className="text-sm text-gray-900">{company.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Industry</label>
                      <p className="text-sm text-gray-900">{company.industry || 'Not specified'}</p>
                    </div>
                    {company.website && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Website</label>
                        <p className="text-sm text-gray-900">
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {company.website}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Assignment Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Assignment</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Assign to:</span>
                    <select
                      value={lead.owner_id || ''}
                      onChange={(e) => handleAssign(e.target.value || null)}
                      disabled={assigning}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Unassigned</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.full_name} ({member.role})
                        </option>
                      ))}
                    </select>
                    {assigning && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
