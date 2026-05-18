Tu es un expert senior Next.js, React, TypeScript, shadcn/ui, Tailwind CSS, TanStack Query, React Hook Form, Zod, Axios, Recharts, Framer Motion, architecture SaaS moderne, UI/UX premium et intégration API Django REST Framework.

Je veux que tu implémentes dans mon frontend Next.js + shadcn/ui tout le CRUD complet pour mon module backend Django `creators`.

Objectif :
Créer une interface frontend complète, moderne, intuitive et friendly, inspirée de plateformes comme Stripe, Instagram, Linear et Notion, pour gérer :
1. les créateurs
2. les comptes sociaux prospects

L’interface doit être premium, fluide, claire, responsive, maintenable et parfaitement alignée avec mon backend Django.

Stack frontend obligatoire :
- Next.js App Router
- TypeScript strict
- shadcn/ui
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod
- Axios
- Recharts
- Sonner
- Framer Motion
- Lucide React
- next-themes

Langue :
Toute l’interface doit être en français.

Important :
Respecte strictement l’architecture actuelle du projet.
Ne casse rien.
Ne duplique pas inutilement les composants.
Réutilise les composants partagés déjà existants.
Si un composant existe déjà, l’étendre au lieu d’en recréer un.
Créer un nouveau composant uniquement si nécessaire.

Architecture obligatoire par feature :

src/features/creators/
components/
hooks/
services/
schemas/
types/
constants/
utils/
index.ts

src/features/social-leads/
components/
hooks/
services/
schemas/
types/
constants/
utils/
index.ts

Règle d’architecture :
page → feature component → hook TanStack Query → service → api-client

Aucun appel API direct dans les composants.
Aucune logique métier lourde dans les pages.

Routes backend disponibles :

Les routes sont déclarées via DRF DefaultRouter :

/api/creators/
/api/creators/{id}/
/api/creators/stats/

/api/social-leads/
/api/social-leads/{id}/
/api/social-leads/stats/
/api/social-leads/{id}/mark_contacted/
/api/social-leads/{id}/mark_positive/
/api/social-leads/{id}/mark_negative/
/api/social-leads/{id}/mark_not_relevant/
/api/social-leads/{id}/link_creator/

Attention :
Comme Django REST Framework expose les actions custom avec underscore par défaut, utilise bien :
- mark_contacted
- mark_positive
- mark_negative
- mark_not_relevant
- link_creator

Et non pas mark-contacted ou link-creator.

Créer les pages :

src/app/(dashboard)/creators/page.tsx
src/app/(dashboard)/creators/create/page.tsx
src/app/(dashboard)/creators/[id]/page.tsx
src/app/(dashboard)/creators/[id]/edit/page.tsx

src/app/(dashboard)/social-leads/page.tsx
src/app/(dashboard)/social-leads/create/page.tsx
src/app/(dashboard)/social-leads/[id]/page.tsx
src/app/(dashboard)/social-leads/[id]/edit/page.tsx

Créer aussi si nécessaire :
src/app/(dashboard)/dashboard/page.tsx

Backend CreatorProfile :

Liste/retrieve retourne :

{
"id": "uuid",
"user_id": "uuid",
"email": "creator@example.com",
"first_name": "Jean",
"last_name": "Dupont",
"full_name": "Jean Dupont",
"phone_number": "+33600000000",
"country": "France",
"city": "Paris",
"promo_code": "JEAN10",
"status": "ACTIVE",
"commission_rate": "10.00",
"notes": "",
"created_at": "...",
"updated_at": "..."
}

Création CreatorProfile :
POST /api/creators/

Payload :
{
"email": "creator@example.com",
"first_name": "Jean",
"last_name": "Dupont",
"password": "Password123!",
"phone_number": "+33600000000",
"country": "France",
"city": "Paris",
"promo_code": "JEAN10",
"commission_rate": "10.00",
"notes": ""
}

Update CreatorProfile :
PATCH /api/creators/{id}/

