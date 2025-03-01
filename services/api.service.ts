import { QueryClient } from "@tanstack/react-query";
import axios, { AxiosHeaders, AxiosInstance, AxiosRequestConfig } from "axios";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export class ApiService {
  private readonly apiClient: AxiosInstance;
  protected readonly queryClient?: QueryClient;

  constructor(queryClient?: QueryClient) {
    this.apiClient = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL,
      timeout: 10000,
    });
    this.queryClient = queryClient;
  }

  async request<T, D>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    url: string,
    sessionToken?: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const headers = new AxiosHeaders()
        .setAuthorization(`Bearer ${sessionToken}`)
        .setContentType("application/json");

        console.log(url)

      const response = await this.apiClient.request<T>({
        method,
        url,
        data,
        headers,
        ...config,
      });

      console.log(response.status, method, url)
  
      return {
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      let errorMessage = "An unexpected error occurred.";
      let statusCode = 500;
  
      if (axios.isAxiosError(error)) {
        console.error(error);
        if (error.response) {
          errorMessage = error.response.data?.message || "Request failed";
          statusCode = error.response.status;
        } else if (error.request) {
          errorMessage = "No response received from server.";
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        console.log(error)
        errorMessage = error.message;
      }
  
      return {
        data: null,
        error: errorMessage,
        status: statusCode,
      };
    }
  }
}
