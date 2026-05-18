# Papiers Express Creator Program

Plateforme SaaS moderne pour gérer le programme de créateurs et collaborateurs marketing de Papiers Express.

## Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **API Client**: Axios
- **Charts**: Recharts
- **Notifications**: Sonner

## Installation

1. Cloner le projet
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Créer un fichier `.env.local` (copier depuis `.env.example`) :
   ```bash
   cp .env.example .env.local
   ```
4. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

## Architecture

Le projet suit une architecture modulaire basée sur les **features** :

- `src/app`: Routes et layouts (Next.js App Router)
- `src/features`: Logique métier découpée par domaine (auth, creators, social-leads, dashboard)
  - `components/`: Composants spécifiques à la feature
  - `hooks/`: Hooks personnalisés pour la feature
  - `services/`: Appels API spécifiques à la feature
  - `schemas/`: Validation Zod
  - `types/`: Types TypeScript
- `src/shared`: Composants, services et utilitaires partagés
- `src/providers`: Fournisseurs de contexte (Auth, Theme, Query)
- `src/styles`: Configuration globale du design system

## Authentification

L'application utilise l'authentification par session/cookies de Django.
Le client gère automatiquement :
- La récupération du token CSRF (`X-CSRFToken`)
- L'inclusion des credentials dans toutes les requêtes
- La protection des routes via `AuthProvider`

## Conventions

- Fichiers : `kebab-case`
- Composants : `PascalCase`
- Hooks : `useXxx`
- Services : `xxx.service.ts`
- Schémas : `xxx.schema.ts`
- Types : `xxx.types.ts`
- Langue : Toute l'interface est en **Français**.
