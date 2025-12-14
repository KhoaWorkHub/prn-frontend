// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://34.169.143.69:8080',
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
  // Tickets (will be implemented when backend API is ready)
  TICKETS: {
    LIST: '/api/tickets',
    CREATE: '/api/tickets',
    DETAIL: (id: string) => `/api/tickets/${id}`,
    UPDATE: (id: string) => `/api/tickets/${id}`,
    DELETE: (id: string) => `/api/tickets/${id}`,
    ASSIGN: (id: string) => `/api/tickets/${id}/assign`,
    PROGRESS: (id: string) => `/api/tickets/${id}/progress`,
    APPROVE_WFP: (id: string) => `/api/tickets/${id}/approve-wfp`,
    APPROVE_CLOSE: (id: string) => `/api/tickets/${id}/approve-close`,
  },
  // Manager
  MANAGER: {
    REPORTED_TICKETS: '/api/manager/tickets/reported',
    CLOSED_TICKETS: '/api/manager/tickets/closed',
  },
  // Staff
  STAFF: {
    ASSIGNED_TICKETS: '/api/staff/tickets',
  },
} as const;
