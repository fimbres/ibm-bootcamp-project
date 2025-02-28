import { QueryClient } from "@tanstack/react-query";
import { ApiResponse, ApiService } from "./api.service";
import { Post } from "~/types/db";

export interface CreatePostInput {
  text: string;
  media?: string;
  token?: string | null;
}

export class PostService extends ApiService {
  constructor(queryClient?: QueryClient) {
    super(queryClient);
  }

  async readPosts(sessionToken: string): Promise<ApiResponse<Post[]>> {
    return this.request("GET", "/posts", sessionToken);
  }

  async createPost(data: CreatePostInput): Promise<ApiResponse<Post>> {
    const { token, ...rest } = data;

    return this.request("POST", "/posts", token!, {
      ...rest,
      likes: [],
      comments: [],
    });
  }

  async getFeed(sessionToken: string): Promise<ApiResponse<Post[]>> {
    return this.request("GET", "/posts/feed", sessionToken);
  }

  async findPostsByUserId(userId: string): Promise<ApiResponse<any[]>> {
    return this.request("GET", `/api/v1/posts/users/${userId}`);
  }

  async deletePost(postId: string): Promise<ApiResponse<any>> {
    return this.request("DELETE", `/api/v1/posts/${postId}`);
  }

  async updatePost(postId: string, data: any): Promise<ApiResponse<any>> {
    return this.request("PUT", `/api/v1/posts/${postId}`, data);
  }

  async patchPost(postId: string, data: any): Promise<ApiResponse<any>> {
    return this.request("PATCH", `/api/v1/posts/${postId}`, data);
  }
}
