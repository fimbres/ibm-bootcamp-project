import { QueryClient } from "@tanstack/react-query";

import { ApiResponse, ApiService } from "./api.service";

export interface AuthInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

export class UserService extends ApiService {
  constructor(queryClient?: QueryClient) {
    super(queryClient);
  }

  async auth(data: AuthInput): Promise<ApiResponse<AuthResponse>> {
    return this.request("POST", "/auth", undefined, data);
  }

  async register(data: RegisterInput): Promise<ApiResponse<AuthResponse>> {
    return this.request("POST", "/auth/register", undefined, data);
  }

  async getFollowersByUserId(token: string, userId: string): Promise<ApiResponse<any>> {
    return this.request("GET", `/users/${userId}/followers`, token);
  }

  async getFollowingByUserId(token: string, userId: string): Promise<ApiResponse<any>> {
    return this.request("GET", `/users/${userId}/following`, token);
  }

  async followUser(token: string, data: any): Promise<ApiResponse<any>> {
    return this.request("POST", "/follows", token, data);
  }

  async unfollowUser(token: string, userId: string): Promise<ApiResponse<any>> {
    return this.request("DELETE", `/follows/${userId}`, token);
  }
}
