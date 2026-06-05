import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { News, NewsComment } from '../../../core/models/news.model';
import { PagedResult } from '../../../core/models/result.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  constructor(private api: ApiService) {}

  private pageFrom<T>(p: any, page: number, pageSize: number, mapper: (x: any) => T): PagedResult<T> {
    return {
      data: (p.data ?? []).map(mapper),
      total: p.totalCount ?? 0,
      page,
      pageSize,
    };
  }

  getAll(filter: { category?: string; search?: string } = {}, page = 1, pageSize = 12): Observable<PagedResult<News>> {
    const params: any = { page: page - 1, size: pageSize };
    if (filter.category) params.category = filter.category;
    if (filter.search) params.search = filter.search;
    return this.api.get<any>('/news', params).pipe(
      map(p => this.pageFrom(p, page, pageSize, (n: any) => n as News))
    );
  }

  getBySlug(slug: string): Observable<News> {
    return this.api.get<any>(`/news/${slug}`).pipe(
      map(r => (r.data ?? r) as News)
    );
  }

  getFeatured(): Observable<News[]> {
    return this.api.get<any>('/news/featured').pipe(
      map(r => ((r.data ?? r) ?? []) as News[])
    );
  }

  getComments(newsId: string): Observable<NewsComment[]> {
    return this.api.get<any[]>(`/news/${newsId}/comments`).pipe(
      map(arr => (arr ?? []).map(c => this.mapComment(c)))
    );
  }

  addComment(newsId: string, content: string, parentId?: string): Observable<NewsComment> {
    return this.api.post<any>(`/news/${newsId}/comments`, { content, parentId }).pipe(
      map(c => this.mapComment(c.data ?? c))
    );
  }

  reactToComment(newsId: string, commentId: string, emoji: string): Observable<any> {
    return this.api.post<any>(`/news/${newsId}/comments/${commentId}/react`, { emoji });
  }

  likeComment(newsId: string, commentId: string): Observable<any> {
    return this.api.post<any>(`/news/${newsId}/comments/${commentId}/like`, {});
  }

  private mapComment(c: any): NewsComment {
    return {
      ...c,
      replies: (c.replies ?? []).map((r: any) => this.mapComment(r)),
    };
  }
}
