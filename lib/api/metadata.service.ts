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
      console.log('🔄 Fetching metadata from:', API_ENDPOINTS.DATA.METADATA);
      const response = await apiClient.get<MetadataResponse>(
        API_ENDPOINTS.DATA.METADATA
      );
      console.log('✅ Metadata received from backend:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Main metadata endpoint failed:', error.response?.status, error.message);
      
      // Try individual endpoints as fallback
      try {
        console.log('🔄 Trying individual endpoints...');
        const [campuses, rooms, facilityTypes, issueTypes] = await Promise.all([
          this.getCampuses().catch((e) => {
            console.warn('Campuses API failed:', e.message);
            return [];
          }),
          this.getRooms().catch((e) => {
            console.warn('Rooms API failed:', e.message);
            return [];
          }),
          this.getFacilityTypes().catch((e) => {
            console.warn('FacilityTypes API failed:', e.message);
            return [];
          }),
          this.getIssueTypes().catch((e) => {
            console.warn('IssueTypes API failed:', e.message);
            return [];
          }),
        ]);
        
        if (campuses.length > 0 || rooms.length > 0 || facilityTypes.length > 0 || issueTypes.length > 0) {
          console.info('✅ Retrieved some data from individual endpoints');
          return { campuses, rooms, facilityTypes, issueTypes };
        }
      } catch (individualError) {
        console.error('❌ Individual endpoints also failed:', individualError);
      }
      
      console.warn('⚠️ All endpoints failed, using fallback seed data...');
      
      // Fallback: return seed data so users can still create tickets
      return {
        campuses: [
          { campusId: "11111111-1111-1111-1111-111111111111", name: "HCM Campus" },
          { campusId: "22222222-2222-2222-2222-222222222222", name: "Hanoi Campus" },
          { campusId: "33333333-3333-3333-3333-333333333333", name: "Da Nang Campus" },
          { campusId: "44444444-4444-4444-4444-444444444444", name: "Can Tho Campus" },
        ],
        rooms: [
          { roomId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", name: "Room A101", campus: { campusId: "11111111-1111-1111-1111-111111111111", name: "HCM Campus" } },
          { roomId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", name: "Room A201", campus: { campusId: "11111111-1111-1111-1111-111111111111", name: "HCM Campus" } },
          { roomId: "cccccccc-cccc-cccc-cccc-cccccccccccc", name: "Room B101", campus: { campusId: "22222222-2222-2222-2222-222222222222", name: "Hanoi Campus" } },
          { roomId: "dddddddd-dddd-dddd-dddd-dddddddddddd", name: "Room B201", campus: { campusId: "22222222-2222-2222-2222-222222222222", name: "Hanoi Campus" } },
          { roomId: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee", name: "Room C101", campus: { campusId: "33333333-3333-3333-3333-333333333333", name: "Da Nang Campus" } },
          { roomId: "ffffffff-ffff-ffff-ffff-ffffffffffff", name: "Room D101", campus: { campusId: "44444444-4444-4444-4444-444444444444", name: "Can Tho Campus" } },
        ],
        facilityTypes: [
          { facilityTypeId: "12345678-1234-1234-1234-123456780001", name: "Electrical" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780002", name: "Plumbing" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780003", name: "Air Conditioning" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780004", name: "Furniture" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780005", name: "IT Equipment" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780006", name: "Lighting" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780007", name: "Security" },
          { facilityTypeId: "12345678-1234-1234-1234-123456780008", name: "Other" },
        ],
        issueTypes: [
          { issueTypeId: "87654321-4321-4321-4321-210987654321", name: "Power Failure" },
          { issueTypeId: "87654321-4321-4321-4321-210987654322", name: "Socket Not Working" },
          { issueTypeId: "87654321-4321-4321-4321-210987654323", name: "Water Leak" },
          { issueTypeId: "87654321-4321-4321-4321-210987654324", name: "No Water Pressure" },
          { issueTypeId: "87654321-4321-4321-4321-210987654325", name: "AC Not Cooling" },
          { issueTypeId: "87654321-4321-4321-4321-210987654326", name: "AC Making Noise" },
          { issueTypeId: "87654321-4321-4321-4321-210987654327", name: "Broken Chair" },
          { issueTypeId: "87654321-4321-4321-4321-210987654328", name: "Broken Table" },
          { issueTypeId: "87654321-4321-4321-4321-210987654329", name: "Computer Not Working" },
          { issueTypeId: "87654321-4321-4321-4321-210987654330", name: "Projector Issues" },
          { issueTypeId: "87654321-4321-4321-4321-210987654331", name: "Light Not Working" },
          { issueTypeId: "87654321-4321-4321-4321-210987654332", name: "Security Camera Issue" },
          { issueTypeId: "87654321-4321-4321-4321-210987654333", name: "Other Issue" },
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