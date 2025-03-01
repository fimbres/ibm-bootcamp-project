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

export interface Comment {
  id: string;
  post: string;
  comment: string;
  user: User;
}

export interface Post {
  id: string;
  media: string;
  text: string;
  likes: Like[];
  comments: Comment[];
  user: User;
  createdAt: string;
}

export type Posts = Post[];
