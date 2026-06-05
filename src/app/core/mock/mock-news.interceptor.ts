import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const AUTHORS = [
  { id: 1, first_name: 'Ahmed', last_name: 'Ben Salem' },
  { id: 2, first_name: 'Sarra', last_name: 'Mejri' },
  { id: 3, first_name: 'Leila', last_name: 'Ben Ali' },
];

function author(id: number) { return AUTHORS.find(a => a.id === id) ?? AUTHORS[0]; }

const MOCK_NEWS = [
  {
    id: 1,
    title: 'Championnat National d\'Été 2026 : inscriptions ouvertes',
    description: `La Fédération Tunisienne de Natation a le plaisir d'annoncer l'ouverture des inscriptions pour le Championnat National d'Été 2026. Cet événement majeur se déroulera du 15 au 20 juillet 2026 au Complexe Olympique de Tunis.\n\nLes épreuves proposées couvriront toutes les disciplines : natation sportive, water-polo, plongeon et eau libre. Les athlètes engagés auront l'occasion de décrocher leur qualification pour les championnats d'Afrique et les compétitions internationales de la saison.\n\nLes clubs sont invités à soumettre leurs inscriptions avant le 30 juin 2026 via la plateforme dédiée. Les frais d'inscription sont fixés à 50 DT par athlète et 200 DT par équipe de water-polo.\n\nPour toute information complémentaire, veuillez contacter le service des compétitions.`,
    category: 'natation',
    date: '2026-05-25T08:00:00Z',
    author: author(1),
    comments: [
      { id: 101, content: 'Excellente nouvelle ! Mon club participera à coup sûr.', file_url: null, author: { id: 10, first_name: 'Karim', last_name: 'Trabelsi' }, created_at: '2026-05-25T10:15:00Z' },
      { id: 102, content: 'Est-ce que les inscriptions se font en ligne ?', file_url: null, author: { id: 11, first_name: 'Nadia', last_name: 'Bouchoucha' }, created_at: '2026-05-26T08:45:00Z' },
    ],
    created_at: '2026-05-25T08:00:00Z',
  },
  {
    id: 2,
    title: 'L\'équipe nationale de water-polo se prépare pour les championnats d\'Afrique',
    description: `L'équipe nationale de water-polo a entamé sa phase de préparation intensive pour les prochains championnats d'Afrique qui auront lieu en septembre 2026. Sous la direction du sélectionneur national, les joueurs suivent un programme d'entraînement rigoureux alliant travail technique, préparation physique et sessions tactiques.\n\nLes stages se dérouleront à Tunis et à Monastir, avec des matchs amicaux prévus contre des clubs européens invités. Le staff technique a sélectionné un groupe élargi de 25 joueurs, parmi lesquels 15 seront retenus pour la compétition finale.\n\nL'objectif affiché est clair : décrocher une médaille et se qualifier pour les championnats du monde.`,
    category: 'water-polo',
    date: '2026-05-22T10:30:00Z',
    author: author(2),
    comments: [
      { id: 103, content: 'Allez les gars ! Toute la Tunisie est derrière vous 💪', file_url: null, author: { id: 12, first_name: 'Hatem', last_name: 'Bouazizi' }, created_at: '2026-05-22T11:00:00Z' },
    ],
    created_at: '2026-05-22T10:30:00Z',
  },
  {
    id: 3,
    title: 'Nouveau record national : Oussama Mellouli bat le record du 200m papillon',
    description: `Lors des sélections nationales qui se sont tenues ce week-end à la piscine olympique de Tunis, le jeune nageur Oussama Mellouli a réalisé un exploit retentissant en battant le record national du 200m papillon. Avec un chrono de 1'54"87, il améliore de près d'une seconde l'ancien record détenu depuis 2019.\n\nAgé de seulement 19 ans, ce talent prometteur formé au Club Sportif de la Marsa confirme tout son potentiel. Son entraîneur, M. Karim Ben Ammar, souligne le travail acharné du jeune athlète et sa progression constante.\n\nCe chrono le place parmi les meilleurs mondiaux de sa catégorie d'âge et ouvre des perspectives prometteuses pour les prochaines échéances internationales.`,
    category: 'natation',
    date: '2026-05-20T14:15:00Z',
    author: author(1),
    comments: [
      { id: 104, content: 'Félicitations Oussama ! Quel talent !', file_url: null, author: { id: 13, first_name: 'Samir', last_name: 'Ben Ammar' }, created_at: '2026-05-20T15:00:00Z' },
      { id: 105, content: 'Je me souviens du record précédent, le battre était un véritable défi.', file_url: null, author: { id: 14, first_name: 'Fatma', last_name: 'Ben Salah' }, created_at: '2026-05-21T09:10:00Z' },
    ],
    created_at: '2026-05-20T14:15:00Z',
  },
  {
    id: 4,
    title: 'Stage de formation pour les jeunes plongeurs tunisiens',
    description: `La Fédération Tunisienne de Natation organise un stage de formation intensif dédié aux jeunes plongeurs âgés de 12 à 16 ans. Ce stage, qui se déroulera du 10 au 17 juin 2026 au centre national des sports aquatiques à Hammamet, accueillera 30 jeunes talents sélectionnés à travers tout le pays.\n\nEncadrés par des entraîneurs nationaux et internationaux, les participants bénéficieront de séances techniques personnalisées, d'ateliers de préparation mentale et de conférences sur la nutrition sportive.\n\nLes disciplines abordées incluent le tremplin 1m et 3m, la plateforme 10m, ainsi que des initiations au plongeon synchronisé.`,
    category: 'plongeon',
    date: '2026-05-18T09:00:00Z',
    author: author(3),
    comments: [],
    created_at: '2026-05-18T09:00:00Z',
  },
  {
    id: 5,
    title: 'Compétition d\'eau libre : Traversée des îles Kerkennah',
    description: `La traditionnelle traversée des îles Kerkennah revient cette année pour sa 15ème édition. Cet événement emblématique de nage en eau libre rassemble chaque année des centaines de participants venus de toute la Tunisie et d'ailleurs.\n\nAu programme : parcours de 5km et 10km dans les eaux cristallines du golfe de Gabès.\n\nCette année, des épreuves handisport seront également organisées en parallèle, marquant la volonté de la fédération de promouvoir une natation inclusive et accessible à tous.`,
    category: 'eau-libre',
    date: '2026-05-15T11:00:00Z',
    author: author(2),
    comments: [
      { id: 106, content: 'J\'ai participé l\'année dernière, une expérience inoubliable !', file_url: null, author: { id: 15, first_name: 'Amine', last_name: 'Gharbi' }, created_at: '2026-05-15T14:20:00Z' },
    ],
    created_at: '2026-05-15T11:00:00Z',
  },
  {
    id: 6,
    title: 'Assemblée Générale de la FTN : bilan et perspectives',
    description: `L'Assemblée Générale annuelle de la Fédération Tunisienne de Natation s'est tenue samedi dernier au siège de la fédération. Le président a présenté le bilan de la saison écoulée, marquée par des résultats prometteurs sur la scène internationale et une augmentation significative du nombre de licenciés.\n\nParmi les points clés abordés : le développement des infrastructures aquatiques dans les régions intérieures, le programme de formation des entraîneurs, et la stratégie de préparation pour les Jeux Olympiques.\n\nLe budget prévisionnel pour la saison 2026-2027 a été approuvé à l'unanimité.`,
    category: 'general',
    date: '2026-05-12T16:45:00Z',
    author: author(3),
    comments: [],
    created_at: '2026-05-12T16:45:00Z',
  },
  {
    id: 7,
    title: 'Calendrier des compétitions nationales 2026-2027 publié',
    description: `La Fédération Tunisienne de Natation a le plaisir de publier le calendrier officiel des compétitions nationales pour la saison 2026-2027. Ce calendrier riche et varié comprend plus de 20 événements répartis sur toute l'année.\n\nParmi les temps forts : les Championnats d'Hiver (décembre 2026), les Championnats du Printemps (mars 2027), et les Championnats d'Été (juillet 2027).\n\nLes clubs sont invités à consulter le calendrier complet disponible sur le portail de la fédération.`,
    category: 'annonce',
    date: '2026-05-10T07:30:00Z',
    author: author(1),
    comments: [],
    created_at: '2026-05-10T07:30:00Z',
  },
  {
    id: 8,
    title: 'Formation des entraîneurs : nouveau programme certifiant',
    description: `La FTN lance un nouveau programme de formation certifiant destiné aux entraîneurs de natation. Ce programme, élaboré en collaboration avec des experts internationaux, vise à élever le niveau technique de l'encadrement sportif en Tunisie.\n\nLa formation se décline en trois modules : entraînement des jeunes, préparation physique spécialisée, et management d'équipe.\n\nLes inscriptions sont ouvertes pour la session d'été 2026.`,
    category: 'general',
    date: '2026-05-08T13:20:00Z',
    author: author(2),
    comments: [],
    created_at: '2026-05-08T13:20:00Z',
  }
];

