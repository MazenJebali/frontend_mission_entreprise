import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { News, NewsComment } from '../../../core/models/news.model';
import { PagedResult } from '../../../core/models/result.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  constructor(private api: ApiService) {}

  private pageFrom<T>(p: any, page: number, pageSize: number): PagedResult<T> {
    return {
      data: (p.data ?? []) as T[],
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
      map(p => this.pageFrom<News>(p, page, pageSize))
    );
  }

  getById(id: number): Observable<News> {
    return this.api.get<any>(`/news/${id}`).pipe(
      map(r => (r.data ?? r) as News)
    );
  }

  addComment(newsId: number, content: string, parentCommentId?: number | null, fileUrl?: string): Observable<NewsComment> {
    const body: any = { content, parentCommentId: parentCommentId ?? 0 };
    if (fileUrl) body.fileUrl = fileUrl;
    return this.api.post<any>(`/news/${newsId}/comments`, body).pipe(
      map(r => (r.data ?? r) as NewsComment)
    );
  }
}
