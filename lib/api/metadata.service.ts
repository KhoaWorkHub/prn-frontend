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
    try {
      // Try the main metadata endpoint first
      const response = await apiClient.get<MetadataResponse>(
        API_ENDPOINTS.DATA.METADATA
      );
      return response.data;
    } catch (error: any) {
      console.warn('Main metadata endpoint failed, trying individual endpoints...', error.message);
      
      // Try individual endpoints as fallback
      try {
        const [campuses, rooms, facilityTypes, issueTypes] = await Promise.all([
          this.getCampuses().catch(() => []),
          this.getRooms().catch(() => []),
          this.getFacilityTypes().catch(() => []),
          this.getIssueTypes().catch(() => []),
        ]);
        
        if (campuses.length > 0 || rooms.length > 0 || facilityTypes.length > 0 || issueTypes.length > 0) {
          console.info('Retrieved some data from individual endpoints');
          return { campuses, rooms, facilityTypes, issueTypes };
        }
      } catch (individualError) {
        console.warn('Individual endpoints also failed:', individualError);
      }
      
      console.warn('All endpoints failed, using fallback seed data...');
      
      // Fallback: return seed data so users can still create tickets
      return {
        campuses: [
          { campusId: "11111111-1111-1111-1111-111111111111", campusName: "HCM Campus" },
          { campusId: "22222222-2222-2222-2222-222222222222", campusName: "Hanoi Campus" },
          { campusId: "33333333-3333-3333-3333-333333333333", campusName: "Da Nang Campus" },
          { campusId: "44444444-4444-4444-4444-444444444444", campusName: "Can Tho Campus" },
        ],
        rooms: [
          { roomId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", roomName: "Room A101", campusId: "11111111-1111-1111-1111-111111111111" },
          { roomId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", roomName: "Room A201", campusId: "11111111-1111-1111-1111-111111111111" },
          { roomId: "cccccccc-cccc-cccc-cccc-cccccccccccc", roomName: "Room B101", campusId: "22222222-2222-2222-2222-222222222222" },
          { roomId: "dddddddd-dddd-dddd-dddd-dddddddddddd", roomName: "Room B201", campusId: "22222222-2222-2222-2222-222222222222" },
          { roomId: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee", roomName: "Room C101", campusId: "33333333-3333-3333-3333-333333333333" },
          { roomId: "ffffffff-ffff-ffff-ffff-ffffffffffff", roomName: "Room D101", campusId: "44444444-4444-4444-4444-444444444444" },
        ],
        facilityTypes: [
          { facilityTypeId: "12345678-1234-1234-1234-123456780001", facilityName: "Electrical" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780002", facilityName: "Plumbing" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780003", facilityName: "Air Conditioning" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780004", facilityName: "Furniture" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780005", facilityName: "IT Equipment" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780006", facilityName: "Lighting" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780007", facilityName: "Security" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780008", facilityName: "Other" },
        ],
        issueTypes: [
          { issueTypeId: "87654321-4321-4321-4321-210987654321", issueName: "Power Failure", facilityTypeId: "12345678-1234-1234-1234-123456780001" },
          { issueTypeId: "87654321-4321-4321-4321-210987654322", issueName: "Socket Not Working", facilityTypeId: "12345678-1234-1234-1234-123456780001" },
          { issueTypeId: "87654321-4321-4321-4321-210987654323", issueName: "Water Leak", facilityTypeId: "12345678-1234-1234-1234-123456780002" },
          { issueTypeId: "87654321-4321-4321-4321-210987654324", issueName: "No Water Pressure", facilityTypeId: "12345678-1234-1234-1234-123456780002" },
          { issueTypeId: "87654321-4321-4321-4321-210987654325", issueName: "AC Not Cooling", facilityTypeId: "12345678-1234-1234-1234-123456780003" },
          { issueTypeId: "87654321-4321-4321-4321-210987654326", issueName: "AC Making Noise", facilityTypeId: "12345678-1234-1234-1234-123456780003" },
          { issueTypeId: "87654321-4321-4321-4321-210987654327", issueName: "Broken Chair", facilityTypeId: "12345678-1234-1234-1234-123456780004" },
          { issueTypeId: "87654321-4321-4321-4321-210987654328", issueName: "Broken Table", facilityTypeId: "12345678-1234-1234-1234-123456780004" },
          { issueTypeId: "87654321-4321-4321-4321-210987654329", issueName: "Computer Not Working", facilityTypeId: "12345678-1234-1234-1234-123456780005" },
          { issueTypeId: "87654321-4321-4321-4321-210987654330", issueName: "Projector Issues", facilityTypeId: "12345678-1234-1234-1234-123456780005" },
          { issueTypeId: "87654321-4321-4321-4321-210987654331", issueName: "Light Not Working", facilityTypeId: "12345678-1234-1234-1234-123456780006" },
          { issueTypeId: "87654321-4321-4321-4321-210987654332", issueName: "Security Camera Issue", facilityTypeId: "12345678-1234-1234-1234-123456780007" },
          { issueTypeId: "87654321-4321-4321-4321-210987654333", issueName: "Other Issue", facilityTypeId: "12345678-1234-1234-1234-123456780008" },
        ],
      };
    }
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