export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Like {
  id: string;
  post: string;
  user: User;
}

export interface Post {
  id: string;
  media: string;
  text: string;
  likes: Like[];
  comments: string[];
  user: User;
  createdAt: string;
}

export type Posts = Post[];
