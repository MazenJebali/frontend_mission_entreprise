import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ContentService } from '../../services/content.service';
import { News, NewsComment } from '../../../../core/models/news.model';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  news?: News;
  comments: NewsComment[] = [];
  loading = true;
  loadingComments = false;

  commentForm: FormGroup;
  replyForm: FormGroup;
  replyTo: string | null = null;
  replyToName: string | null = null;

  showEmojiPicker: string | null = null;
  availableEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '💯'];

  commentFile: File | null = null;
  replyFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private contentService: ContentService,
    public authService: AuthService
  ) {
    this.commentForm = this.fb.group({ content: ['', [Validators.required, Validators.minLength(1)]] });
    this.replyForm = this.fb.group({ content: ['', [Validators.required, Validators.minLength(1)]] });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadNews(slug);
        this.loadComments(slug);
      }
    });
  }

  private loadNews(slug: string): void {
    this.loading = true;
    this.contentService.getBySlug(slug).subscribe({
      next: n => { this.news = n; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/news']); }
    });
  }

  private loadComments(slug: string): void {
    this.loadingComments = true;
    this.contentService.getComments(slug).subscribe({
      next: c => { this.comments = this.buildTree(c); this.loadingComments = false; },
      error: () => { this.loadingComments = false; }
    });
  }

  private buildTree(comments: NewsComment[]): NewsComment[] {
    const map = new Map<string, NewsComment>();
    const roots: NewsComment[] = [];
    comments.forEach(c => map.set(c.id, { ...c, replies: [] }));
    comments.forEach(c => {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.replies!.push(map.get(c.id)!);
      } else {
        roots.push(map.get(c.id)!);
      }
    });
    return roots;
  }

  submitComment(): void {
    if (this.commentForm.invalid || !this.news) return;
    this.contentService.addComment(this.news.slug, this.commentForm.value.content).subscribe({
      next: () => {
        this.commentForm.reset();
        this.loadComments(this.news!.slug);
      }
    });
  }

  startReply(comment: NewsComment): void {
    // Require login module first
    // if (!this.isLoggedIn) {
    //   this.router.navigate(['/auth/login']);
    //   return;
    // }
    this.replyTo = comment.id;
    this.replyToName = comment.authorName;
    this.replyForm.reset();
  }

  cancelReply(): void {
    this.replyTo = null;
    this.replyToName = null;
  }

  submitReply(): void {
    if (this.replyForm.invalid || !this.news || !this.replyTo) return;
    this.contentService.addComment(this.news.slug, this.replyForm.value.content, this.replyTo).subscribe({
      next: () => {
        this.replyForm.reset();
        this.replyTo = null;
        this.replyToName = null;
        this.loadComments(this.news!.slug);
      }
    });
  }

  reactToComment(comment: NewsComment, emoji: string): void {
    if (!this.news) return;
    this.contentService.reactToComment(this.news.slug, comment.id, emoji).subscribe({
      next: () => {
        this.showEmojiPicker = null;
        this.loadComments(this.news!.slug);
      }
    });
  }

  likeComment(comment: NewsComment): void {
    if (!this.news) return;
    this.contentService.likeComment(this.news.slug, comment.id).subscribe({
      next: () => this.loadComments(this.news!.slug)
    });
  }

  toggleEmojiPicker(commentId: string): void {
    this.showEmojiPicker = this.showEmojiPicker === commentId ? null : commentId;
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

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUserName(): string {
    const u = this.authService.currentUser;
    return u ? `${u.firstName} ${u.lastName}` : '';
  }

  get currentUserPhoto(): string | undefined {
    return this.authService.currentUser?.photo;
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

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
