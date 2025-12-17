// Export all API services for easy import
export { authService } from './auth.service';
export { ticketService } from './ticket.service';
export { metadataService } from './metadata.service';
export { 
  getSignalRService, 
  cleanupSignalR, 
  SignalRService,
  type NotificationMessage 
} from './signalr.service';

// Export API client and utilities
export { default as apiClient, getToken, setToken, clearTokens } from './client';
export { API_CONFIG, API_ENDPOINTS } from './config';

// Re-export types
export type {
  // Auth types
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  UserRole,
} from '@/types/auth';

export type {
  // Ticket types
  TicketResponse,
  CreateTicketRequest,
  TicketParameters,
  TicketStatus,
  TicketSeverity,
  TicketCloseReason,
  
  // Approval types
  OrderPartApprovalRequest,
  ReviewTicketApprovalRequest,
  CloseTicketApprovalRequest,
  ApprovalStatus,
  ApprovalType,
  
  // Nested response types
  RoomResponse,
  CampusResponse,
  FacilityTypeResponse,
  IssueTypeResponse,
  UserResponse,
  TicketIssueResponse,
  TicketHistoryResponse,
  
  // OData types
  ODataResponse,
  ODataCountResponse,
  
  // Pagination
  PaginationMetadata,
  PaginatedResponse,
} from '@/types/ticket';

// API service bundle for easy access
export const apiServices = {
  auth: authService,
  ticket: ticketService,
  metadata: metadataService,
  signalr: getSignalRService,
} as const;