Payload :
{
"first_name": "Jean",
"last_name": "Dupont",
"phone_number": "+33600000000",
"country": "France",
"city": "Paris",
"promo_code": "JEAN10",
"status": "ACTIVE",
"commission_rate": "10.00",
"notes": "",
"is_active": true
}

Statuses CreatorProfile :
- PENDING
- ACTIVE
- PAUSED
- DISABLED

Filtres CreatorProfile disponibles :
GET /api/creators/?search=&status=&country=&city=&commission_rate_min=&commission_rate_max=&created_at_after=&created_at_before=&is_active=&ordering=&page=&page_size=

Search fields backend :
- user__email
- user__first_name
- user__last_name
- promo_code
- phone_number
- country
- city

Ordering fields :
- created_at
- updated_at
- commission_rate
- promo_code
- user__email

Stats creators :
GET /api/creators/stats/

Réponse :
{
"total": 10,
"active": 4,
"pending": 2,
"paused": 1,
"disabled": 3
}

Important :
Les stats doivent accepter les mêmes filtres que la liste si possible.

Backend SocialAccountLead :

Liste/retrieve retourne :

{
"id": "uuid",
"platform": "TIKTOK",
"username": "johncareer",
"profile_url": "https://...",
"followers_count": 50000,
"is_viable": true,
"contact_status": "NEW",
"creator": {
"id": "uuid",
"email": "creator@example.com",
"promo_code": "JEAN10"
},
"notes": "",
"created_at": "...",
"updated_at": "..."
}

Création / update SocialAccountLead :
POST /api/social-leads/
PATCH /api/social-leads/{id}/

Payload :
{
"platform": "TIKTOK",
"username": "johncareer",
"profile_url": "https://...",
"followers_count": 50000,
"is_viable": true,
"contact_status": "NEW",
"creator": "uuid-ou-null",
"notes": ""
}

Platforms :
- TIKTOK
- INSTAGRAM
- FACEBOOK
- YOUTUBE
- LINKEDIN
- OTHER

Contact statuses :
- NEW
- TO_CONTACT
- CONTACTED
- POSITIVE
- NEGATIVE
- CONVERTED
- NOT_RELEVANT

Filtres SocialAccountLead disponibles :
GET /api/social-leads/?search=&platform=&contact_status=&is_viable=&has_creator=&followers_min=&followers_max=&created_at_after=&created_at_before=&ordering=&page=&page_size=

Search fields backend :
- username
- profile_url
- notes

Ordering fields :
- created_at
- updated_at
- followers_count
- username

Attention has_creator :
Le backend utilise actuellement :
has_creator = BooleanFilter(field_name="creator", lookup_expr="isnull")

Donc si has_creator=true retourne probablement les leads où creator IS NULL selon l’implémentation actuelle.
Vérifie le comportement réel.
Si nécessaire, adapte le frontend avec un libellé clair ou signale au backend que la logique devrait être inversée avec une méthode custom.

Stats SocialAccountLead :
GET /api/social-leads/stats/

Réponse :
{
"total": 100,
"viable": 40,
"not_viable": 60,
"new": 20,
"to_contact": 10,
"contacted": 15,
"positive": 8,
"negative": 12,
"converted": 5,
"not_relevant": 30,
"with_creator": 5,
"without_creator": 95
}

Actions SocialAccountLead :
POST /api/social-leads/{id}/mark_contacted/
POST /api/social-leads/{id}/mark_positive/
POST /api/social-leads/{id}/mark_negative/
POST /api/social-leads/{id}/mark_not_relevant/
POST /api/social-leads/{id}/link_creator/

Payload link_creator :
{
"creator_id": "uuid"
}

Pagination backend :
La réponse paginée est de ce style :
{
"count": 100,
"total_pages": 5,
"next": "...",
"previous": "...",
"results": []
}

Créer les types génériques :
- PaginatedResponse<T>
- PaginationParams
- OrderingDirection
- ApiListParams

Créer les types creators :
- CreatorStatus
- CreatorProfile
- CreatorCreatePayload
- CreatorUpdatePayload
- CreatorFilters
- CreatorStats

