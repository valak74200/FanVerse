const { ethers } = require("hardhat");

async function main() {
    console.log("🚨 Reset complet des transactions en attente...\n");
    
    const [deployer] = await ethers.getSigners();
    console.log("👤 Adresse:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Solde:", ethers.formatEther(balance), "CHZ");
    
    const currentNonce = await ethers.provider.getTransactionCount(deployer.address, "latest");
    const pendingNonce = await ethers.provider.getTransactionCount(deployer.address, "pending");
    
    console.log("🔢 Nonce confirmé:", currentNonce);
    console.log("🔢 Nonce en attente:", pendingNonce);
    console.log("⏳ Transactions bloquées:", pendingNonce - currentNonce);
    
    // Reset avec gas price très élevé
    console.log("\n🔥 Tentative de reset avec gas price extrême...");
    
    try {
        // Envoyer une transaction avec un gas price très élevé pour dépasser toutes les autres
        const resetTx = await deployer.sendTransaction({
            to: deployer.address,
            value: ethers.parseEther("0.001"), // Petite valeur pour différencier
            gasLimit: 21000,
            gasPrice: ethers.parseUnits("500", "gwei"), // Gas price extrême
            nonce: currentNonce // Utiliser le nonce confirmé
        });
        
        console.log("📄 Transaction de reset:", resetTx.hash);
        console.log("⏳ Attente de confirmation...");
        
        await resetTx.wait();
        console.log("✅ Reset réussi!");
        
        // Vérifier le nouveau nonce
        const newCurrentNonce = await ethers.provider.getTransactionCount(deployer.address, "latest");
        console.log("🔢 Nouveau nonce:", newCurrentNonce);
        
    } catch (error) {
        console.log("❌ Reset échoué:", error.message);
        
        console.log("\n🆘 Solution ultime:");
        console.log("   Vous devez attendre que les transactions expirent");
        console.log("   ou utiliser un autre compte temporairement");
    }
}

main().catch(console.error);