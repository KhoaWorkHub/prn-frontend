import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type {
  TicketResponse,
  CreateTicketRequest,
  TicketParameters,
  OrderPartApprovalRequest,
  ReviewTicketApprovalRequest,
  CloseTicketApprovalRequest,
  ODataResponse,
  ODataCountResponse,
  PaginationMetadata,
} from '@/types/ticket';

export const ticketService = {
  // ===== MAIN TICKET CRUD =====
  
  // Get tickets with filters and pagination
  // Backend returns array directly, pagination in X-Pagination header
  async getTickets(params?: TicketParameters): Promise<TicketResponse[]> {
    const response = await apiClient.get<TicketResponse[]>(
      API_ENDPOINTS.TICKETS.LIST,
      { params }
    );
    
    // TODO: Parse X-Pagination header if needed
    // const paginationHeader = response.headers['x-pagination'];
    
    return response.data;
  },

  // Get ticket by ID
  async getTicketById(id: string): Promise<TicketResponse> {
    const response = await apiClient.get<TicketResponse>(
      API_ENDPOINTS.TICKETS.DETAIL(id)
    );
    return response.data;
  },

  // Create ticket (Reporter only)
  async createTicket(data: CreateTicketRequest): Promise<void> {
    console.log('🎫 Creating ticket with payload:', JSON.stringify(data, null, 2));
    
    try {
      const response = await apiClient.post(API_ENDPOINTS.TICKETS.CREATE, data);
      console.log('✅ Ticket created successfully:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('❌ Create ticket failed:');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('Full Error:', error);
      
      if (error.response?.status === 401) {
        throw new Error('You need to login first to create tickets');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid ticket data: ' + (error.response?.data?.message || 'Please check all fields'));
      } else if (error.response?.status === 500) {
        throw new Error('Server error occurred. Please try again or contact support.');
      }
      
      throw error;
    }
  },

  // ===== STAFF-SPECIFIC ENDPOINTS =====

  // Get staff's assigned tickets
  async getStaffAssignedTickets(params?: TicketParameters): Promise<TicketResponse[]> {
    console.log('🔥 STAFF API CALL: Making request to', API_ENDPOINTS.STAFF.ASSIGNED_TICKETS);
    const response = await apiClient.get<TicketResponse[]>(
      API_ENDPOINTS.STAFF.ASSIGNED_TICKETS,
      { params }
    );
    console.log('🔥 STAFF API RESPONSE:', response.data);
    return response.data;
  },

  // Get staff's specific assigned ticket by ID
  async getStaffAssignedTicketById(ticketId: string): Promise<TicketResponse> {
    const response = await apiClient.get<TicketResponse>(
      API_ENDPOINTS.STAFF.ASSIGNED_TICKET_DETAIL(ticketId)
    );
    return response.data;
  },

  // ===== REPORTER-SPECIFIC ENDPOINTS =====

  // Get reporter's reported tickets
  async getReporterReportedTickets(params?: TicketParameters): Promise<TicketResponse[]> {
    const response = await apiClient.get<TicketResponse[]>(
      API_ENDPOINTS.REPORTER.REPORTED_TICKETS,
      { params }
    );
    return response.data;
  },

  // Get reporter's specific reported ticket by ID
  async getReporterReportedTicketById(ticketId: string): Promise<TicketResponse> {
    const response = await apiClient.get<TicketResponse>(
      API_ENDPOINTS.REPORTER.REPORTED_TICKET_DETAIL(ticketId)
    );
    return response.data;
  },

  // ===== APPROVAL WORKFLOW ENDPOINTS =====

  // Request order part approval (Staff)
  async requestOrderPartApproval(
    request: OrderPartApprovalRequest, 
    staffId: string
  ): Promise<void> {
    await apiClient.post(API_ENDPOINTS.APPROVAL.ORDER_PART, request, {
      params: { staffId }
    });
  },

  // Review ticket approval (Manager/Admin)
  async reviewTicketApproval(request: ReviewTicketApprovalRequest): Promise<void> {
    const formData = new FormData();
    formData.append('approvalId', request.approvalId);
    formData.append('approvalStatus', request.approvalStatus);
    formData.append('userId', request.userId);
    // Note: backend model doesn't support reason field

    await apiClient.post(API_ENDPOINTS.APPROVAL.REVIEW, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Request close approval (Staff)
  async requestCloseApproval(
    request: CloseTicketApprovalRequest,
    userId: string
  ): Promise<void> {
    const formData = new FormData();
    formData.append('ticketId', request.ticketId);
    formData.append('reason', request.reason);

    await apiClient.post(API_ENDPOINTS.APPROVAL.CLOSE_APPROVAL, formData, {
      params: { userId },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // ===== WORKFLOW ACTIONS - Real Backend APIs =====
  
  // Start working on a ticket (Staff)
  async startTicket(data: { ticketId: string, notes?: string }): Promise<void> {
    await apiClient.post('/api/start-ticket', {
      ticketId: data.ticketId,
      notes: data.notes || ''
    });
  },

  // Complete ticket work (Staff)
  async completeTicket(data: { ticketId: string, completionNotes: string, resolution: string }): Promise<void> {
    await apiClient.post('/api/complete-ticket', {
      ticketId: data.ticketId,
      completionNotes: data.completionNotes,
      resolution: data.resolution
    });
  },

  // Reassign ticket to another staff member (Manager/Admin)
  async reassignTicket(ticketId: string, newUserId: string, reason: string): Promise<void> {
    await apiClient.post('/api/reassign-ticket', {
      ticketId,
      newUserId,
      reason
    });
  },

  // Unassign ticket from current staff (Staff/Manager/Admin)
  async unassignTicket(data: { ticketId: string, reason: string }): Promise<void> {
    await apiClient.post('/api/unassign-ticket', {
      ticketId: data.ticketId,
      reason: data.reason
    });
  },

  // Reopen a closed ticket (Manager/Admin)
  async reopenTicket(data: { ticketId: string, reason: string }): Promise<void> {
    await apiClient.post('/api/reopen-ticket', {
      ticketId: data.ticketId,
      reason: data.reason
    });
  },

  // Cancel a ticket (Manager/Admin)
  async cancelTicket(data: { ticketId: string, reason: string }): Promise<void> {
    await apiClient.post('/api/cancel-ticket', {
      ticketId: data.ticketId,
      reason: data.reason
    });
  },

  // Close a ticket (Manager/Admin)
  async closeTicket(ticketId: string, closeReason: string, notes: string): Promise<void> {
    await apiClient.post('/api/close-ticket', {
      ticketId,
      closeReason,
      notes
    });
  },

  // Assign ticket to staff member (Manager/Admin)
  async assignTicket(ticketId: string, assignedToUserId: string, notes?: string): Promise<void> {
    await apiClient.post('/api/assign-ticket', {
      ticketId,
      assignedToUserId,
      notes: notes || '',
      priority: 'Medium',
      estimatedHours: 1
    });
  },

  // ===== USER MANAGEMENT =====
  
  // Get available staff for assignment
  async getAvailableStaff(): Promise<Array<{id: string, userName: string, email: string, role?: string}>> {
    console.log('🔄 Getting available staff from seeded data (no Users API exists)...')
    
    // Backend doesn't have Users API, using seeded users from DbSeeder.cs migration
    const seededStaff = [
      { 
        id: "e5d8947f-6794-42b6-ba67-201f366128b8", 
        userName: "administrator", 
        email: "administrator@gmail.com", 
        role: "Administrator" 
      },
      { 
        id: "9c24cbb9-0c15-4e4b-9c3b-0a3f3d111111", 
        userName: "manager1", 
        email: "manager1@gmail.com", 
        role: "Manager" 
      },
      { 
        id: "3fe77296-fdb3-4d71-8b99-ef8380c32037", 
        userName: "staff1", 
        email: "staff1@gmail.com", 
        role: "Staff" 
      }
    ];
    
    // Return all users that can be assigned (Staff, Manager, Administrator)
    console.log('✅ Got seeded staff:', seededStaff.length)
    return seededStaff;
  },

  // ===== ODATA ENDPOINTS =====

  // Get OData metadata
  async getODataMetadata(): Promise<string> {
    const response = await apiClient.get<string>(
      API_ENDPOINTS.ODATA.METADATA,
      {
        headers: {
          'Accept': 'application/xml',
        },
      }
    );
    return response.data;
  },

  // Get OData tickets
  async getODataTickets(query?: string): Promise<ODataResponse<TicketResponse>> {
    const url = query ? `${API_ENDPOINTS.ODATA.TICKETS}?${query}` : API_ENDPOINTS.ODATA.TICKETS;
    const response = await apiClient.get<ODataResponse<TicketResponse>>(url);
    return response.data;
  },

  // Get OData tickets count
  async getODataTicketsCount(filter?: string): Promise<number> {
    const url = filter ? 
      `${API_ENDPOINTS.ODATA.TICKETS_COUNT}?$filter=${encodeURIComponent(filter)}` : 
      API_ENDPOINTS.ODATA.TICKETS_COUNT;
    const response = await apiClient.get<number>(url);
    return response.data;
  },

  // ===== NOTE: Advanced operations not available in backend =====
  
  // Bulk operations - NOT IMPLEMENTED in backend
  // Export tickets - NOT IMPLEMENTED in backend  
  // Statistics - NOT IMPLEMENTED in backend
  
  // The backend only provides the approval workflow for ticket management
};
