import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type {
  TicketResponse,
  CreateTicketRequest,
  TicketParameters,
} from '@/types/ticket';

export const ticketService = {
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
    await apiClient.post(API_ENDPOINTS.TICKETS.CREATE, data);
    // Backend returns 201 with no body
  },
};
