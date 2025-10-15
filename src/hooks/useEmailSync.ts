import { useState, useEffect } from 'react';
import { gmailService } from '../services/gmailService';

export interface EmailSyncStatus {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncAt: string | null;
  error: string | null;
}

export const useEmailSync = () => {
  const [status, setStatus] = useState<EmailSyncStatus>({
    isConnected: false,
    isSyncing: false,
    lastSyncAt: null,
    error: null,
  });

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const token = localStorage.getItem('gmail_access_token');
      setStatus(prev => ({
        ...prev,
        isConnected: !!token,
        error: null,
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  const syncEmails = async () => {
    setStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      await gmailService.syncInboxEmails();
      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncAt: new Date().toISOString(),
        error: null,
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      }));
    }
  };

  const connectGmail = async () => {
    try {
      await gmailService.authenticateWithGmail();
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Connection failed',
      }));
    }
  };

  return {
    status,
    syncEmails,
    connectGmail,
    checkConnectionStatus,
  };
};
