export type NewsCategory = 'natation' | 'water-polo' | 'plongeon' | 'eau-libre' | 'general' | 'annonce';

export interface AuthorDto {
  id: number;
  firstName: string;
  lastName: string;
}

export interface News {
  id: number;
  title: string;
  description: string;
  category: NewsCategory;
  date: string;
  author: AuthorDto;
  comments: NewsComment[];
  createdAt: string;
}

export interface NewsComment {
  id: number;
  content: string;
  fileUrl?: string;
  author: AuthorDto;
  createdAt: string;
  parentCommentId?: number | null;
  replies?: NewsComment[];
}

export interface NewsFilter {
  category?: string;
  search?: string;
}
