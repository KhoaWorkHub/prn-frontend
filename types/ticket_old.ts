// Ticket Status Enum
export enum TicketStatus {
  REPORTED = 'Reported',
  ASSIGNED = 'Assigned',
  REVIEWING = 'Reviewing',
  IN_PROGRESS = 'InProgress',
  WAITING_FOR_PART_APPROVAL = 'WaitingForPartApproval',
  WAITING_FOR_PARTS = 'WaitingForParts',
  WAITING_FOR_CLOSE_APPROVAL = 'WaitingForCloseApproval',
  CLOSED = 'Closed',
}

// Ticket Severity
export enum TicketSeverity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

// Closing Reason
export enum ClosingReason {
  RESOLVED = 'Resolved',
  DUPLICATE = 'Duplicate',
  FALSE_ISSUE = 'FalseIssue',
  CANNOT_REPRODUCE = 'CannotReproduce',
}

// Base Ticket Interface
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  severity: TicketSeverity;
  
  // Relations
  reporterId: string;
  reporterName?: string;
  assignedToId?: string;
  assignedToName?: string;
  
  categoryId: string;
  categoryName?: string;
  
  campusId: string;
  campusName?: string;
  
  roomId?: string;
  roomName?: string;
  
  location?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  
  // Closure
  closingReason?: ClosingReason;
  closingNote?: string;
  
  // Attachments
  attachments?: string[];
}

// Create Ticket Request
export interface CreateTicketRequest {
  title: string;
  description: string;
  severity: TicketSeverity;
  categoryId: string;
  campusId: string;
  roomId?: string;
  location?: string;
  attachments?: File[];
}

// Update Ticket Request
export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  severity?: TicketSeverity;
  categoryId?: string;
  campusId?: string;
  roomId?: string;
  location?: string;
}

// Assign Ticket Request
export interface AssignTicketRequest {
  assignedToId: string;
}

// Update Progress Request
export interface UpdateProgressRequest {
  status: TicketStatus;
  note: string;
  attachments?: File[];
}

// Ticket Filters
export interface TicketFilters {
  status?: TicketStatus[];
  severity?: TicketSeverity[];
  categoryId?: string;
  campusId?: string;
  reporterId?: string;
  assignedToId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// Ticket History
export interface TicketHistory {
  id: string;
  ticketId: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Category
export interface Category {
  id: string;
  name: string;
  description?: string;
}

// Campus
export interface Campus {
  id: string;
  name: string;
  address?: string;
}

// Room
export interface Room {
  id: string;
  name: string;
  campusId: string;
  campusName?: string;
}
