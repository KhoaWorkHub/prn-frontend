// ===== ENUMS =====

export enum TicketStatus {
  REPORTED = 'Reported',
  WAITING_FOR_ASSIGNMENT = 'WaitingForAssignment',
  ASSIGNED = 'Assigned',
  REVIEWING = 'Reviewing',
  IN_PROGRESS = 'InProgress',
  WAITING_FOR_PART_APPROVAL = 'WaitingForPartApproval',
  WAITING_FOR_PARTS = 'WaitingForParts',
  WAITING_FOR_CLOSE_APPROVAL = 'WaitingForCloseApproval',
  CLOSED = 'Closed',
}

export enum TicketSeverity {
  A = 'A', // Highest priority
  B = 'B',
  C = 'C', // Lowest priority
}

export enum TicketCloseReason {
  RESOLVED = 'Resolved',
  REJECTED = 'Rejected',
  DUPLICATE = 'Duplicate',
  CANCELLED = 'Cancelled',
}

export enum IssueStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'InProgress',
  RESOLVED = 'Resolved',
}

// ===== NESTED RESPONSE TYPES =====

export interface RoomResponse {
  roomId: string;
  name: string;
  campus: CampusResponse;
}

export interface CampusResponse {
  campusId: string;
  name: string;
}

export interface FacilityTypeResponse {
  facilityTypeId: string;
  name: string;
}

export interface UserResponse {
  id: string;
  userName: string;
  email: string;
}

export interface IssueTypeResponse {
  issueTypeId: string;
  name: string;
  estimatedMinutes?: number;
}

export interface TicketIssueResponse {
  ticketIssueId: string;
  ticketId: string;
  issueTypeId: string;
  status: IssueStatus;
  issueType: IssueTypeResponse;
}

export interface TicketHistoryResponse {
  ticketHistoryId: string;
  ticketId: string;
  fieldType: string;
  oldValue: string | null;
  newValue: string | null;
  changedBy: string;
  changedAt: string;
  user: UserResponse;
}

// ===== MAIN TICKET RESPONSE =====

export interface TicketResponse {
  ticketId: string;
  title: string;
  description: string;
  status: TicketStatus;
  severity: TicketSeverity;
  closeReason: TicketCloseReason | null;
  
  createdAt: string;
  assignedAt: string | null;
  resolvedAt: string | null;
  dueDate: string | null;
  closedAt: string | null;
  
  // Foreign keys
  roomId: string;
  facilityTypeId: string;
  reporterId: string;
  resolverId: string | null;
  
  // Nested objects
  room: RoomResponse;
  facilityType: FacilityTypeResponse;
  reporter: UserResponse;
  resolver: UserResponse | null;
  issues: TicketIssueResponse[];
  histories: TicketHistoryResponse[];
}

// ===== REQUEST TYPES =====

export interface CreateTicketRequest {
  title: string;
  description: string;
  severity: TicketSeverity;
  roomId: string;
  facilityTypeId: string;
  issueTypeIds: string[];
}

export interface TicketParameters {
  status?: TicketStatus;
  facilityTypeId?: string;
  reporterId?: string;
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ===== PAGINATION =====

export interface PaginationMetadata {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: PaginationMetadata;
}

// ===== APPROVAL TYPES =====

export enum ApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved', 
  REJECTED = 'Rejected',
}

export enum ApprovalType {
  ORDER_PART = 'OrderPart',
  CLOSE_TICKET = 'CloseTicket',
}

export interface OrderPartApprovalRequest {
  ticketId: string;
  partDescription: string;
  estimatedCost: number;
  vendor?: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ReviewTicketApprovalRequest {
  approvalId: string;
  approvalStatus: ApprovalStatus;
  reason?: string;
  userId: string;
}

export interface CloseTicketApprovalRequest {
  ticketId: string;
  reason: string;
}

export interface TicketHistoryLogRequest {
  ticketId: string;
  fieldType: string;
  oldValue?: string;
  newValue?: string;
  changedBy: string;
}

// ===== ODATA TYPES =====

export interface ODataMetadata {
  '@odata.context': string;
  '@odata.metadataEtag'?: string;
}

export interface ODataResponse<T> {
  '@odata.context': string;
  '@odata.count'?: number;
  value: T[];
}

export interface ODataCountResponse {
  '@odata.context': string;
  value: number;
}
