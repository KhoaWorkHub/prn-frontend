// User Roles - EXACTLY matching backend DbSeeder
export enum UserRole {
  ADMINISTRATOR = 'Administrator',  // Backend: "Administrator"
  MANAGER = 'Manager',               // Backend: "Manager"
  STAFF = 'Staff',                   // Backend: "Staff"
  REPORTER = 'Reporter',             // Backend: "Reporter"
}

// Auth Types matching backend exactly
export interface LoginRequest {
  email: string;      // Backend uses email, not username!
  password: string;
}

export interface LoginResponse {
  accessToken: string; // Backend returns string directly
  // refreshToken is in httpOnly cookie, not in response!
}

export interface RegisterRequest {
  email: string;
  username: string;    // Backend calls it userName but we use username
  password: string;
  // Backend doesn't require confirmPassword
}

export interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  joinedDate: string;
  roles: UserRole[];
}

export interface RefreshTokenRequest {
  // Backend reads from cookie, no request body needed
}

export interface RefreshTokenResponse {
  accessToken: string; // Backend returns string directly
  // refreshToken updated in cookie
}