@Injectable()
export class MockNewsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { method, url } = req;

    if (!url.includes('/api/v1/news') && !url.includes('/api/v1/auth') && !url.includes('/api/v1/users')) {
      return next.handle(req);
    }

    // Mock auth endpoints
    if (url.includes('/api/v1/auth/login') && method === 'POST') {
      return of(new HttpResponse({
        status: 200,
        body: { data: { email: 'user@test.com', firstName: 'Test', lastName: 'User', accessToken: 'mock-jwt-token' } }
      })).pipe(delay(300));
    }

    if (url.includes('/api/v1/auth/me') && method === 'GET') {
      return of(new HttpResponse({
        status: 200,
        body: { data: { id: 1, email: 'user@test.com', firstName: 'Test', lastName: 'User', role: 'USER', status: 'ACTIVE' } }
      })).pipe(delay(200));
    }

    // POST /api/v1/news/{id}/comments
    const commentMatch = url.match(/\/api\/v1\/news\/(\d+)\/comments$/);
    if (method === 'POST' && commentMatch) {
      return of(new HttpResponse({
        status: 201,
        body: {
          data: {
            id: Date.now(),
            content: req.body?.content ?? '',
            fileUrl: req.body?.fileUrl ?? null,
            author: { id: 99, firstName: 'Utilisateur', lastName: 'Test' },
            created_at: new Date().toISOString(),
          }
        }
      })).pipe(delay(300));
    }

    // GET /api/v1/news/{id} (single news)
    const idMatch = url.match(/\/api\/v1\/news\/(\d+)$/);
    if (method === 'GET' && idMatch) {
      const id = parseInt(idMatch[1], 10);
      const news = MOCK_NEWS.find(n => n.id === id);
      if (news) {
        return of(new HttpResponse({ status: 200, body: { data: news } })).pipe(delay(300));
      }
      return of(new HttpResponse({ status: 404, body: { error: 'Not found' } }));
    }

    // GET /api/v1/news (list)
    if (method === 'GET') {
      let filtered = [...MOCK_NEWS];
      const query = url.split('?')[1] ?? '';
      const params = new URLSearchParams(query);
      const category = params.get('category');
      const search = params.get('search');

      if (category) filtered = filtered.filter(n => n.category === category);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(n =>
          n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
        );
      }

      const page = parseInt(params.get('page') ?? '0', 10);
      const size = parseInt(params.get('size') ?? '12', 10);
      const start = page * size;
      const paginated = filtered.slice(start, start + size);

      return of(new HttpResponse({
        status: 200,
        body: { data: paginated, total_count: filtered.length }
      })).pipe(delay(300));
    }

    return next.handle(req);
  }
}
