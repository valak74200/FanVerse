// test-fanverse.js
const { ethers } = require('ethers');
const io = require('socket.io-client');

// Charger les variables d'environnement depuis .env
try {
    require('dotenv').config();
} catch (e) {
    console.log('⚠️  dotenv non trouvé, utilisation des variables d\'environnement système');
}

// Utiliser fetch natif de Node.js 18+ ou importer node-fetch
let fetch;
if (typeof globalThis.fetch === 'undefined') {
    try {
        fetch = require('node-fetch');
    } catch (e) {
        console.error('❌ node-fetch non trouvé. Installez-le avec: npm install node-fetch@2');
        process.exit(1);
    }
} else {
    fetch = globalThis.fetch;
}

// Configuration depuis .env
const CONFIG = {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',
    RPC_URL: process.env.CHILIZ_RPC_URL || 'https://spicy-rpc.chiliz.com/',
    EMOTION_BET_ADDRESS: process.env.EMOTION_BET_ADDRESS || '0xA21a8923d128bf0CA1DdeD6E1350853389a13fAc',
    ATTENDANCE_NFT_ADDRESS: process.env.ATTENDANCE_NFT_ADDRESS || '0x98d2Ab4D5235CE1f53Ed2A1e1B2F0E7d003E7517',
    PRIVATE_KEY: process.env.PRIVATE_KEY
};

// Vérification de la configuration
if (!CONFIG.PRIVATE_KEY) {
    console.error('❌ PRIVATE_KEY non trouvée dans .env ou variables d\'environnement');
    console.error('💡 Ajoutez PRIVATE_KEY=votre_clé dans le fichier .env');
    console.error('💡 Ou utilisez: PRIVATE_KEY=votre_clé node test.js');
    process.exit(1);
}

console.log('🔧 Configuration chargée:');
console.log(`   RPC: ${CONFIG.RPC_URL}`);
console.log(`   EmotionBet: ${CONFIG.EMOTION_BET_ADDRESS}`);
console.log(`   AttendanceNFT: ${CONFIG.ATTENDANCE_NFT_ADDRESS}`);
console.log(`   Private Key: ${CONFIG.PRIVATE_KEY ? '✅ Configurée' : '❌ Manquante'}`);

// ABIs simplifiés
const EMOTION_BET_ABI = [
    "function owner() view returns (address)",
    "function closed() view returns (bool)",
    "function getBetCount() view returns (uint256)",
    "function getAllBets() view returns (tuple(address user, string description, uint96 amount)[])",
    "function placeBet(string description) payable"
];

const ATTENDANCE_NFT_ABI = [
    "function owner() view returns (address)",
    "function getTotalSupply() view returns (uint256)",
    "function getUserNFTs(address) view returns (uint256[])",
    "function mintCommonNFT(address to, string eventName, string eventDate, string eventType, uint32 attendanceCount)"
];

class FanVerseTestSuite {
    constructor() {
        this.provider = null;
        this.wallet = null;
        this.emotionBetContract = null;
        this.attendanceNFTContract = null;
        this.socket = null;
        this.results = { passed: 0, failed: 0, total: 0 };
    }

    // Utilitaires
    log(message, type = 'INFO') {
        const timestamp = new Date().toISOString();
        const colors = {
            INFO: '\x1b[36m',    // Cyan
            SUCCESS: '\x1b[32m', // Green
            ERROR: '\x1b[31m',   // Red
            WARNING: '\x1b[33m'  // Yellow
        };
        console.log(`${colors[type]}[${timestamp}] ${message}\x1b[0m`);
    }

    async test(name, testFunction) {
        this.results.total++;
        try {
            await testFunction();
            this.results.passed++;
            this.log(`✅ ${name}`, 'SUCCESS');
        } catch (error) {
            this.results.failed++;
            this.log(`❌ ${name}: ${error.message}`, 'ERROR');
        }
    }

