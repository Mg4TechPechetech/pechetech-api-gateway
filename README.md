# 🛡️ PecheTech API Gateway (BFF)

L'API Gateway de PecheTech agit comme un **Backend-For-Frontend (BFF)** et sert de point d'entrée unique pour toutes les applications (PWA, Mobile). Il est implémenté en Node.js/NestJS.

## 🎯 Rôle et Alignement Business Model
Ce composant n'est pas qu'un simple proxy (rôle déjà partiellement tenu par Traefik), il est le garant de la **stratégie de monétisation** définie dans le Business Plan :

1. **Monétisation Freemium / Premium (IA)** :
   Le Gateway intercepte les requêtes vers le `pechetech-predictive-weather-service`. Seuls les utilisateurs ayant le `plan: 'PREMIUM'` dans leur token JWT peuvent accéder aux prévisions de prix du marché (`/api/v1/predictions/market/*`), tandis que la météo de base reste gratuite.

2. **Micro-Commissions (Carburant)** :
   Le Gateway trace les appels vers `/api/v1/fuel` (Bons d'essence) pour permettre la facturation analytique des frais de service (0,5% par transaction).

3. **Rate Limiting** :
   Prévention contre les attaques DDoS et limitation stricte des appels API pour les GIE non abonnés (SaaS B2B).

## 🛠 Stack Technique
- **Framework** : NestJS
- **Proxy** : `http-proxy-middleware`
- **Sécurité** : JWT (JSON Web Tokens), `@nestjs/throttler`

## 🚀 Démarrage Rapide

\`\`\`bash
npm install
npm run start:dev
\`\`\`

## 🔗 Routes Exposées
Le Gateway écoute sur le port **8080** par défaut et redirige vers le réseau interne de microservices :
- \`/api/v1/expenses/*\` -> \`pechetech-benefit-service:3000\`
- \`/api/v1/fuel/*\` -> \`pechetech-fuel-service:3001\`
- \`/api/v1/ocr/*\` -> \`pechetech-finance-ocr-service:8000\`
- \`/api/v1/predictions/*\` -> \`pechetech-predictive-weather-service:8000\` (Bloqué si appel Market sans Premium)
