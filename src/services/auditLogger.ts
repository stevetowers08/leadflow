// Audit Logger for tracking critical operations
export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogger {
  private static instance: AuditLogger;
  private logs: AuditLogEntry[] = [];

  private constructor() {
    // Load existing logs from localStorage
    this.loadLogs();
  }

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  private loadLogs(): void {
    try {
      const savedLogs = localStorage.getItem('audit_logs');
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      this.logs = [];
    }
  }

  private saveLogs(): void {
    try {
      // Keep only last 1000 entries to prevent localStorage bloat
      const recentLogs = this.logs.slice(-1000);
      localStorage.setItem('audit_logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Failed to save audit logs:', error);
    }
  }

  public log(
    userId: string,
    userEmail: string,
    action: string,
    resource: string,
    details: Record<string, any> = {}
  ): void {
    const logEntry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userEmail,
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    this.logs.push(logEntry);
    this.saveLogs();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Audit Log:', logEntry);
    }

    // In production, you would send this to your audit service
    // this.sendToAuditService(logEntry);
  }

  private getClientIP(): string {
    // This is a placeholder - in a real app, you'd get this from your backend
    return 'client_ip_placeholder';
  }

  public getLogs(filter?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: string;
    endDate?: string;
  }): AuditLogEntry[] {
    let filteredLogs = [...this.logs];

    if (filter) {
      if (filter.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filter.userId);
      }
      if (filter.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filter.action);
      }
      if (filter.resource) {
        filteredLogs = filteredLogs.filter(log => log.resource === filter.resource);
      }
      if (filter.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.startDate!);
      }
      if (filter.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filter.endDate!);
      }
    }

    return filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  public clearLogs(): void {
    this.logs = [];
    this.saveLogs();
  }

  // Convenience methods for common audit actions
  public logUserLogin(userId: string, userEmail: string): void {
    this.log(userId, userEmail, 'LOGIN', 'AUTH', {});
  }

  public logUserLogout(userId: string, userEmail: string): void {
    this.log(userId, userEmail, 'LOGOUT', 'AUTH', {});
  }

  public logSettingsChange(userId: string, userEmail: string, settingsChanged: string[]): void {
    this.log(userId, userEmail, 'UPDATE', 'SYSTEM_SETTINGS', {
      settingsChanged,
      changeCount: settingsChanged.length
    });
  }

  public logUserRoleChange(userId: string, userEmail: string, targetUserId: string, oldRole: string, newRole: string): void {
    this.log(userId, userEmail, 'UPDATE', 'USER_ROLE', {
      targetUserId,
      oldRole,
      newRole
    });
  }

  public logDataExport(userId: string, userEmail: string, resource: string, recordCount: number): void {
    this.log(userId, userEmail, 'EXPORT', resource, {
      recordCount
    });
  }

  public logDataDelete(userId: string, userEmail: string, resource: string, recordId: string): void {
    this.log(userId, userEmail, 'DELETE', resource, {
      recordId
    });
  }
}

// Export singleton instance
export const auditLogger = AuditLogger.getInstance();







