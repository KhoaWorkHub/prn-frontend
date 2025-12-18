// API Configuration
export const API_CONFIG = {
  // Always use backend API directly for now (both local and deployed)
  BASE_URL: 'http://34.169.143.69:8080',
  TIMEOUT: 30000,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh-token',
    CURRENT_USER: '/api/auth/current-user',
    LOGOUT: '/api/auth/logout',
  },
  
  // Tickets - Main CRUD
  TICKETS: {
    LIST: '/api/tickets',
    CREATE: '/api/tickets',
    DETAIL: (id: string) => `/api/tickets/${id}`,
    UPDATE: (id: string) => `/api/tickets/${id}`,
    DELETE: (id: string) => `/api/tickets/${id}`,
  },

  // Staff-specific ticket endpoints
  STAFF: {
    ASSIGNED_TICKETS: '/api/staff-assigned-tickets',
    ASSIGNED_TICKET_DETAIL: (id: string) => `/api/staff-assigned-tickets/${id}`,
  },

  // Reporter-specific ticket endpoints  
  REPORTER: {
    REPORTED_TICKETS: '/api/reporter-reported-tickets',
    REPORTED_TICKET_DETAIL: (id: string) => `/api/reporter-reported-tickets/${id}`,
  },

  // Approval workflows
  APPROVAL: {
    ORDER_PART: '/api/order-part-approval',
    REVIEW: '/api/review',
    CLOSE_APPROVAL: '/api/close-approval',
  },

  // OData endpoints
  ODATA: {
    METADATA: '/odata/$metadata',
    ROOT: '/odata',
    TICKETS: '/odata/Tickets',
    TICKETS_COUNT: '/odata/Tickets/$count',
  },

  // Metadata endpoints
  DATA: {
    METADATA: '/api/data/$metadata',
    ROOT: '/api/data',
  },
} as const;
