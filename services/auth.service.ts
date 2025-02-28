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

export class AuthService extends ApiService {
  constructor(queryClient?: QueryClient) {
    super(queryClient);
  }

  async auth(data: AuthInput): Promise<ApiResponse<AuthResponse>> {
    return this.request("POST", "/auth", data);
  }

  async register(data: RegisterInput): Promise<ApiResponse<AuthResponse>> {
    return this.request("POST", "/auth/register", data);
  }
}
