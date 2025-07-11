require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Déploiement simple et rapide...\n");
    
    const [deployer] = await ethers.getSigners();
    console.log("📍 Déploiement depuis:", deployer.address);
    
    // Vérifier le solde avant
    const balanceBefore = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Solde avant:", ethers.formatEther(balanceBefore), "CHZ");
    
    // Déployer normalement - laissons Hardhat gérer
    const EmotionBet = await ethers.getContractFactory("EmotionBet");
    
    console.log("⏳ Déploiement en cours (version simple)...");
    const contract = await EmotionBet.deploy();
    
    console.log("⏳ Attente de confirmation...");
    await contract.waitForDeployment();
    
    // Vérifier le solde après
    const balanceAfter = await ethers.provider.getBalance(deployer.address);
    const costActual = balanceBefore - balanceAfter;
    
    console.log("\n✅ Déploiement réussi !");
    console.log("📍 Adresse du contrat:", contract.target);
    console.log("💸 Coût réel:", ethers.formatEther(costActual), "CHZ");
    console.log("🏦 Nouveau solde:", ethers.formatEther(balanceAfter), "CHZ");
    
    // Analyser pourquoi c'est cher
    const feeData = await ethers.provider.getFeeData();
    console.log("\n📊 Analyse des frais :");
    console.log("⛽ Prix du gas réseau:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
    console.log("💡 Note: Le réseau Chiliz Spicy a des frais élevés");
    console.log("💡 C'est normal pour un testnet - en production les frais seront différents");
}

main().catch((error) => {
    console.error("❌ Erreur de déploiement:", error);
    process.exitCode = 1;
});
