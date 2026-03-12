# ADR-001 : Stack Technique — Next.js 14 + Supabase + Vercel

**Status** : Accepte
**Date** : 2026-03-07
**Agent** : 📐 Architect

## Contexte

Choix de stack pour un MVP SaaS HoReCa. Contraintes : budget zero (free tiers),
developpeur debutant (Adam), besoin d'iteration rapide, deploiement simple.

## Recherche effectuee

- Next.js 14 App Router — framework React le plus adopte, SSR+SSG, excellent DX
- Supabase — alternative Firebase open-source, PostgreSQL, auth, realtime, storage
- Vercel — deploiement zero-config pour Next.js, free tier genereux

## Decision

- **Framework** : Next.js 14 (App Router, pas Pages Router)
- **DB** : Supabase JS client direct (pas de Prisma — plus simple)
- **Auth client** : NextAuth.js v4 + Google OAuth
- **Auth dashboard** : email/password bcrypt (separe de l'OAuth)
- **Styling** : Tailwind CSS + Shadcn/UI
- **Deploy** : Vercel (free tier)
- **Architecture** : Modulaire par feature (src/modules/)

## Alternatives considerees

- **Firebase** : rejete car — vendor lock-in, pas de vrai PostgreSQL, pricing imprevisible
- **Prisma** : rejete car — couche d'abstraction inutile quand Supabase JS suffit
- **Pages Router** : rejete car — App Router est le futur de Next.js, meilleur support RSC

## Consequences

- (+) Stack 100% gratuite en free tier
- (+) Deploiement en 1 commande (vercel --prod)
- (+) Supabase Realtime pour le KDS
- (+) Shadcn/UI = composants pro sans effort
- (-) Supabase free tier limite (500 MB DB)
- (-) NextAuth v4 sera deprece (migration v5 a prevoir)
