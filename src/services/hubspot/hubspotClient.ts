/**
 * HubSpot API Client
 * Handles all API interactions with HubSpot CRM
 */

export interface HubSpotConfig {
  accessToken: string;
  portalId?: string;
  hubId?: string;
}

export interface HubSpotContact {
  id?: string;
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  [key: string]: unknown;
}

export interface HubSpotCompany {
  id?: string;
  name: string;
  domain?: string;
  city?: string;
  industry?: string;
  [key: string]: unknown;
}

export interface HubSpotDeal {
  id?: string;
  dealname: string;
  amount?: string;
  dealstage?: string;
  pipeline?: string;
  [key: string]: unknown;
}

export class HubSpotClient {
  private readonly baseUrl = 'https://api.hubapi.com';
  private readonly accessToken: string;
  private readonly portalId?: string;

  constructor(config: HubSpotConfig) {
    this.accessToken = config.accessToken;
    this.portalId = config.portalId;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new HubSpotError(
          error.message || `Request failed with status ${response.status}`,
          response.status,
          error
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof HubSpotError) {
        throw error;
      }
      throw new HubSpotError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        error
      );
    }
  }

  // ========================
  // Contact Operations
  // ========================

  async createContact(properties: Record<string, unknown>) {
    const endpoint = '/crm/v3/objects/contacts';
    const data = { properties };
    return this.request(endpoint, 'POST', data);
  }

  async getContact(contactId: string, properties?: string[]) {
    const props = properties ? properties.join(',') : '';
    const endpoint = `/crm/v3/objects/contacts/${contactId}${props ? `?properties=${props}` : ''}`;
    return this.request(endpoint, 'GET');
  }

  async updateContact(contactId: string, properties: Record<string, unknown>) {
    const endpoint = `/crm/v3/objects/contacts/${contactId}`;
    const data = { properties };
    return this.request(endpoint, 'PATCH', data);
  }

  async searchContacts(
    filterGroups: Array<{
      filters: Array<{
        propertyName: string;
        operator: string;
        value: string | number;
      }>;
    }>
  ) {
    const endpoint = '/crm/v3/objects/contacts/search';
    const data = { filterGroups };
    return this.request(endpoint, 'POST', data);
  }

  async getContactByEmail(email: string) {
    const filterGroups = [
      {
        filters: [
          {
            propertyName: 'email',
            operator: 'EQ',
            value: email,
          },
        ],
      },
    ];
    return this.searchContacts(filterGroups);
  }

  // ========================
  // Company Operations
  // ========================

  async createCompany(properties: Record<string, unknown>) {
    const endpoint = '/crm/v3/objects/companies';
    const data = { properties };
    return this.request(endpoint, 'POST', data);
  }

  async getCompany(companyId: string, properties?: string[]) {
    const props = properties ? properties.join(',') : '';
    const endpoint = `/crm/v3/objects/companies/${companyId}${props ? `?properties=${props}` : ''}`;
    return this.request(endpoint, 'GET');
  }

  async updateCompany(companyId: string, properties: Record<string, unknown>) {
    const endpoint = `/crm/v3/objects/companies/${companyId}`;
    const data = { properties };
    return this.request(endpoint, 'PATCH', data);
  }

  async searchCompanies(
    filterGroups: Array<{
      filters: Array<{
        propertyName: string;
        operator: string;
        value: string | number;
      }>;
    }>
  ) {
    const endpoint = '/crm/v3/objects/companies/search';
    const data = { filterGroups };
    return this.request(endpoint, 'POST', data);
  }

  async getCompanyByDomain(domain: string) {
    const filterGroups = [
      {
        filters: [
          {
            propertyName: 'domain',
            operator: 'EQ',
            value: domain,
          },
        ],
      },
    ];
    return this.searchCompanies(filterGroups);
  }

  // ========================
  // Deal Operations
  // ========================

  async createDeal(properties: Record<string, unknown>) {
    const endpoint = '/crm/v3/objects/deals';
    const data = { properties };
    return this.request(endpoint, 'POST', data);
  }

  async getDeal(dealId: string, properties?: string[]) {
    const props = properties ? properties.join(',') : '';
    const endpoint = `/crm/v3/objects/deals/${dealId}${props ? `?properties=${props}` : ''}`;
    return this.request(endpoint, 'GET');
  }

  async updateDeal(dealId: string, properties: Record<string, unknown>) {
    const endpoint = `/crm/v3/objects/deals/${dealId}`;
    const data = { properties };
    return this.request(endpoint, 'PATCH', data);
  }

  async searchDeals(
    filterGroups: Array<{
      filters: Array<{
        propertyName: string;
        operator: string;
        value: string | number;
      }>;
    }>
  ) {
    const endpoint = '/crm/v3/objects/deals/search';
    const data = { filterGroups };
    return this.request(endpoint, 'POST', data);
  }

  // ========================
  // Association Operations
  // ========================

  async associateContactToCompany(contactId: string, companyId: string) {
    const endpoint = `/crm/v4/objects/contact/${contactId}/associations/company/${companyId}`;
    const data = [
      {
        associationCategory: 'HUBSPOT_DEFINED',
        associationTypeId: 279, // Contact to Company
      },
    ];
    return this.request(endpoint, 'PUT', data);
  }
}

export class HubSpotError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'HubSpotError';
  }
}
