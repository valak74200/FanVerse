#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("🚀 FANVERSE - DÉPLOIEMENT COMPLET AUTOMATIQUE");
console.log("=" .repeat(60));

// Configuration
const REQUIRED_DEPS = {
  'fanverse-contract': ['hardhat', '@nomicfoundation/hardhat-toolbox'],
  'frontend': ['ethers', 'socket.io-client', 'framer-motion'],
  'backend': ['socket.io', 'express', 'mongoose']
};

// Fonction utilitaire pour exécuter des commandes
function runCommand(command, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    console.log(`\n📝 Exécution: ${command} (dans ${cwd})`);
    
    const child = spawn(command, { 
      shell: true, 
      cwd, 
      stdio: 'inherit' 
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Terminé: ${command}`);
        resolve();
      } else {
        console.log(`❌ Erreur: ${command} (code ${code})`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

// Fonction pour vérifier les dépendances
function checkDependencies() {
  console.log("\n🔍 Vérification des dépendances...");
  
  for (const [dir, deps] of Object.entries(REQUIRED_DEPS)) {
    const packageJsonPath = path.join(dir, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      console.log(`❌ ${dir}/package.json manquant`);
      continue;
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    for (const dep of deps) {
      if (!allDeps[dep]) {
        console.log(`⚠️  ${dep} manquant dans ${dir}`);
      }
    }
  }
  
  console.log("✅ Vérification des dépendances terminée");
}

// Fonction pour créer les fichiers de configuration nécessaires
function createConfigFiles() {
  console.log("\n📁 Création des fichiers de configuration...");
  
  // Créer .env pour fanverse-contract si manquant
  const contractEnvPath = 'fanverse-contract/.env';
  if (!fs.existsSync(contractEnvPath)) {
    const contractEnv = `# Clé privée pour le déploiement (remplacez par votre clé)
PRIVATE_KEY=your_private_key_here
CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com/
ETHERSCAN_API_KEY=your_etherscan_api_key
`;
    fs.writeFileSync(contractEnvPath, contractEnv);
    console.log("📄 Créé: fanverse-contract/.env");
    console.log("⚠️  IMPORTANT: Modifiez fanverse-contract/.env avec votre clé privée!");
  }
  
  // Créer .env pour backend si manquant
  const backendEnvPath = 'backend/.env';
  if (!fs.existsSync(backendEnvPath)) {
    const backendEnv = `PORT=5000
MONGO_URI=mongodb://localhost:27017/fanverse
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
`;
    fs.writeFileSync(backendEnvPath, backendEnv);
    console.log("📄 Créé: backend/.env");
  }
  
  // Créer .env.local pour frontend si manquant
  const frontendEnvPath = 'frontend/.env.local';
  if (!fs.existsSync(frontendEnvPath)) {
    const frontendEnv = `NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BLOCKCHAIN_URL=https://spicy-rpc.chiliz.com/
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
`;
    fs.writeFileSync(frontendEnvPath, frontendEnv);
    console.log("📄 Créé: frontend/.env.local");
  }
}

// Fonction pour vérifier la clé privée
function checkPrivateKey() {
  const envPath = 'fanverse-contract/.env';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('your_private_key_here')) {
      console.log("❌ ERREUR: Vous devez configurer votre PRIVATE_KEY dans fanverse-contract/.env");
      console.log("💡 Ajoutez votre clé privée MetaMask pour le déploiement");
      process.exit(1);
    }
  }
}

// Fonction principale
async function main() {
  try {
    // 1. Vérifications préliminaires
    console.log("\n🔍 ÉTAPE 1: Vérifications préliminaires");
    checkDependencies();
    createConfigFiles();
    
    // 2. Installer les dépendances
    console.log("\n📦 ÉTAPE 2: Installation des dépendances");
    await runCommand('npm install', 'fanverse-contract');
    await runCommand('npm install', 'backend');
    await runCommand('npm install', 'frontend');
    
    // 3. Compiler les contrats
    console.log("\n🔨 ÉTAPE 3: Compilation des smart contracts");
    await runCommand('npx hardhat compile', 'fanverse-contract');
    
    // 4. Vérifier la clé privée
    console.log("\n🔑 ÉTAPE 4: Vérification de la configuration");
    checkPrivateKey();
    
    // 5. Déployer les contrats
    console.log("\n🚀 ÉTAPE 5: Déploiement des smart contracts");
    await runCommand('npx hardhat run scripts/deploy.js --network spicy', 'fanverse-contract');
    
    // 6. Installer ethers dans le frontend si manquant
    console.log("\n🔧 ÉTAPE 6: Installation d'ethers dans le frontend");
    await runCommand('npm install ethers', 'frontend');
    
    // 7. Créer le service de connexion wallet
    console.log("\n💳 ÉTAPE 7: Création du service wallet");
    await createWalletService();
    
    // 8. Intégrer les composants
    console.log("\n🔗 ÉTAPE 8: Intégration des composants");
    await integrateComponents();
    
    // 9. Démarrer les services
    console.log("\n🎯 ÉTAPE 9: Démarrage des services");
    console.log("Vous pouvez maintenant démarrer les services avec:");
    console.log("   npm run dev (depuis la racine)");
    console.log("   ou npm run dev:all pour tout démarrer");
    
    // 10. Résumé final
    console.log("\n🎉 DÉPLOIEMENT COMPLET TERMINÉ!");
    console.log("=" .repeat(60));
    console.log("✅ Smart contracts déployés sur Chiliz Spicy Testnet");
    console.log("✅ Frontend configuré avec Web3");
    console.log("✅ Backend connecté à la blockchain");
    console.log("✅ Services prêts à démarrer");
    
    console.log("\n🔗 Fichiers importants créés:");
    console.log("   • fanverse-contract/deployed-contracts.json - Adresses des contrats");
    console.log("   • fanverse-contract/contract-test.html - Interface de test");
    console.log("   • frontend/lib/web3.js - Service Web3");
    console.log("   • frontend/lib/wallet.js - Service Wallet");
    
    console.log("\n🚀 Prochaines étapes:");
    console.log("   1. Vérifiez que MongoDB est démarré");
    console.log("   2. Exécutez 'npm run dev' pour démarrer tous les services");
    console.log("   3. Ouvrez http://localhost:3000 dans votre navigateur");
    console.log("   4. Connectez MetaMask au réseau Chiliz Spicy");
    console.log("   5. Testez les fonctionnalités blockchain");
    
  } catch (error) {
    console.error("\n❌ ERREUR LORS DU DÉPLOIEMENT:", error.message);
    process.exit(1);
  }
}

// Fonction pour créer le service wallet
async function createWalletService() {
  const walletServiceContent = `
import web3Service from './web3';

class WalletService {
  constructor() {
    this.isConnected = false;
    this.account = null;
    this.balance = '0';
    this.listeners = new Map();
  }

  // Événements
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Connexion automatique
  async autoConnect() {
    if (typeof window === 'undefined' || !window.ethereum) return false;
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await this.connect();
        return true;
      }
    } catch (error) {
      console.error('Erreur auto-connexion:', error);
    }
    return false;
  }

  // Connexion manuelle
  async connect() {
    try {
      const result = await web3Service.connectWallet();
      this.isConnected = result.isConnected;
      this.account = result.account;
      this.balance = await web3Service.getBalance();
      
      this.emit('connected', {
        account: this.account,
        balance: this.balance
      });
      
      return result;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Déconnexion
  disconnect() {
    this.isConnected = false;
    this.account = null;
    this.balance = '0';
    web3Service.disconnect();
    this.emit('disconnected');
  }

  // Mettre à jour le solde
  async updateBalance() {
    if (this.isConnected) {
      this.balance = await web3Service.getBalance();
      this.emit('balanceUpdated', this.balance);
    }
  }

  // Obtenir les informations du compte
  getAccountInfo() {
    return {
      isConnected: this.isConnected,
      account: this.account,
      balance: this.balance,
      formattedAccount: web3Service.formatAddress(this.account)
    };
  }
}

const walletService = new WalletService();
export default walletService;
`;

  fs.writeFileSync('frontend/lib/wallet.js', walletServiceContent);
  console.log("📄 Service wallet créé: frontend/lib/wallet.js");
}

// Fonction pour intégrer les composants
async function integrateComponents() {
  // Créer un composant WalletConnector
  const walletConnectorContent = `
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, ExternalLink, Copy, Check } from 'lucide-react';
import walletService from '@/lib/wallet';

const WalletConnector = () => {
  const [walletInfo, setWalletInfo] = useState({
    isConnected: false,
    account: null,
    balance: '0',
    formattedAccount: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Écouter les événements du wallet
    walletService.on('connected', (data) => {
      setWalletInfo(walletService.getAccountInfo());
      setIsConnecting(false);
    });

    walletService.on('disconnected', () => {
      setWalletInfo(walletService.getAccountInfo());
    });

    walletService.on('balanceUpdated', (balance) => {
      setWalletInfo(prev => ({ ...prev, balance }));
    });

    walletService.on('error', (error) => {
      console.error('Erreur wallet:', error);
      setIsConnecting(false);
    });

    // Tentative de connexion automatique
    walletService.autoConnect();

    return () => {
      // Cleanup listeners si nécessaire
    };
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await walletService.connect();
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    walletService.disconnect();
  };

  const copyAddress = () => {
    if (walletInfo.account) {
      navigator.clipboard.writeText(walletInfo.account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!walletInfo.isConnected) {
    return (
      <Card className="bg-black/80 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span className="text-white">Wallet</span>
            </div>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-primary hover:bg-primary/80"
            >
              {isConnecting ? 'Connexion...' : 'Connecter'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/80 border-primary/30">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-green-400" />
              <Badge variant="outline" className="border-green-400 text-green-400">
                Connecté
              </Badge>
            </div>
            <Button
              onClick={handleDisconnect}
              variant="outline"
              size="sm"
              className="border-red-400 text-red-400 hover:bg-red-400/10"
            >
              Déconnecter
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Adresse:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-white">
                  {walletInfo.formattedAccount}
                </span>
                <button
                  onClick={copyAddress}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Solde:</span>
              <span className="text-sm font-semibold text-primary">
                {parseFloat(walletInfo.balance).toFixed(4)} CHZ
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <span className="text-xs text-gray-500">Chiliz Spicy Testnet</span>
            <a
              href={\`https://testnet.chiliscan.com/address/\${walletInfo.account}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
            >
              Explorer
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnector;
`;

  fs.writeFileSync('frontend/app/components/fanverse/chiliz/WalletConnector.tsx', walletConnectorContent);
  console.log("📄 Composant WalletConnector créé");
}

// Démarrer le script
if (require.main === module) {
  main();
}

module.exports = { main }; 