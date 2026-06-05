import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService } from '../../services/content.service';
import { News, NewsComment } from '../../../../core/models/news.model';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  news?: News;
  loading = true;

  commentForm: FormGroup;
  replyForm: FormGroup;
  replyTo: number | null = null;
  replyToName: string | null = null;

  commentFile: File | null = null;
  replyFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private contentService: ContentService
  ) {
    this.commentForm = this.fb.group({ content: ['', [Validators.required, Validators.minLength(1)]] });
    this.replyForm = this.fb.group({ content: ['', [Validators.required, Validators.minLength(1)]] });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadNews(+id);
      }
    });
  }

  private loadNews(id: number): void {
    this.loading = true;
    this.contentService.getById(id).subscribe({
      next: n => { this.news = { ...n, comments: n.comments ?? [] }; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/news']); }
    });
  }

  submitComment(): void {
    if (this.commentForm.invalid || !this.news) return;
    const fileUrl = this.commentFile ? URL.createObjectURL(this.commentFile) : undefined;
    this.contentService.addComment(this.news.id, this.commentForm.value.content, null, fileUrl).subscribe({
      next: () => {
        this.commentForm.reset();
        this.commentFile = null;
        this.loadNews(this.news!.id);
      }
    });
  }

  startReply(comment: NewsComment): void {
    this.replyTo = comment.id;
    this.replyToName = this.authorName(comment.author);
    this.replyForm.reset();
  }

  cancelReply(): void {
    this.replyTo = null;
    this.replyToName = null;
  }

  submitReply(): void {
    if (this.replyForm.invalid || !this.news || !this.replyTo) return;
    const fileUrl = this.replyFile ? URL.createObjectURL(this.replyFile) : undefined;
    this.contentService.addComment(this.news.id, this.replyForm.value.content, this.replyTo, fileUrl).subscribe({
      next: () => {
        this.replyForm.reset();
        this.replyFile = null;
        this.replyTo = null;
        this.replyToName = null;
        this.loadNews(this.news!.id);
      }
    });
  }

  onCommentFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.commentFile = input.files?.item(0) ?? null;
  }

  onReplyFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.replyFile = input.files?.item(0) ?? null;
  }

  removeCommentFile(): void {
    this.commentFile = null;
  }

  removeReplyFile(): void {
    this.replyFile = null;
  }

  get topLevelComments(): NewsComment[] {
    return (this.news?.comments ?? []).filter(c => !c.parentCommentId);
  }

  getReplies(commentId: number): NewsComment[] {
    return (this.news?.comments ?? []).filter(c => c.parentCommentId === commentId);
  }

  categoryLabel(cat: string): string {
    const labels: Record<string, string> = {
      natation: 'Natation', 'water-polo': 'Water-Polo', plongeon: 'Plongeon',
      'eau-libre': 'Eau Libre', general: 'Général', annonce: 'Annonce'
    };
    return labels[cat] ?? cat;
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  authorName(a: { firstName: string; lastName: string }): string {
    return `${a.firstName} ${a.lastName}`;
  }
}