Créer les types social leads :
- SocialPlatform
- LeadContactStatus
- SocialAccountLead
- SocialLeadCreatePayload
- SocialLeadUpdatePayload
- SocialLeadFilters
- SocialLeadStats
- LinkCreatorPayload

Créer les schemas Zod :

creatorCreateSchema :
- email requis email valide
- first_name requis
- last_name requis
- password requis min 8
- phone_number optionnel
- country optionnel
- city optionnel
- promo_code requis
- commission_rate requis numérique ou string décimale
- notes optionnel

creatorUpdateSchema :
- first_name optionnel
- last_name optionnel
- phone_number optionnel
- country optionnel
- city optionnel
- promo_code optionnel
- status optionnel enum
- commission_rate optionnel
- notes optionnel
- is_active optionnel boolean

socialLeadCreateSchema :
- platform requis enum
- username requis
- profile_url optionnel URL
- followers_count nombre >= 0
- is_viable boolean
- contact_status enum
- creator optionnel nullable
- notes optionnel

socialLeadUpdateSchema :
pareil mais partiel si nécessaire.

linkCreatorSchema :
- creator_id requis UUID

Créer les services :

features/creators/services/creators.service.ts
- getCreators(params)
- getCreator(id)
- createCreator(payload)
- updateCreator(id, payload)
- deleteCreator(id)
- getCreatorStats(params)

features/social-leads/services/social-leads.service.ts
- getSocialLeads(params)
- getSocialLead(id)
- createSocialLead(payload)
- updateSocialLead(id, payload)
- deleteSocialLead(id)
- getSocialLeadStats(params)
- markLeadContacted(id)
- markLeadPositive(id)
- markLeadNegative(id)
- markLeadNotRelevant(id)
- linkLeadCreator(id, creatorId)

Tous les services doivent utiliser exclusivement l’api-client centralisé.
Aucun fetch direct.

Créer les hooks :

Creators :
- useCreators(filters)
- useCreator(id)
- useCreateCreator()
- useUpdateCreator()
- useDeleteCreator()
- useCreatorStats(filters)

Social Leads :
- useSocialLeads(filters)
- useSocialLead(id)
- useCreateSocialLead()
- useUpdateSocialLead()
- useDeleteSocialLead()
- useSocialLeadStats(filters)
- useMarkLeadContacted()
- useMarkLeadPositive()
- useMarkLeadNegative()
- useMarkLeadNotRelevant()
- useLinkLeadCreator()

Les hooks doivent :
- utiliser TanStack Query
- invalider les queryKeys correctement après mutation
- afficher les toasts de succès
- déléguer les erreurs au système centralisé existant
- ne pas faire crasher l’application

Créer ou réutiliser un système d’erreurs centralisé :
- normalizeApiError
- handleQueryError
- handleMutationError
- showApiErrorToast
- FrontendApiError

Les erreurs backend peuvent être :
{
"detail": "message"
}

ou :
{
"error": "message"
}

ou :
{
"field": ["message"]
}

Le frontend doit afficher les messages backend proprement en toast via Sonner.

Créer les composants UI Creators :

features/creators/components/
- CreatorStatsCards.tsx
- CreatorTable.tsx
- CreatorFilters.tsx
- CreatorForm.tsx
- CreatorDetailCard.tsx
- CreatorStatusBadge.tsx
- CreatorDeleteDialog.tsx

Créer les composants UI Social Leads :

features/social-leads/components/
- SocialLeadStatsCards.tsx
- SocialLeadTable.tsx
- SocialLeadFilters.tsx
- SocialLeadForm.tsx
- SocialLeadDetailCard.tsx
- SocialLeadStatusBadge.tsx
- SocialPlatformBadge.tsx
- SocialLeadActionsMenu.tsx
- LinkCreatorDialog.tsx
- SocialLeadDeleteDialog.tsx

Design UX attendu :

