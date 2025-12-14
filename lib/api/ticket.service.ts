import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
  AssignTicketRequest,
  UpdateProgressRequest,
  TicketFilters,
  PaginationParams,
  PaginatedResponse,
  TicketHistory,
} from '@/types/ticket';

export const ticketService = {
  // Get tickets with filters and pagination
  async getTickets(
    filters?: TicketFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Ticket>> {
    const params = {
      ...filters,
      ...pagination,
    };
    
    const response = await apiClient.get<PaginatedResponse<Ticket>>(
      API_ENDPOINTS.TICKETS.LIST,
      { params }
    );
    
    return response.data;
  },

  // Get ticket by ID
  async getTicketById(id: string): Promise<Ticket> {
    const response = await apiClient.get<Ticket>(
      API_ENDPOINTS.TICKETS.DETAIL(id)
    );
    return response.data;
  },

  // Create ticket
  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('severity', data.severity);
    formData.append('categoryId', data.categoryId);
    formData.append('campusId', data.campusId);
    
    if (data.roomId) formData.append('roomId', data.roomId);
    if (data.location) formData.append('location', data.location);
    
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await apiClient.post<Ticket>(
      API_ENDPOINTS.TICKETS.CREATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },

  // Update ticket
  async updateTicket(id: string, data: UpdateTicketRequest): Promise<Ticket> {
    const response = await apiClient.put<Ticket>(
      API_ENDPOINTS.TICKETS.UPDATE(id),
      data
    );
    return response.data;
  },

  // Delete ticket
  async deleteTicket(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.TICKETS.DELETE(id));
  },

  // Assign ticket to staff
  async assignTicket(id: string, data: AssignTicketRequest): Promise<Ticket> {
    const response = await apiClient.post<Ticket>(
      API_ENDPOINTS.TICKETS.ASSIGN(id),
      data
    );
    return response.data;
  },

  // Update ticket progress
  async updateProgress(id: string, data: UpdateProgressRequest): Promise<Ticket> {
    const formData = new FormData();
    formData.append('status', data.status);
    formData.append('note', data.note);
    
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await apiClient.post<Ticket>(
      API_ENDPOINTS.TICKETS.PROGRESS(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },

  // Approve waiting for parts
  async approveWaitingForParts(id: string): Promise<Ticket> {
    const response = await apiClient.post<Ticket>(
      API_ENDPOINTS.TICKETS.APPROVE_WFP(id)
    );
    return response.data;
  },

  // Approve close request
  async approveClose(id: string): Promise<Ticket> {
    const response = await apiClient.post<Ticket>(
      API_ENDPOINTS.TICKETS.APPROVE_CLOSE(id)
    );
    return response.data;
  },

  // Get ticket history
  async getTicketHistory(id: string): Promise<TicketHistory[]> {
    const response = await apiClient.get<TicketHistory[]>(
      `${API_ENDPOINTS.TICKETS.DETAIL(id)}/history`
    );
    return response.data;
  },
};

// Manager-specific services
export const managerService = {
  // Get reported tickets
  async getReportedTickets(
    filters?: TicketFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Ticket>> {
    const params = {
      ...filters,
      ...pagination,
    };
    
    const response = await apiClient.get<PaginatedResponse<Ticket>>(
      API_ENDPOINTS.MANAGER.REPORTED_TICKETS,
      { params }
    );
    
    return response.data;
  },

  // Get closed tickets
  async getClosedTickets(
    filters?: TicketFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Ticket>> {
    const params = {
      ...filters,
      ...pagination,
    };
    
    const response = await apiClient.get<PaginatedResponse<Ticket>>(
      API_ENDPOINTS.MANAGER.CLOSED_TICKETS,
      { params }
    );
    
    return response.data;
  },
};

// Staff-specific services
export const staffService = {
  // Get assigned tickets
  async getAssignedTickets(
    filters?: TicketFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Ticket>> {
    const params = {
      ...filters,
      ...pagination,
    };
    
    const response = await apiClient.get<PaginatedResponse<Ticket>>(
      API_ENDPOINTS.STAFF.ASSIGNED_TICKETS,
      { params }
    );
    
    return response.data;
  },
};
