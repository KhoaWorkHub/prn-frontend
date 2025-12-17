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
    const response = await apiClient.get<TicketResponse[]>(
      API_ENDPOINTS.STAFF.ASSIGNED_TICKETS,
      { params }
    );
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
    if (request.reason) {
      formData.append('reason', request.reason);
    }

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
};