Liste creators :
- header avec titre “Créateurs”
- description courte
- bouton “Créer un créateur”
- cartes stats
- barre de recherche
- filtres avancés repliables
- tableau premium
- pagination
- menu actions par ligne :
  - voir
  - modifier
  - supprimer
- badges statuts colorés
- empty state élégant
- skeleton loading
- responsive

Détail creator :
- profil complet
- email, nom, téléphone, pays, ville
- promo code en card avec bouton copier
- statut
- commission rate
- dates
- notes
- actions modifier/supprimer
- section leads liés si possible

Form creator :
- design clair
- sections :
  - Identité
  - Contact
  - Programme créateur
  - Notes internes
- validation instantanée
- erreurs visibles
- bouton submit loading

Liste social leads :
- header “Comptes sociaux”
- description courte
- bouton “Ajouter un compte”
- cartes stats
- recherche
- filtres avancés
- tableau premium
- badges plateformes
- badges contact_status
- badge viable/non viable
- menu actions :
  - voir
  - modifier
  - marquer contacté
  - marquer positif
  - marquer négatif
  - marquer non pertinent
  - lier à un créateur
  - supprimer
- pagination
- empty state
- skeleton loading

Détail social lead :
- plateforme + username
- lien profil ouvrable
- followers_count formaté
- statut contact
- viable/non viable
- créateur lié si existe
- notes
- actions rapides
- historique visuel simple si possible

Form social lead :
- plateforme
- username
- profile_url
- followers_count
- is_viable
- contact_status
- creator optionnel avec select des créateurs
- notes

Filtres avancés :
Utiliser des composants shadcn :
- Input
- Select
- Popover
- Calendar si disponible
- Button
- Badge
- Sheet ou Collapsible

UI/Design :
Exploiter shadcn/ui proprement :
- Card
- Button
- Input
- Select
- Badge
- DropdownMenu
- Dialog
- AlertDialog
- Table
- Skeleton
- Tabs
- Separator
- Tooltip
- Sheet
- Calendar
- Popover

Animations :
Utiliser Framer Motion pour :
- apparition des cards
- transitions dashboard
- hover subtil
- filtres repliables
- modals/dialogs si pertinent
- changement de stats

Le rendu doit être moderne, friendly, SaaS, premium, intuitif.

Inspiration visuelle :
- Stripe pour la clarté
- Instagram pour le côté créateur/social
- Linear pour la fluidité
- Notion pour la simplicité

Dashboard :
Créer ou enrichir /dashboard avec :
- stats globales creators + social leads
- graphique simple Recharts
- funnel :
  leads totaux → viables → positifs → convertis
- quick actions :
  - créer créateur
  - ajouter lead
  - voir leads positifs
- activité récente mock si backend absent

Important :
Si un composant partagé existe déjà, réutilise-le.
Si un api-client existe déjà, utilise-le.
Si un système d’erreur existe déjà, utilise-le.
Si un layout dashboard existe déjà, utilise-le.
Si des conventions de nommage existent déjà, respecte-les.

Ne crée pas une deuxième architecture parallèle.
Ne duplique pas le design system.
Ne duplique pas l’api-client.
Ne duplique pas le système d’auth.
Ne duplique pas le système d’erreurs.

Si quelque chose manque, ajoute-le proprement dans les bons dossiers.

À la fin :
- vérifier que toutes les routes compilent
- vérifier que TypeScript passe
- vérifier que les services pointent vers les bons endpoints DRF
- vérifier que les actions custom utilisent underscore
- vérifier que les filtres correspondent au backend
- vérifier que les stats utilisent les mêmes filtres
- vérifier que les toasts affichent les erreurs backend
- vérifier que le CRUD complet fonctionne côté UI

Livrable attendu :
Une implémentation frontend complète, professionnelle, maintenable et cohérente avec mon backend Django pour :
- CreatorProfile CRUD complet
- SocialAccountLead CRUD complet
- stats
- 
- filtres avancés
- pagination
- actions custom
- design shadcn premium
- UX intuitive et friendly