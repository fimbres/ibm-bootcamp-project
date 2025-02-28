import {
  QueryClient,
  UseQueryOptions,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { ApiResponse, ApiService } from "./api.service";

export class PostService extends ApiService {
  constructor(queryClient?: QueryClient) {
    super(queryClient);
  }

  async readPosts(): Promise<ApiResponse<any[]>> {
    return this.request("GET", "/api/v1/posts");
  }

  useReadPosts(options?: UseQueryOptions<any[], any, any, any>) {
    return useQuery<any[], any>({
      queryKey: ["posts"],
      queryFn: async () => {
        const response = await this.readPosts();
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data || [];
      },
      ...options,
    });
  }

  async createPost(data: any): Promise<ApiResponse<any>> {
    return this.request("POST", "/api/v1/posts", data);
  }

  useCreatePost() {
    return useMutation(
      async (data: any) => {
        const response = await this.createPost(data);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
      {
        onSuccess: () => {
          this.queryClient?.invalidateQueries(["posts"]);
          this.queryClient?.invalidateQueries(["feed"]);
        },
      }
    );
  }

  async getFeed(): Promise<ApiResponse<any[]>> {
    return this.request("GET", "/api/v1/posts/feed");
  }

  useGetFeed(options?: UseQueryOptions<any[], any, any, any>) {
    return useQuery<any[], any>({
      queryKey: ["feed"],
      queryFn: async () => {
        const response = await this.getFeed();
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data || [];
      },
      ...options,
    });
  }

  async findPostsByUserId(userId: string): Promise<ApiResponse<any[]>> {
    return this.request("GET", `/api/v1/posts/users/${userId}`);
  }

  useFindPostsByUserId(
    userId: string,
    options?: UseQueryOptions<any[], any, any, any>
  ) {
    return useQuery<any[], any>({
      queryKey: ["posts", userId],
      queryFn: async () => {
        const response = await this.findPostsByUserId(userId);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data || [];
      },
      enabled: !!userId,
      ...options,
    });
  }

  async deletePost(postId: string): Promise<ApiResponse<any>> {
    return this.request("DELETE", `/api/v1/posts/${postId}`);
  }

  useDeletePost() {
    return useMutation(
      async (postId: string) => {
        const response = await this.deletePost(postId);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
      {
        onSuccess: () => {
          this.queryClient?.invalidateQueries(["posts"]);
          this.queryClient?.invalidateQueries(["feed"]);
        },
      }
    );
  }

  async updatePost(postId: string, data: any): Promise<ApiResponse<any>> {
    return this.request("PUT", `/api/v1/posts/${postId}`, data);
  }

  useUpdatePost() {
    return useMutation(
      async ({ postId, data }: { postId: string; data: any }) => {
        const response = await this.updatePost(postId, data);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
      {
        onSuccess: () => {
          this.queryClient?.invalidateQueries(["posts"]);
          this.queryClient?.invalidateQueries(["feed"]);
        },
      }
    );
  }

  async patchPost(postId: string, data: any): Promise<ApiResponse<any>> {
    return this.request("PATCH", `/api/v1/posts/${postId}`, data);
  }

  usePatchPost() {
    return useMutation(
      async ({ postId, data }: { postId: string; data: any }) => {
        const response = await this.patchPost(postId, data);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
      {
        onSuccess: () => {
          this.queryClient?.invalidateQueries(["posts"]);
          this.queryClient?.invalidateQueries(["feed"]);
        },
      }
    );
  }
}
