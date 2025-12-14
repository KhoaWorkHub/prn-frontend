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
  // Login - Backend returns string (accessToken), refreshToken in cookie
  async login(credentials: LoginRequest): Promise<string> {
    const response = await apiClient.post<string>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // Backend returns accessToken as string directly
    const accessToken = response.data;
    setToken(accessToken);
    // refreshToken is set in httpOnly cookie by backend
    
    return accessToken;
  },

  // Register - Backend returns 201 with no body
  async register(data: RegisterRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      email: data.email,
      userName: data.username, // Backend expects userName (camelCase)
      password: data.password,
    });
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.CURRENT_USER);
    return response.data;
  },

  // Refresh token - Backend reads from cookie
  async refreshToken(): Promise<string> {
    const response = await apiClient.post<string>(
      API_ENDPOINTS.AUTH.REFRESH,
      {}, // No body needed, backend reads from cookie
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    
    const accessToken = response.data;
    setToken(accessToken);
    // refreshToken updated in cookie by backend
    
    return accessToken;
  },

  // Logout - Clear cookie on backend
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      clearTokens();
      // Backend also deletes refreshToken cookie
    }
  },
};
