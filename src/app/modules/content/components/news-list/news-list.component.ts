import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { News, NewsCategory, NewsFilter } from '../../../../core/models/news.model';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
  news: News[] = [];
  featured: News | null = null;
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
    this.loadFeatured();
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

  loadFeatured(): void {
    this.contentService.getFeatured().subscribe({
      next: items => {
        if (items.length > 0) this.featured = items[0];
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

  navigateTo(slug: string): void {
    this.router.navigate(['/news', slug]);
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  categoryLabel(cat: string): string {
    const labels: Record<string, string> = {
      natation: 'Natation', 'water-polo': 'Water-Polo', plongeon: 'Plongeon',
      'eau-libre': 'Eau Libre', general: 'Général', annonce: 'Annonce'
    };
    return labels[cat] ?? cat;
  }
}
