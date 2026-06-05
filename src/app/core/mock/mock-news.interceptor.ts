import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const MOCK_NEWS = [
  {
    id: '1',
    title: 'Championnat National d\'Été 2026 : inscriptions ouvertes',
    content: `La Fédération Tunisienne de Natation a le plaisir d'annoncer l'ouverture des inscriptions pour le Championnat National d'Été 2026. Cet événement majeur se déroulera du 15 au 20 juillet 2026 au Complexe Olympique de Tunis.\n\nLes épreuves proposées couvriront toutes les disciplines : natation sportive, water-polo, plongeon et eau libre. Les athlètes engagés auront l'occasion de décrocher leur qualification pour les championnats d'Afrique et les compétitions internationales de la saison.\n\nLes clubs sont invités à soumettre leurs inscriptions avant le 30 juin 2026 via la plateforme dédiée. Les frais d'inscription sont fixés à 50 DT par athlète et 200 DT par équipe de water-polo.\n\nPour toute information complémentaire, veuillez contacter le service des compétitions.`,
    excerpt: 'La FTN annonce l\'ouverture des inscriptions pour le Championnat National d\'Été 2026. Les athlètes peuvent désormais s\'inscrire pour participer à cet événement majeur.',
    published_at: '2026-05-25T08:00:00Z',
    category: 'natation',
    image_url: 'https://picsum.photos/seed/swimming-pool/800/400',
    slug: 'championnat-national-ete-2026',
    author_id: '1',
    author_name: 'Ahmed Ben Salem',
    author_photo: '',
    is_featured: true,
    comment_count: 12,
    view_count: 1547,
    like_count: 89
  },
  {
    id: '2',
    title: 'L\'équipe nationale de water-polo se prépare pour les championnats d\'Afrique',
    content: `L'équipe nationale de water-polo a entamé sa phase de préparation intensive pour les prochains championnats d'Afrique qui auront lieu en septembre 2026. Sous la direction du sélectionneur national, les joueurs suivent un programme d'entraînement rigoureux alliant travail technique, préparation physique et sessions tactiques.\n\nLes stages se dérouleront à Tunis et à Monastir, avec des matchs amicaux prévus contre des clubs européens invités. Le staff technique a sélectionné un groupe élargi de 25 joueurs, parmi lesquels 15 seront retenus pour la compétition finale.\n\nL'objectif affiché est clair : décrocher une médaille et se qualifier pour les championnats du monde.`,
    excerpt: 'Les poloïstes tunisiens ont entamé leur préparation pour les championnats d\'Afrique 2026. Découvrez les coulisses de cette préparation intense.',
    published_at: '2026-05-22T10:30:00Z',
    category: 'water-polo',
    image_url: 'https://picsum.photos/seed/water-polo/800/400',
    slug: 'equipe-nationale-waterpolo-preparation',
    author_id: '2',
    author_name: 'Sarra Mejri',
    author_photo: '',
    is_featured: false,
    comment_count: 5,
    view_count: 892,
    like_count: 45
  },
  {
    id: '3',
    title: 'Nouveau record national : Oussama Mellouli bat le record du 200m papillon',
    content: `Lors des sélections nationales qui se sont tenues ce week-end à la piscine olympique de Tunis, le jeune nageur Oussama Mellouli a réalisé un exploit retentissant en battant le record national du 200m papillon. Avec un chrono de 1'54"87, il améliore de près d'une seconde l'ancien record détenu depuis 2019.\n\nAgé de seulement 19 ans, ce talent prometteur formé au Club Sportif de la Marsa confirme tout son potentiel. Son entraîneur, M. Karim Ben Ammar, souligne le travail acharné du jeune athlète et sa progression constante.\n\nCe chrono le place parmi les meilleurs mondiaux de sa catégorie d'âge et ouvre des perspectives prometteuses pour les prochaines échéances internationales.`,
    excerpt: 'Le jeune prodige de la natation tunisienne signe un chrono exceptionnel qui le propulse sur la scène internationale.',
    published_at: '2026-05-20T14:15:00Z',
    category: 'natation',
    image_url: 'https://picsum.photos/seed/swimmer-record/800/400',
    slug: 'record-national-200m-papillon',
    author_id: '1',
    author_name: 'Ahmed Ben Salem',
    author_photo: '',
    is_featured: false,
    comment_count: 24,
    view_count: 3210,
    like_count: 234
  },
  {
    id: '4',
    title: 'Stage de formation pour les jeunes plongeurs tunisiens',
    content: `La Fédération Tunisienne de Natation organise un stage de formation intensif dédié aux jeunes plongeurs âgés de 12 à 16 ans. Ce stage, qui se déroulera du 10 au 17 juin 2026 au centre national des sports aquatiques à Hammamet, accueillera 30 jeunes talents sélectionnés à travers tout le pays.\n\nEncadrés par des entraîneurs nationaux et internationaux, les participants bénéficieront de séances techniques personnalisées, d'ateliers de préparation mentale et de conférences sur la nutrition sportive.\n\nLes disciplines abordées incluent le tremplin 1m et 3m, la plateforme 10m, ainsi que des initiations au plongeon synchronisé.`,
    excerpt: 'Un stage intensif de plongeon pour les jeunes talents tunisiens encadré par des entraîneurs de renom.',
    published_at: '2026-05-18T09:00:00Z',
    category: 'plongeon',
    image_url: 'https://picsum.photos/seed/diving-young/800/400',
    slug: 'stage-formation-jeunes-plongeurs',
    author_id: '3',
    author_name: 'Leila Ben Ali',
    author_photo: '',
    is_featured: false,
    comment_count: 8,
    view_count: 654,
    like_count: 67
  },
  {
    id: '5',
    title: 'Compétition d\'eau libre : Traversée des îles Kerkennah',
    content: `La traditionnelle traversée des îles Kerkennah revient cette année pour sa 15ème édition. Cet événement emblématique de nage en eau libre rassemble chaque année des centaines de participants venus de toute la Tunisie et d'ailleurs.\n\nAu programme : parcours de 5km et 10km dans les eaux cristallines du golfe de Gabès, avec des conditions optimales pour les nageurs de tous niveaux. Les inscriptions sont ouvertes jusqu'au 15 juillet 2026.\n\nCette année, des épreuves handisport seront également organisées en parallèle, marquant la volonté de la fédération de promouvoir une natation inclusive et accessible à tous.`,
    excerpt: 'La 15ème édition de la traversée des îles Kerkennah promet des moments exceptionnels en eau libre.',
    published_at: '2026-05-15T11:00:00Z',
    category: 'eau-libre',
    image_url: 'https://picsum.photos/seed/open-water-sea/800/400',
    slug: 'traversee-iles-kerkennah',
    author_id: '2',
    author_name: 'Sarra Mejri',
    author_photo: '',
    is_featured: false,
    comment_count: 15,
    view_count: 1205,
    like_count: 156
  },
  {
    id: '6',
    title: 'Assemblée Générale de la FTN : bilan et perspectives',
    content: `L'Assemblée Générale annuelle de la Fédération Tunisienne de Natation s'est tenue samedi dernier au siège de la fédération. Le président a présenté le bilan de la saison écoulée, marquée par des résultats prometteurs sur la scène internationale et une augmentation significative du nombre de licenciés.\n\nParmi les points clés abordés : le développement des infrastructures aquatiques dans les régions intérieures, le programme de formation des entraîneurs, et la stratégie de préparation pour les Jeux Olympiques.\n\nLe budget prévisionnel pour la saison 2026-2027 a été approuvé à l'unanimité, avec une enveloppe renforcée pour les catégories jeunes et le sport de haut niveau.`,
    excerpt: 'La FTN dresse un bilan positif de la saison et dévoile ses ambitions pour l\'avenir de la natation tunisienne.',
    published_at: '2026-05-12T16:45:00Z',
    category: 'general',
    image_url: 'https://picsum.photos/seed/meeting-conference/800/400',
    slug: 'assemblee-generale-ftn-2026',
    author_id: '3',
    author_name: 'Leila Ben Ali',
    author_photo: '',
    is_featured: false,
    comment_count: 3,
    view_count: 432,
    like_count: 28
  },
  {
    id: '7',
    title: 'Calendrier des compétitions nationales 2026-2027 publié',
    content: `La Fédération Tunisienne de Natation a le plaisir de publier le calendrier officiel des compétitions nationales pour la saison 2026-2027. Ce calendrier riche et varié comprend plus de 20 événements répartis sur toute l'année.\n\nParmi les temps forts : les Championnats d'Hiver (décembre 2026), les Championnats du Printemps (mars 2027), et les Championnats d'Été (juillet 2027). Les compétitions de water-polo, plongeon et eau libre sont également programmées.\n\nLes clubs sont invités à consulter le calendrier complet disponible sur le portail de la fédération et à planifier leur saison sportive en conséquence.`,
    excerpt: 'Découvrez le calendrier complet des compétitions nationales de natation pour la saison à venir.',
    published_at: '2026-05-10T07:30:00Z',
    category: 'annonce',
    image_url: '',
    slug: 'calendrier-competitions-2026-2027',
    author_id: '1',
    author_name: 'Ahmed Ben Salem',
    author_photo: '',
    is_featured: true,
    comment_count: 7,
    view_count: 2100,
    like_count: 112
  },
  {
    id: '8',
    title: 'Formation des entraîneurs : nouveau programme certifiant',
    content: `La FTN lance un nouveau programme de formation certifiant destiné aux entraîneurs de natation. Ce programme, élaboré en collaboration avec des experts internationaux, vise à élever le niveau technique de l'encadrement sportif en Tunisie.\n\nLa formation se décline en trois modules : entraînement des jeunes, préparation physique spécialisée, et management d'équipe. Chaque module comprend des sessions théoriques et pratiques, avec un stage d'application en club.\n\nLes inscriptions sont ouvertes pour la session d'été 2026. Les candidats doivent être titulaires du brevet d'entraîneur de niveau 1 et justifier d'une expérience minimale de deux ans.`,
    excerpt: 'Un programme de formation innovant pour les entraîneurs tunisiens afin de hisser le niveau de la natation nationale.',
    published_at: '2026-05-08T13:20:00Z',
    category: 'general',
    image_url: '',
    slug: 'formation-entraineurs-certifiant',
    author_id: '2',
    author_name: 'Sarra Mejri',
    author_photo: '',
    is_featured: false,
    comment_count: 18,
    view_count: 876,
    like_count: 95
  }
];

