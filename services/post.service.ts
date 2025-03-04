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

  async findPostsByUserId(token: string, userId: string): Promise<ApiResponse<Post[]>> {
    return this.request("GET", `/posts/users/${userId}`,token);
  }

  async deletePost(token: string, postId: string): Promise<ApiResponse<void>> {
    return this.request("DELETE", `/posts/${postId}`, token);
  }

  async updatePost(postId: string, data: any): Promise<ApiResponse<Post>> {
    return this.request("PUT", `/posts/${postId}`, data);
  }

  async likePost(sessionToken: string, data: any) {
    return this.request("POST", "/likes", sessionToken, data);
  }

  async unlikePost(sessionToken: string, likeId: string) {
    return this.request("DELETE", `/likes/${likeId}`, sessionToken);
  }

  async commentPost(sessionToken: string, data: any) {
    return this.request("POST", `/commets`, sessionToken, data);
  }

  async unCommentPost(sessionToken: string, comment: string) {
    return this.request("DELETE", `/commets/${comment}`, sessionToken);
  }
}
