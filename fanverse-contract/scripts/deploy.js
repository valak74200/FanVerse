const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Démarrage du déploiement complet FanVerse...\n");

  // Obtenir les signers
  const [deployer] = await ethers.getSigners();
  console.log("📝 Déploiement avec le compte:", deployer.address);
  
  // Vérifier le solde
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Solde du compte:", ethers.formatEther(balance), "CHZ\n");

  if (balance < ethers.parseEther("0.1")) {
    console.error("❌ Solde insuffisant pour le déploiement");
    process.exit(1);
  }

  // 1. Déployer EmotionBet
  console.log("🎰 Déploiement du contrat EmotionBet...");
  const EmotionBet = await ethers.getContractFactory("EmotionBet");
  const emotionBet = await EmotionBet.deploy();
  await emotionBet.waitForDeployment();
  const emotionBetAddress = await emotionBet.getAddress();
  console.log("✅ EmotionBet déployé à:", emotionBetAddress);

  // 2. Déployer AttendanceNFT
  console.log("🎨 Déploiement du contrat AttendanceNFT...");
  const AttendanceNFT = await ethers.getContractFactory("AttendanceNFT");
  const attendanceNFT = await AttendanceNFT.deploy();
  await attendanceNFT.waitForDeployment();
  const attendanceNFTAddress = await attendanceNFT.getAddress();
  console.log("✅ AttendanceNFT déployé à:", attendanceNFTAddress);

  // 3. Vérifier les déploiements
  console.log("\n🔍 Vérification des contrats...");
  
  // Vérifier EmotionBet
  const emotionBetOwner = await emotionBet.owner();
  const emotionBetClosed = await emotionBet.closed();
  console.log("   EmotionBet owner:", emotionBetOwner);
  console.log("   EmotionBet closed:", emotionBetClosed);
  
  // Vérifier AttendanceNFT
  const attendanceNFTOwner = await attendanceNFT.owner();
  const nextTokenId = await attendanceNFT.nextTokenId();
  console.log("   AttendanceNFT owner:", attendanceNFTOwner);
  console.log("   AttendanceNFT nextTokenId:", nextTokenId.toString());

  // 4. Créer le fichier de configuration
  const contractConfig = {
    network: "chiliz-spicy-testnet",
    chainId: 88882,
    rpcUrl: "https://spicy-rpc.chiliz.com/",
    explorer: "https://testnet.chiliscan.com/",
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      EmotionBet: {
        address: emotionBetAddress,
        owner: emotionBetOwner
      },
      AttendanceNFT: {
        address: attendanceNFTAddress,
        owner: attendanceNFTOwner
      }
    }
  };

  // Sauvegarder la configuration
  const configPath = path.join(__dirname, '../deployed-contracts.json');
  fs.writeFileSync(configPath, JSON.stringify(contractConfig, null, 2));
  console.log("📄 Configuration sauvegardée dans:", configPath);

  // 5. Mettre à jour le fichier .env du frontend
  const frontendEnvPath = path.join(__dirname, '../../frontend/.env.local');
  let envContent = '';
  
  if (fs.existsSync(frontendEnvPath)) {
    envContent = fs.readFileSync(frontendEnvPath, 'utf8');
  }

  // Supprimer les anciennes adresses si elles existent
  envContent = envContent.replace(/^NEXT_PUBLIC_EMOTION_BET_ADDRESS=.*$/m, '');
  envContent = envContent.replace(/^NEXT_PUBLIC_ATTENDANCE_NFT_ADDRESS=.*$/m, '');
  envContent = envContent.replace(/^NEXT_PUBLIC_CHAIN_ID=.*$/m, '');
  envContent = envContent.replace(/^NEXT_PUBLIC_RPC_URL=.*$/m, '');

  // Ajouter les nouvelles adresses
  envContent += `\n# Smart Contracts (auto-generated)\n`;
  envContent += `NEXT_PUBLIC_EMOTION_BET_ADDRESS=${emotionBetAddress}\n`;
  envContent += `NEXT_PUBLIC_ATTENDANCE_NFT_ADDRESS=${attendanceNFTAddress}\n`;
  envContent += `NEXT_PUBLIC_CHAIN_ID=88882\n`;
  envContent += `NEXT_PUBLIC_RPC_URL=https://spicy-rpc.chiliz.com/\n`;

  fs.writeFileSync(frontendEnvPath, envContent);
  console.log("🔧 Variables d'environnement mises à jour dans:", frontendEnvPath);

  // 6. Mettre à jour le fichier .env du backend
  const backendEnvPath = path.join(__dirname, '../../backend/.env');
  let backendEnvContent = '';
  
  if (fs.existsSync(backendEnvPath)) {
    backendEnvContent = fs.readFileSync(backendEnvPath, 'utf8');
  }

  // Supprimer les anciennes adresses si elles existent
  backendEnvContent = backendEnvContent.replace(/^EMOTION_BET_ADDRESS=.*$/m, '');
  backendEnvContent = backendEnvContent.replace(/^ATTENDANCE_NFT_ADDRESS=.*$/m, '');
  backendEnvContent = backendEnvContent.replace(/^BLOCKCHAIN_RPC_URL=.*$/m, '');

  // Ajouter les nouvelles adresses
  backendEnvContent += `\n# Smart Contracts (auto-generated)\n`;
  backendEnvContent += `EMOTION_BET_ADDRESS=${emotionBetAddress}\n`;
  backendEnvContent += `ATTENDANCE_NFT_ADDRESS=${attendanceNFTAddress}\n`;
  backendEnvContent += `BLOCKCHAIN_RPC_URL=https://spicy-rpc.chiliz.com/\n`;

  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log("🔧 Variables d'environnement backend mises à jour dans:", backendEnvPath);

  // 7. Créer un fichier de test pour vérifier les contrats
  const testScript = `
// Test automatique des contrats déployés
const { ethers } = require("hardhat");

async function testContracts() {
  console.log("🧪 Test des contrats déployés...");
  
  const [deployer] = await ethers.getSigners();
  
  // Test EmotionBet
  const emotionBet = await ethers.getContractAt("EmotionBet", "${emotionBetAddress}");
  console.log("EmotionBet owner:", await emotionBet.owner());
  console.log("EmotionBet closed:", await emotionBet.closed());
  
  // Test AttendanceNFT
  const attendanceNFT = await ethers.getContractAt("AttendanceNFT", "${attendanceNFTAddress}");
  console.log("AttendanceNFT owner:", await attendanceNFT.owner());
  console.log("AttendanceNFT nextTokenId:", await attendanceNFT.nextTokenId());
  
  console.log("✅ Tous les tests passés!");
}

testContracts().catch(console.error);
`;

  fs.writeFileSync(path.join(__dirname, '../test-deployed.js'), testScript);
  console.log("🧪 Script de test créé: test-deployed.js");

  // 8. Créer un fichier HTML de test
  const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>FanVerse - Test des Contrats</title>
    <script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #1a1a1a; color: white; }
        .container { max-width: 800px; margin: 0 auto; }
        .contract { background: #2a2a2a; padding: 20px; margin: 10px 0; border-radius: 8px; }
        button { background: #ff6b35; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        input { padding: 8px; margin: 5px; border-radius: 4px; border: 1px solid #555; background: #333; color: white; }
        .success { color: #4caf50; }
        .error { color: #f44336; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 FanVerse - Test des Contrats Déployés</h1>
        
        <div class="contract">
            <h2>📊 Informations de déploiement</h2>
            <p><strong>Réseau:</strong> Chiliz Spicy Testnet (88882)</p>
            <p><strong>EmotionBet:</strong> ${emotionBetAddress}</p>
            <p><strong>AttendanceNFT:</strong> ${attendanceNFTAddress}</p>
            <p><strong>Déployé le:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="contract">
            <h2>🔗 Connexion Wallet</h2>
            <button onclick="connectWallet()">Connecter MetaMask</button>
            <p id="wallet-status">Non connecté</p>
        </div>
        
        <div class="contract">
            <h2>🎰 Test EmotionBet</h2>
            <input type="text" id="bet-description" placeholder="Description du pari">
            <input type="number" id="bet-amount" placeholder="Montant (CHZ)" step="0.01">
            <button onclick="placeBet()">Placer un pari</button>
            <button onclick="getBetStats()">Voir les stats</button>
            <div id="bet-result"></div>
        </div>
        
        <div class="contract">
            <h2>🎨 Test AttendanceNFT</h2>
            <button onclick="getUserNFTs()">Mes NFTs</button>
            <button onclick="getTotalSupply()">Total des NFTs</button>
            <div id="nft-result"></div>
        </div>
        
        <div class="contract">
            <h2>📋 Logs</h2>
            <div id="logs" style="background: #333; padding: 10px; border-radius: 4px; height: 200px; overflow-y: auto; font-family: monospace;"></div>
        </div>
    </div>

    <script>
        const EMOTION_BET_ADDRESS = "${emotionBetAddress}";
        const ATTENDANCE_NFT_ADDRESS = "${attendanceNFTAddress}";
        
        let provider, signer, account;
        
        function log(message, type = 'info') {
            const logs = document.getElementById('logs');
            const timestamp = new Date().toLocaleTimeString();
            const color = type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#fff';
            logs.innerHTML += \`<div style="color: \${color}">[\${timestamp}] \${message}</div>\`;
            logs.scrollTop = logs.scrollHeight;
        }
        
        async function connectWallet() {
            try {
                if (!window.ethereum) {
                    throw new Error('MetaMask non installé');
                }
                
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                signer = provider.getSigner();
                account = await signer.getAddress();
                
                document.getElementById('wallet-status').innerHTML = \`Connecté: \${account}\`;
                log('Wallet connecté: ' + account, 'success');
                
                // Vérifier le réseau
                const network = await provider.getNetwork();
                if (network.chainId !== 88882) {
                    log('Mauvais réseau. Changement vers Chiliz Spicy...', 'error');
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x15b32' }]
                    });
                }
                
            } catch (error) {
                log('Erreur de connexion: ' + error.message, 'error');
            }
        }
        
        async function placeBet() {
            try {
                const description = document.getElementById('bet-description').value;
                const amount = document.getElementById('bet-amount').value;
                
                if (!description || !amount) {
                    throw new Error('Description et montant requis');
                }
                
                const contract = new ethers.Contract(EMOTION_BET_ADDRESS, [
                    "function placeBet(string description) payable"
                ], signer);
                
                const tx = await contract.placeBet(description, {
                    value: ethers.utils.parseEther(amount)
                });
                
                log('Transaction envoyée: ' + tx.hash);
                const receipt = await tx.wait();
                log('Pari placé avec succès!', 'success');
                document.getElementById('bet-result').innerHTML = '<div class="success">Pari placé!</div>';
                
            } catch (error) {
                log('Erreur pari: ' + error.message, 'error');
                document.getElementById('bet-result').innerHTML = '<div class="error">' + error.message + '</div>';
            }
        }
        
        async function getBetStats() {
            try {
                const contract = new ethers.Contract(EMOTION_BET_ADDRESS, [
                    "function getStats() view returns (uint256, uint256, uint256, bool, string)"
                ], provider);
                
                const stats = await contract.getStats();
                const result = \`
                    <div>
                        <p>Pool total: \${ethers.utils.formatEther(stats[0])} CHZ</p>
                        <p>Pool gagnants: \${ethers.utils.formatEther(stats[1])} CHZ</p>
                        <p>Nombre de paris: \${stats[2].toString()}</p>
                        <p>Résolu: \${stats[3] ? 'Oui' : 'Non'}</p>
                        <p>Description gagnante: \${stats[4] || 'Aucune'}</p>
                    </div>
                \`;
                document.getElementById('bet-result').innerHTML = result;
                log('Stats récupérées', 'success');
                
            } catch (error) {
                log('Erreur stats: ' + error.message, 'error');
            }
        }
        
        async function getUserNFTs() {
            try {
                const contract = new ethers.Contract(ATTENDANCE_NFT_ADDRESS, [
                    "function getUserNFTs(address user) view returns (uint256[])"
                ], provider);
                
                const nfts = await contract.getUserNFTs(account);
                document.getElementById('nft-result').innerHTML = \`NFTs possédés: \${nfts.length}\`;
                log('NFTs récupérés: ' + nfts.length, 'success');
                
            } catch (error) {
                log('Erreur NFTs: ' + error.message, 'error');
            }
        }
        
        async function getTotalSupply() {
            try {
                const contract = new ethers.Contract(ATTENDANCE_NFT_ADDRESS, [
                    "function getTotalSupply() view returns (uint256)"
                ], provider);
                
                const total = await contract.getTotalSupply();
                document.getElementById('nft-result').innerHTML = \`Total NFTs: \${total.toString()}\`;
                log('Total NFTs: ' + total.toString(), 'success');
                
            } catch (error) {
                log('Erreur total: ' + error.message, 'error');
            }
        }
        
        log('Interface de test chargée');
    </script>
</body>
</html>
`;

  fs.writeFileSync(path.join(__dirname, '../contract-test.html'), testHtml);
  console.log("🌐 Interface de test créée: contract-test.html");

  // 9. Résumé final
  console.log("\n🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!");
  console.log("=" .repeat(50));
  console.log("📋 Résumé:");
  console.log("   • EmotionBet:", emotionBetAddress);
  console.log("   • AttendanceNFT:", attendanceNFTAddress);
  console.log("   • Réseau: Chiliz Spicy Testnet (88882)");
  console.log("   • Explorer: https://testnet.chiliscan.com/");
  console.log("\n🔗 Liens utiles:");
  console.log("   • EmotionBet: https://testnet.chiliscan.com/address/" + emotionBetAddress);
  console.log("   • AttendanceNFT: https://testnet.chiliscan.com/address/" + attendanceNFTAddress);
  console.log("\n📁 Fichiers créés:");
  console.log("   • deployed-contracts.json - Configuration des contrats");
  console.log("   • test-deployed.js - Script de test");
  console.log("   • contract-test.html - Interface de test");
  console.log("\n🚀 Prochaines étapes:");
  console.log("   1. Redémarrer le frontend pour charger les nouvelles variables");
  console.log("   2. Redémarrer le backend pour la connexion blockchain");
  console.log("   3. Ouvrir contract-test.html pour tester les contrats");
  console.log("   4. Connecter MetaMask au réseau Chiliz Spicy");
  console.log("\n✅ Tous les services sont maintenant connectés à la blockchain!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur lors du déploiement:", error);
    process.exit(1);
});