const MOCK_COMMENTS: Record<string, any[]> = {
  'championnat-national-ete-2026': [
    {
      id: 'c1',
      news_id: '1',
      content: 'Excellente nouvelle ! Mon club participera à coup sûr. Les championnats d\'été sont toujours un moment fort de la saison.',
      author_id: 'u1',
      author_name: 'Karim Trabelsi',
      author_photo: '',
      created_at: '2026-05-25T10:15:00Z',
      parent_id: null,
      likes: 12,
      views: 89,
      reactions: [
        { emoji: '👍', count: 5, user_has_reacted: false },
        { emoji: '❤️', count: 3, user_has_reacted: false }
      ]
    },
    {
      id: 'c1r1',
      news_id: '1',
      content: 'On s\'y voit alors ! Notre équipe prépare une belle performance cette année.',
      author_id: 'u2',
      author_name: 'Mohamed Ali',
      author_photo: '',
      created_at: '2026-05-25T14:30:00Z',
      parent_id: 'c1',
      likes: 4,
      views: 45,
      reactions: [{ emoji: '🔥', count: 2, user_has_reacted: false }]
    },
    {
      id: 'c1r2',
      news_id: '1',
      content: 'Absolument ! On prépare une belle équipe cette saison. Espérons un podium ! 🏆',
      author_id: 'u4',
      author_name: 'Hatem Bouazizi',
      author_photo: '',
      created_at: '2026-05-25T16:00:00Z',
      parent_id: 'c1',
      likes: 3,
      views: 28,
      reactions: []
    },
    {
      id: 'c2',
      news_id: '1',
      content: 'Est-ce que les inscriptions se font en ligne ou faut-il passer par le club ?',
      author_id: 'u3',
      author_name: 'Nadia Bouchoucha',
      author_photo: '',
      created_at: '2026-05-26T08:45:00Z',
      parent_id: null,
      likes: 7,
      views: 62,
      reactions: [{ emoji: '👍', count: 1, user_has_reacted: false }]
    }
  ],
  'equipe-nationale-waterpolo-preparation': [
    {
      id: 'c3',
      news_id: '2',
      content: 'Allez les gars ! Toute la Tunisie est derrière vous 💪',
      author_id: 'u4',
      author_name: 'Hatem Bouazizi',
      author_photo: '',
      created_at: '2026-05-22T11:00:00Z',
      parent_id: null,
      likes: 25,
      views: 156,
      reactions: [
        { emoji: '❤️', count: 10, user_has_reacted: false },
        { emoji: '🔥', count: 7, user_has_reacted: false },
        { emoji: '🙏', count: 3, user_has_reacted: false }
      ]
    },
    {
      id: 'c3r1',
      news_id: '2',
      content: 'Inchallah une médaille cette année !',
      author_id: 'u5',
      author_name: 'Rania Jaziri',
      author_photo: '',
      created_at: '2026-05-22T15:20:00Z',
      parent_id: 'c3',
      likes: 8,
      views: 67,
      reactions: [{ emoji: '🙏', count: 5, user_has_reacted: false }]
    },
    {
      id: 'c3r2',
      news_id: '2',
      content: 'On y croit ! L\'équipe a bien progressé cette saison, le travail paie.',
      author_id: 'u6',
      author_name: 'Samir Ben Ammar',
      author_photo: '',
      created_at: '2026-05-23T09:15:00Z',
      parent_id: 'c3',
      likes: 6,
      views: 52,
      reactions: [{ emoji: '👍', count: 4, user_has_reacted: false }]
    }
  ],
  'record-national-200m-papillon': [
    {
      id: 'c4',
      news_id: '3',
      content: 'Félicitations Oussama ! Quel talent ! La Tunisie a de beaux jours devant elle dans le monde de la natation.',
      author_id: 'u6',
      author_name: 'Samir Ben Ammar',
      author_photo: '',
      created_at: '2026-05-20T15:00:00Z',
      parent_id: null,
      likes: 34,
      views: 210,
      reactions: [
        { emoji: '❤️', count: 15, user_has_reacted: false },
        { emoji: '🔥', count: 8, user_has_reacted: false }
      ]
    },
    {
      id: 'c4r1',
      news_id: '3',
      content: 'Un avenir prometteur ! Je l\'ai vu nager lors des sélections, c\'était impressionnant.',
      author_id: 'u2',
      author_name: 'Mohamed Ali',
      author_photo: '',
      created_at: '2026-05-20T18:30:00Z',
      parent_id: 'c4',
      likes: 11,
      views: 78,
      reactions: [{ emoji: '👍', count: 6, user_has_reacted: false }]
    },
    {
      id: 'c4r2',
      news_id: '3',
      content: 'Je confirme, je nage avec lui au club, c\'est un bosseur hors pair !',
      author_id: 'u8',
      author_name: 'Hajer Ben Mahmoud',
      author_photo: '',
      created_at: '2026-05-21T07:45:00Z',
      parent_id: 'c4',
      likes: 9,
      views: 63,
      reactions: [{ emoji: '🔥', count: 3, user_has_reacted: false }]
    },
    {
      id: 'c5',
      news_id: '3',
      content: 'Je me souviens du record précédent, le battre était un véritable défi. Bravo jeune champion !',
      author_id: 'u7',
      author_name: 'Fatma Ben Salah',
      author_photo: '',
      created_at: '2026-05-21T09:10:00Z',
      parent_id: null,
      likes: 15,
      views: 94,
      reactions: [{ emoji: '👍', count: 7, user_has_reacted: false }]
    }
  ],
  'stage-formation-jeunes-plongeurs': [
    {
      id: 'c6',
      news_id: '4',
      content: 'Mon fils a été sélectionné ! Il est tellement excité à l\'idée de participer à ce stage.',
      author_id: 'u8',
      author_name: 'Hajer Ben Mahmoud',
      author_photo: '',
      created_at: '2026-05-18T10:30:00Z',
      parent_id: null,
      likes: 20,
      views: 134,
      reactions: [{ emoji: '❤️', count: 9, user_has_reacted: false }]
    }
  ],
  'traversee-iles-kerkennah': [
    {
      id: 'c7',
      news_id: '5',
      content: 'J\'ai participé l\'année dernière, une expérience inoubliable ! Les paysages sont magnifiques.',
      author_id: 'u9',
      author_name: 'Amine Gharbi',
      author_photo: '',
      created_at: '2026-05-15T14:20:00Z',
      parent_id: null,
      likes: 18,
      views: 112,
      reactions: [{ emoji: '🔥', count: 6, user_has_reacted: false }]
    },
    {
      id: 'c7r1',
      news_id: '5',
      content: 'Totalement d\'accord ! Je m\'inscris pour cette année aussi.',
      author_id: 'u10',
      author_name: 'Ines Chebbi',
      author_photo: '',
      created_at: '2026-05-16T08:15:00Z',
      parent_id: 'c7',
      likes: 5,
      views: 41,
      reactions: [{ emoji: '👍', count: 3, user_has_reacted: false }]
    }
  ]
};