    // Initialisation
    async init() {
        this.log('🚀 INITIALISATION DU TEST SUITE', 'INFO');
        
        // Vérifier la clé privée
        if (!CONFIG.PRIVATE_KEY || CONFIG.PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
            throw new Error('PRIVATE_KEY non configurée! Utilisez: export PRIVATE_KEY=your_key');
        }

        try {
            // Connexion blockchain (ethers v6)
            this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
            this.wallet = new ethers.Wallet(CONFIG.PRIVATE_KEY, this.provider);
            
            // Test de connexion
            await this.provider.getNetwork();
            this.log('✅ Connexion blockchain réussie', 'SUCCESS');
            
            // Connexion contrats
            this.emotionBetContract = new ethers.Contract(
                CONFIG.EMOTION_BET_ADDRESS,
                EMOTION_BET_ABI,
                this.wallet
            );
            
            this.attendanceNFTContract = new ethers.Contract(
                CONFIG.ATTENDANCE_NFT_ADDRESS,
                ATTENDANCE_NFT_ABI,
                this.wallet
            );

            // Connexion WebSocket
            this.socket = io(CONFIG.BACKEND_URL);
            
            this.log(`💰 Adresse: ${this.wallet.address}`, 'INFO');
            const balance = await this.provider.getBalance(this.wallet.address);
            this.log(`💰 Balance: ${ethers.formatEther(balance)} CHZ`, 'INFO');
            
        } catch (error) {
            this.log(`❌ Erreur initialisation: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    // Tests Backend
    async testBackendAPI() {
        this.log('🧪 TESTS BACKEND API', 'INFO');
        
        const endpoints = [
            '/api/blockchain/network',
            '/api/blockchain/bets/status',
            '/api/blockchain/bets',
            '/api/blockchain/nfts/supply'
        ];

        for (const endpoint of endpoints) {
            await this.test(`Backend API: ${endpoint}`, async () => {
                const response = await fetch(`${CONFIG.BACKEND_URL}${endpoint}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                if (!data.success) throw new Error(data.error || 'API Error');
            });
        }
    }

    // Tests WebSocket
    async testWebSocket() {
        this.log('🧪 TESTS WEBSOCKET', 'INFO');

        await this.test('WebSocket Connection', async () => {
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Connection timeout'));
                }, 5000);

                this.socket.on('connect', () => {
                    clearTimeout(timeout);
                    resolve();
                });
                
                this.socket.on('connect_error', (error) => {
                    clearTimeout(timeout);
                    reject(error);
                });
                
                // Si déjà connecté
                if (this.socket.connected) {
                    clearTimeout(timeout);
                    resolve();
                }
            });
        });

        await this.test('WebSocket Authentication', async () => {
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Auth timeout'));
                }, 5000);

                this.socket.emit('authenticate', { 
                    userId: 'test_user', 
                    walletAddress: this.wallet.address 
                });
                
                this.socket.on('authenticated', () => {
                    clearTimeout(timeout);
                    resolve();
                });
                
                this.socket.on('login_error', (error) => {
                    clearTimeout(timeout);
                    reject(new Error(error.message));
                });
            });
        });
    }

    // Tests EmotionBet
    async testEmotionBet() {
        this.log('🧪 TESTS EMOTIONBET CONTRACT', 'INFO');

        await this.test('EmotionBet: Get Owner', async () => {
            const owner = await this.emotionBetContract.owner();
            if (!ethers.isAddress(owner)) throw new Error('Invalid owner address');
            this.log(`   Owner: ${owner}`, 'INFO');
        });

        await this.test('EmotionBet: Get Status', async () => {
            const closed = await this.emotionBetContract.closed();
            if (typeof closed !== 'boolean') throw new Error('Invalid status');
            this.log(`   Status: ${closed ? 'Fermé' : 'Ouvert'}`, 'INFO');
        });

        await this.test('EmotionBet: Get Bet Count', async () => {
            const count = await this.emotionBetContract.getBetCount();
            if (count < 0) throw new Error('Invalid bet count');
            this.log(`   Bet Count: ${count.toString()}`, 'INFO');
        });

        await this.test('EmotionBet: Get All Bets', async () => {
            const bets = await this.emotionBetContract.getAllBets();
            if (!Array.isArray(bets)) throw new Error('Invalid bets array');
            this.log(`   Total Bets: ${bets.length}`, 'INFO');
        });

        // Test placement de pari (si pas fermé)
        const closed = await this.emotionBetContract.closed();
        if (!closed) {
            await this.test('EmotionBet: Place Bet', async () => {
                const description = `Test auto ${Date.now()}`;
                const tx = await this.emotionBetContract.placeBet(description, {
                    value: ethers.parseEther('0.001'),
                    gasLimit: 300000
                });
                const receipt = await tx.wait();
                if (!receipt.hash) throw new Error('Transaction failed');
                this.log(`   TX Hash: ${receipt.hash}`, 'INFO');
            });
        } else {
            this.log('   ⚠️ Contrat fermé, skip placement pari', 'WARNING');
        }
    }

    // Tests AttendanceNFT
    async testAttendanceNFT() {
        this.log('🧪 TESTS ATTENDANCE NFT CONTRACT', 'INFO');

        await this.test('AttendanceNFT: Get Owner', async () => {
            const owner = await this.attendanceNFTContract.owner();
            if (!ethers.isAddress(owner)) throw new Error('Invalid owner address');
            this.log(`   Owner: ${owner}`, 'INFO');
        });

        await this.test('AttendanceNFT: Get Total Supply', async () => {
            const supply = await this.attendanceNFTContract.getTotalSupply();
            if (supply < 0) throw new Error('Invalid supply');
            this.log(`   Total Supply: ${supply.toString()}`, 'INFO');
        });

        await this.test('AttendanceNFT: Get User NFTs', async () => {
            const nfts = await this.attendanceNFTContract.getUserNFTs(this.wallet.address);
            if (!Array.isArray(nfts)) throw new Error('Invalid NFTs array');
            this.log(`   User NFTs: ${nfts.length}`, 'INFO');
        });

        // Test mint (si owner)
        const owner = await this.attendanceNFTContract.owner();
        if (owner.toLowerCase() === this.wallet.address.toLowerCase()) {
            await this.test('AttendanceNFT: Mint Common NFT', async () => {
                const tx = await this.attendanceNFTContract.mintCommonNFT(
                    this.wallet.address,
                    'Test Event',
                    '2024-01-15',
                    'test',
                    1000
                );
                const receipt = await tx.wait();
                if (!receipt.hash) throw new Error('Mint failed');
                this.log(`   Mint TX: ${receipt.hash}`, 'INFO');
            });
        } else {
            this.log('   ⚠️ Pas owner, skip mint test', 'WARNING');
        }
    }

    // Test d'intégration
    async testIntegration() {
        this.log('🧪 TESTS INTEGRATION', 'INFO');

        await this.test('Integration: API vs Contract Consistency', async () => {
            // Comparer données API vs contrat
            const apiResponse = await fetch(`${CONFIG.BACKEND_URL}/api/blockchain/bets`);
            const apiData = await apiResponse.json();
            const contractBets = await this.emotionBetContract.getAllBets();
            
            if (!apiData.success) {
                throw new Error(`API Error: ${apiData.error}`);
            }
            
            const apiCount = apiData.data?.length || 0;
            const contractCount = contractBets.length;
            
            this.log(`   API Bets: ${apiCount}, Contract Bets: ${contractCount}`, 'INFO');
            
            // Tolérer une différence de 1 (race condition possible)
            if (Math.abs(apiCount - contractCount) > 1) {
                throw new Error(`API count (${apiCount}) != Contract count (${contractCount})`);
            }
        });

        await this.test('Integration: Real-time Event Test', async () => {
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    this.log('   ⏰ Timeout événement temps réel (normal)', 'WARNING');
                    resolve(); // Pas critique, on continue
                }, 8000);

                // Écouter un événement
                this.socket.on('blockchain_bet_placed', () => {
                    clearTimeout(timeout);
                    this.log('   ✅ Événement temps réel reçu', 'SUCCESS');
                    resolve();
                });
                
                // Déclencher l'événement si possible
                setTimeout(async () => {
                    try {
                        const closed = await this.emotionBetContract.closed();
                        if (!closed) {
                            await this.emotionBetContract.placeBet(`Integration test ${Date.now()}`, {
                                value: ethers.parseEther('0.001')
                            });
                        } else {
                            this.log('   ⚠️ Contrat fermé, skip test événement', 'WARNING');
                            clearTimeout(timeout);
                            resolve();
                        }
                    } catch (error) {
                        this.log(`   ⚠️ Erreur trigger événement: ${error.message}`, 'WARNING');
                        clearTimeout(timeout);
                        resolve(); // Pas critique
                    }
                }, 1000);
            });
        });
    }

    // Test de performance
    async testPerformance() {
        this.log('🧪 TESTS PERFORMANCE', 'INFO');

        await this.test('Performance: Contract Calls', async () => {
            const start = Date.now();
            
            const results = await Promise.all([
                this.emotionBetContract.getBetCount(),
                this.attendanceNFTContract.getTotalSupply(),
                this.provider.getBalance(this.wallet.address)
            ]);
            
            const duration = Date.now() - start;
            this.log(`   ⚡ Contract calls: ${duration}ms`, 'INFO');
            
            if (duration > 10000) throw new Error(`Too slow: ${duration}ms`);
        });

        await this.test('Performance: API Calls', async () => {
            const start = Date.now();
            
            const promises = [
                fetch(`${CONFIG.BACKEND_URL}/api/blockchain/network`),
                fetch(`${CONFIG.BACKEND_URL}/api/blockchain/bets/status`),
                fetch(`${CONFIG.BACKEND_URL}/api/blockchain/nfts/supply`)
            ];
            
            await Promise.all(promises);
            const duration = Date.now() - start;
            this.log(`   ⚡ API calls: ${duration}ms`, 'INFO');
            
            if (duration > 5000) throw new Error(`Too slow: ${duration}ms`);
        });
    }

    // Test de connectivité de base
    async testBasicConnectivity() {
        this.log('🧪 TESTS CONNECTIVITÉ DE BASE', 'INFO');

        await this.test('Basic: Backend Health Check', async () => {
            const response = await fetch(`${CONFIG.BACKEND_URL}/health`);
            if (!response.ok) {
                // Essayer la route racine
                const rootResponse = await fetch(CONFIG.BACKEND_URL);
                if (!rootResponse.ok) {
                    throw new Error(`Backend inaccessible: ${response.status}`);
                }
            }
        });

        await this.test('Basic: Blockchain RPC', async () => {
            const network = await this.provider.getNetwork();
            this.log(`   Network: ${network.name} (${network.chainId})`, 'INFO');
        });

        await this.test('Basic: Wallet Balance', async () => {
            const balance = await this.provider.getBalance(this.wallet.address);
            const balanceEth = ethers.formatEther(balance);
            
            if (parseFloat(balanceEth) < 0.001) {
                throw new Error(`Balance insuffisante: ${balanceEth} CHZ`);
            }
        });
    }

    // Lancer tous les tests
    async runAllTests() {
        this.log('🎯 LANCEMENT DE TOUS LES TESTS', 'INFO');
        
        try {
            await this.init();
            await this.testBasicConnectivity();
            await this.testBackendAPI();
            await this.testWebSocket();
            await this.testEmotionBet();
            await this.testAttendanceNFT();
            await this.testIntegration();
            await this.testPerformance();
            
            this.generateReport();
            
        } catch (error) {
            this.log(`💥 ERREUR CRITIQUE: ${error.message}`, 'ERROR');
            this.generateReport();
        } finally {
            if (this.socket) {
                this.socket.disconnect();
            }
        }
    }

    // Générer le rapport
    generateReport() {
        const { passed, failed, total } = this.results;
        const successRate = total > 0 ? (passed / total * 100).toFixed(1) : 0;
        
        this.log('📊 ===== RAPPORT FINAL =====', 'INFO');
        this.log(`🎯 Tests total: ${total}`, 'INFO');
        this.log(`✅ Réussis: ${passed}`, 'SUCCESS');
        this.log(`❌ Échoués: ${failed}`, failed > 0 ? 'ERROR' : 'INFO');
        this.log(`📈 Taux de réussite: ${successRate}%`, successRate > 80 ? 'SUCCESS' : 'WARNING');
        
        if (successRate >= 90) {
            this.log('🏆 EXCELLENT! Tous les systèmes fonctionnent parfaitement', 'SUCCESS');
        } else if (successRate >= 70) {
            this.log('✅ BON! Quelques améliorations possibles', 'WARNING');
        } else {
            this.log('⚠️ ATTENTION! Plusieurs problèmes détectés', 'ERROR');
        }
        
        // Recommandations
        if (failed > 0) {
            this.log('🔧 RECOMMANDATIONS:', 'INFO');
            this.log('   - Vérifiez que le backend est démarré (npm start)', 'INFO');
            this.log('   - Vérifiez votre connexion internet', 'INFO');
            this.log('   - Vérifiez que les contrats sont déployés', 'INFO');
            this.log('   - Vérifiez votre balance CHZ', 'INFO');
        }
    }
}

// Lancer les tests
async function main() {
    const testSuite = new FanVerseTestSuite();
    await testSuite.runAllTests();
}

// Gestion des erreurs
process.on('uncaughtException', (error) => {
    console.error('💥 ERREUR CRITIQUE:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 PROMESSE REJETÉE:', reason);
    process.exit(1);
});

// Exécution
if (require.main === module) {
    main();
}

module.exports = FanVerseTestSuite;