import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Building2, 
  Mail, 
  ExternalLink, 
  MapPin, 
  Calendar,
  MessageSquare,
  Phone,
  Globe,
  Linkedin
} from 'lucide-react';
import { Conversation } from '../services/conversationService';
import { cn } from '@/lib/utils';

interface LeadPanelProps {
  conversation: Conversation | null;
  className?: string;
}

export const LeadPanel: React.FC<LeadPanelProps> = ({
  conversation,
  className
}) => {
  if (!conversation) {
    return (
      <div className={cn("h-full flex flex-col", className)}>
        <div className="p-6 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Lead Information</h2>
              <p className="text-sm text-gray-600">Select a conversation to view lead details</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Lead Selected</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Choose a conversation to view detailed lead information and contact details
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getConversationTypeIcon = () => {
    switch (conversation.conversation_type) {
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-blue-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-green-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getConversationTypeBadge = () => {
    switch (conversation.conversation_type) {
      case 'linkedin':
        return <StatusBadge status="LinkedIn" size="sm" />;
      case 'email':
        return <StatusBadge status="Email" size="sm" />;
      default:
        return <StatusBadge status="Unknown" size="sm" />;
    }
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Lead Panel Header */}
      <div className="p-6 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Lead Information</h2>
            <p className="text-sm text-gray-600">Contact details and profile</p>
          </div>
        </div>
        
        {/* Lead Avatar and Basic Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {conversation.person_name || 'Unknown Person'}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              {getConversationTypeIcon()}
              {getConversationTypeBadge()}
            </div>
            {conversation.person_company && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                <span>{conversation.person_company}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lead Details */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Information
          </h4>
          
          <div className="space-y-3">
            {conversation.person_email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{conversation.person_email}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {conversation.person_linkedin_url && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Linkedin className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">LinkedIn</p>
                  <p className="text-sm text-gray-600">View Profile</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => window.open(conversation.person_linkedin_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Conversation Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversation Details
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Status</span>
              <Badge 
                variant={conversation.status === 'active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {conversation.status}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Read Status</span>
              <Badge 
                variant={conversation.is_read ? 'secondary' : 'default'}
                className="text-xs"
              >
                {conversation.is_read ? 'Read' : 'Unread'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Last Message</span>
              <span className="text-sm text-gray-600">
                {new Date(conversation.last_message_at).toLocaleDateString()}
              </span>
            </div>
            
            {conversation.message_count && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Message Count</span>
                <span className="text-sm text-gray-600">{conversation.message_count}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Quick Actions</h4>
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => window.open(conversation.person_linkedin_url, '_blank')}
            >
              <Linkedin className="h-4 w-4 mr-2" />
              View LinkedIn Profile
            </Button>
            
            {conversation.person_email && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => window.open(`mailto:${conversation.person_email}`, '_blank')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

