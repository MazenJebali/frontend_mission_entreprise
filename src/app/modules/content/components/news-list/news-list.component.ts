import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { News, NewsFilter } from '../../../../core/models/news.model';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
  news: News[] = [];
  total = 0;
  page = 1;
  pageSize = 12;
  loading = false;
  initialLoading = true;

  filter: NewsFilter = { category: '', search: '' };

  categories: { value: string; label: string; icon: string }[] = [
    { value: '', label: 'Toutes', icon: '📰' },
    { value: 'natation', label: 'Natation', icon: '🏊' },
    { value: 'water-polo', label: 'Water-Polo', icon: '🤽' },
    { value: 'plongeon', label: 'Plongeon', icon: '🤿' },
    { value: 'eau-libre', label: 'Eau Libre', icon: '🌊' },
    { value: 'general', label: 'Général', icon: '📋' },
    { value: 'annonce', label: 'Annonce', icon: '📢' }
  ];

  constructor(
    private contentService: ContentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.contentService.getAll(this.filter, this.page, this.pageSize).subscribe({
      next: res => {
        this.news = res.data;
        this.total = res.total;
        this.loading = false;
        this.initialLoading = false;
      },
      error: () => {
        this.loading = false;
        this.initialLoading = false;
      }
    });
  }

  applyFilter(category?: string): void {
    if (category !== undefined) this.filter.category = category;
    this.page = 1;
    this.load();
  }

  clearFilter(): void {
    this.filter = { category: '', search: '' };
    this.page = 1;
    this.load();
  }

  onSearch(): void {
    this.page = 1;
    this.load();
  }

  onPageChange(p: number): void {
    this.page = p;
    this.load();
  }

  navigateTo(id: number): void {
    this.router.navigate(['/news', id]);
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  categoryLabel(cat: string): string {
    const labels: Record<string, string> = {
      natation: 'Natation', 'water-polo': 'Water-Polo', plongeon: 'Plongeon',
      'eau-libre': 'Eau Libre', general: 'Général', annonce: 'Annonce'
    };
    return labels[cat] ?? cat;
  }

  authorName(a: { firstName: string; lastName: string }): string {
    return `${a.firstName} ${a.lastName}`;
  }
}
