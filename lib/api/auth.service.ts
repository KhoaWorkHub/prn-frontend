import apiClient, { setToken, setRefreshToken, clearTokens } from './client';
import { API_ENDPOINTS } from './config';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/auth';

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    const { accessToken, refreshToken } = response.data;
    setToken(accessToken);
    setRefreshToken(refreshToken);
    
    return response.data;
  },

  // Register
  async register(data: RegisterRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.CURRENT_USER);
    return response.data;
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    setToken(accessToken);
    setRefreshToken(newRefreshToken);
    
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      clearTokens();
    }
  },
};
