export type NewsCategory = 'natation' | 'water-polo' | 'plongeon' | 'eau-libre' | 'general' | 'annonce';

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  publishedAt: string;
  category: NewsCategory;
  imageUrl?: string;
  slug: string;
  authorId?: string;
  authorName?: string;
  authorPhoto?: string;
  isFeatured?: boolean;
  commentCount?: number;
  viewCount?: number;
  likeCount?: number;
}

export interface NewsComment {
  id: string;
  newsId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  createdAt: string;
  parentId?: string | null;
  replies?: NewsComment[];
  likes: number;
  views: number;
  reactions: CommentReaction[];
}

export interface CommentReaction {
  emoji: string;
  count: number;
  userHasReacted: boolean;
}

export interface NewsFilter {
  category?: string;
  search?: string;
}
