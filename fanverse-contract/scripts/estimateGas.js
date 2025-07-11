require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Estimation des frais de déploiement...\n");
    
    const [deployer] = await ethers.getSigners();
    console.log("📍 Déploiement depuis:", deployer.address);
    
    // Obtenir la factory du contrat
    const EmotionBet = await ethers.getContractFactory("EmotionBet");
    
    // Estimer le gas pour le déploiement
    const deployTransaction = EmotionBet.getDeployTransaction();
    const estimatedGas = await deployer.estimateGas(deployTransaction);
    
    // Obtenir le prix du gas actuel via le provider
    const feeData = await ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    
    // Calculer le coût total
    const totalCost = estimatedGas * gasPrice;
    
    console.log("⛽ Gas estimé:", estimatedGas.toString());
    console.log("💰 Prix du gas:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
    console.log("💸 Coût total estimé:", ethers.formatEther(totalCost), "CHZ");
    console.log("💵 Coût en USD (si 1 CHZ = $0.1):", (parseFloat(ethers.formatEther(totalCost)) * 0.1).toFixed(4), "$");
    
    // Vérifier le solde
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("🏦 Solde actuel:", ethers.formatEther(balance), "CHZ");
    
    if (balance < totalCost) {
        console.log("❌ Solde insuffisant pour le déploiement !");
    } else {
        console.log("✅ Solde suffisant pour le déploiement");
        console.log("🔄 Nouveau solde après déploiement:", ethers.formatEther(balance - totalCost), "CHZ");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