@Injectable()
export class MockNewsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { method, url } = req;

    if (!url.includes('/api/v1/news')) {
      return next.handle(req);
    }

    // GET /api/v1/news/featured
    if (method === 'GET' && url.endsWith('/news/featured')) {
      return of(new HttpResponse({
        status: 200,
        body: { data: MOCK_NEWS.filter(n => n.is_featured) }
      })).pipe(delay(400));
    }

    // GET /api/v1/news/:slug/comments
    const commentsMatch = url.match(/\/api\/v1\/news\/([^/]+)\/comments$/);
    if (method === 'GET' && commentsMatch) {
      const slug = commentsMatch[1];
      return of(new HttpResponse({
        status: 200,
        body: MOCK_COMMENTS[slug] ?? []
      })).pipe(delay(350));
    }

    // POST /api/v1/news/:slug/comments/:id/react
    const reactMatch = url.match(/\/api\/v1\/news\/([^/]+)\/comments\/([^/]+)\/react$/);
    if (method === 'POST' && reactMatch) {
      return of(new HttpResponse({
        status: 200,
        body: { success: true }
      })).pipe(delay(200));
    }

    // POST /api/v1/news/:slug/comments/:id/like
    const likeMatch = url.match(/\/api\/v1\/news\/([^/]+)\/comments\/([^/]+)\/like$/);
    if (method === 'POST' && likeMatch) {
      return of(new HttpResponse({
        status: 200,
        body: { success: true }
      })).pipe(delay(200));
    }

    // POST /api/v1/news/:slug/comments
    const addCommentMatch = url.match(/\/api\/v1\/news\/([^/]+)\/comments$/);
    if (method === 'POST' && addCommentMatch) {
      return of(new HttpResponse({
        status: 201,
        body: {
          data: {
            id: `c${Date.now()}`,
            content: req.body?.content ?? '',
            author_id: 'current-user',
            author_name: 'Utilisateur Test',
            author_photo: '',
            created_at: new Date().toISOString(),
            parent_id: req.body?.parent_id ?? null,
            likes: 0,
            views: 1,
            reactions: [],
            replies: []
          }
        }
      })).pipe(delay(300));
    }

    // GET /api/v1/news/:slug (single news)
    const slugMatch = url.match(/\/api\/v1\/news\/([^/]+)$/);
    if (method === 'GET' && slugMatch) {
      const slug = slugMatch[1];
      const news = MOCK_NEWS.find(n => n.slug === slug);
      if (news) {
        return of(new HttpResponse({
          status: 200,
          body: { data: news }
        })).pipe(delay(400));
      }
      return of(new HttpResponse({ status: 404, body: { error: 'Not found' } }));
    }

    // GET /api/v1/news (list with optional query params)
    if (method === 'GET') {
      let filtered = [...MOCK_NEWS];
      const params = new URLSearchParams(url.split('?')[1] ?? '');
      const category = params.get('category');
      const search = params.get('search');

      if (category) {
        filtered = filtered.filter(n => n.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(n =>
          n.title.toLowerCase().includes(q) ||
          n.excerpt?.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
        );
      }

      const page = parseInt(params.get('page') ?? '0', 10);
      const size = parseInt(params.get('size') ?? '12', 10);
      const start = page * size;
      const paginated = filtered.slice(start, start + size);

      return of(new HttpResponse({
        status: 200,
        body: { data: paginated, total_count: filtered.length }
      })).pipe(delay(400));
    }

    return next.handle(req);
  }
}
