import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type {
  FacilityTypeResponse,
  IssueTypeResponse,
  RoomResponse,
  CampusResponse,
} from '@/types/ticket';

export interface MetadataResponse {
  campuses: CampusResponse[];
  rooms: RoomResponse[];
  facilityTypes: FacilityTypeResponse[];
  issueTypes: IssueTypeResponse[];
}

export const metadataService = {
  // Get all metadata (campuses, rooms, facility types, issue types)
  async getMetadata(): Promise<MetadataResponse> {
    const response = await apiClient.get<MetadataResponse>(
      API_ENDPOINTS.DATA.METADATA
    );
    return response.data;
  },

  // Get metadata root endpoint
  async getDataRoot(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.DATA.ROOT);
    return response.data;
  },

  // Individual metadata endpoints (for potential future use)
  async getCampuses(): Promise<CampusResponse[]> {
    const response = await apiClient.get<CampusResponse[]>('/api/campuses');
    return response.data;
  },

  async getRooms(campusId?: string): Promise<RoomResponse[]> {
    const params = campusId ? { campusId } : undefined;
    const response = await apiClient.get<RoomResponse[]>('/api/rooms', { params });
    return response.data;
  },

  async getFacilityTypes(): Promise<FacilityTypeResponse[]> {
    const response = await apiClient.get<FacilityTypeResponse[]>('/api/facility-types');
    return response.data;
  },

  async getIssueTypes(): Promise<IssueTypeResponse[]> {
    const response = await apiClient.get<IssueTypeResponse[]>('/api/issue-types');
    return response.data;
  },
};