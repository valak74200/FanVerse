# FanVerse - Monorepo Complet

FanVerse est une plateforme de fan engagement révolutionnaire qui combine les technologies blockchain avec une expérience utilisateur immersive.

## Structure du Projet

```
FanVerse/
├── frontend/              # Application Next.js
│   ├── app/              # Pages et composants Next.js 13+
│   ├── components/       # Composants réutilisables
│   ├── lib/              # Utilitaires et configurations
│   ├── public/           # Assets statiques
│   ├── styles/           # Styles globaux
│   └── package.json      # Dépendances du frontend
├── backend/              # API Node.js/Express
│   ├── models/           # Modèles de données
│   ├── server.js         # Serveur principal
│   ├── db.js             # Configuration base de données
│   └── package.json      # Dépendances du backend
├── fanverse-contract/    # Smart contracts
│   ├── contracts/        # Contrats Solidity
│   ├── scripts/          # Scripts de déploiement
│   ├── test/             # Tests des contrats
│   ├── ignition/         # Configuration Hardhat
│   └── package.json      # Dépendances blockchain
└── package.json          # Configuration monorepo
```

## Démarrage Rapide

### Installation complète

```bash
# Installer toutes les dépendances
npm run install:all

# Ou installer individuellement
npm run install:frontend
npm run install:backend
npm run install:contracts
```

### Développement

```bash
# Démarrer frontend + backend
npm run dev

# Démarrer tous les services (frontend + backend + blockchain locale)
npm run dev:all

# Démarrer individuellement
npm run dev:frontend    # http://localhost:3000
npm run dev:backend     # http://localhost:5000
npm run dev:contracts   # Blockchain locale Hardhat
```

### Production

```bash
# Build complet
npm run build

# Démarrer en production
npm start
```

## Services

### 🎮 Frontend (Next.js 14)
- **URL**: http://localhost:3000
- **Tech**: React, TypeScript, Tailwind CSS, Three.js
- **Features**: Interface 3D, animations, intégration Web3

### 🔧 Backend (Node.js/Express)
- **URL**: http://localhost:5000
- **Tech**: Node.js, Express, MongoDB/PostgreSQL
- **Features**: API REST, authentification, gestion des données

### ⛓️ Smart Contracts (Hardhat)
- **Network**: Localhost:8545 (développement)
- **Tech**: Solidity, Hardhat, Ethers.js
- **Features**: Contrats FanVerse, tokens, paris

## Fonctionnalités

- 🏟️ **Visualisation 3D de stades** avec Three.js
- 🎮 **Interface gaming** avec animations fluides
- 🔗 **Intégration blockchain** (Chiliz Chain)
- 💬 **Chat en temps réel** pour les fans
- 📊 **Tableau de bord interactif**
- 🎯 **Système de paris et prédictions**
- 🔐 **Authentification Web3**
- 💰 **Gestion des tokens et NFTs**

## Technologies Utilisées

### Frontend
- Next.js 14, React 18, TypeScript
- Tailwind CSS, Shadcn/ui
- Three.js, React Three Fiber
- Framer Motion, Web3.js

### Backend
- Node.js, Express.js
- MongoDB/PostgreSQL
- Socket.io (temps réel)
- JWT (authentification)

### Blockchain
- Hardhat, Solidity
- Ethers.js, Web3.js
- Chiliz Chain, OpenZeppelin

## Scripts Disponibles

### Développement
- `npm run dev` - Frontend + Backend
- `npm run dev:all` - Tous les services
- `npm run dev:frontend` - Frontend uniquement
- `npm run dev:backend` - Backend uniquement
- `npm run dev:contracts` - Blockchain locale

### Build & Production
- `npm run build` - Build complet
- `npm run start` - Démarrage production
- `npm run build:contracts` - Compilation des contrats

### Tests
- `npm run test` - Tests complets
- `npm run test:frontend` - Tests frontend
- `npm run test:backend` - Tests backend
- `npm run test:contracts` - Tests smart contracts

### Utilitaires
- `npm run install:all` - Installation complète
- `npm run clean` - Nettoyage node_modules
- `npm run deploy:contracts` - Déploiement des contrats

## Configuration

### Variables d'environnement

Créez les fichiers `.env` dans chaque service :

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BLOCKCHAIN_URL=http://localhost:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

**backend/.env**
```
PORT=5000
DATABASE_URL=mongodb://localhost:27017/fanverse
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

**fanverse-contract/.env**
```
PRIVATE_KEY=your_private_key
CHILIZ_RPC_URL=https://rpc.chiliz.com
ETHERSCAN_API_KEY=your_api_key
```

## Déploiement

### Développement Local
1. `npm run install:all`
2. Configurer les variables d'environnement
3. `npm run dev:all`

### Production
1. `npm run build`
2. `npm run deploy:contracts`
3. `npm start`

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails. 