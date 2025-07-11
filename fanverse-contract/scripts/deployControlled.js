require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    console.log("🎯 Déploiement avec contrôle précis des coûts...\n");
    
    const [deployer] = await ethers.getSigners();
    console.log("📍 Déploiement depuis:", deployer.address);
    
    const balanceBefore = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Solde avant:", ethers.formatEther(balanceBefore), "CHZ");
    
    // Confirmation utilisateur avant déploiement
    const feeData = await ethers.provider.getFeeData();
    const EmotionBet = await ethers.getContractFactory("EmotionBet");
    const estimatedGas = await EmotionBet.getDeployTransaction().estimateGas();
    const estimatedCost = estimatedGas * feeData.gasPrice;
    
    console.log("\n📋 Détails du déploiement:");
    console.log("   Gas estimé:", estimatedGas.toString());
    console.log("   Prix gas:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
    console.log("   Coût estimé:", ethers.formatEther(estimatedCost), "CHZ");
    
    // Seuil de sécurité
    const maxAcceptableCost = ethers.parseEther("1.0"); // Maximum 1 CHZ
    
    if (estimatedCost > maxAcceptableCost) {
        console.log("⚠️  ATTENTION: Coût estimé trop élevé!");
        console.log("   Coût estimé:", ethers.formatEther(estimatedCost), "CHZ");
        console.log("   Limite fixée:", ethers.formatEther(maxAcceptableCost), "CHZ");
        console.log("   Déploiement annulé pour éviter les coûts excessifs");
        return;
    }
    
    console.log("✅ Coût acceptable, déploiement en cours...");
    
    const contract = await EmotionBet.deploy({
        gasLimit: estimatedGas + 10000n // Petite marge de sécurité
    });
    
    console.log("🔍 Transaction envoyée, hash:", contract.deploymentTransaction().hash);
    
    await contract.waitForDeployment();
    
    const balanceAfter = await ethers.provider.getBalance(deployer.address);
    const actualCost = balanceBefore - balanceAfter;
    
    console.log("\n✅ Déploiement terminé!");
    console.log("📍 Adresse du contrat:", contract.target);
    console.log("💸 Coût réel:", ethers.formatEther(actualCost), "CHZ");
    console.log("🏦 Nouveau solde:", ethers.formatEther(balanceAfter), "CHZ");
    
    // Vérification de cohérence
    const difference = actualCost > estimatedCost ? actualCost - estimatedCost : estimatedCost - actualCost;
    const percentageDiff = (difference * 100n) / estimatedCost;
    
    console.log("\n📊 Analyse de précision:");
    console.log("   Coût estimé:", ethers.formatEther(estimatedCost), "CHZ");
    console.log("   Coût réel:", ethers.formatEther(actualCost), "CHZ");
    console.log("   Différence:", ethers.formatEther(difference), "CHZ");
    console.log("   Écart:", percentageDiff.toString(), "%");
    
    if (percentageDiff > 50n) {
        console.log("⚠️  ATTENTION: Écart important entre estimation et réalité!");
    }
}

main().catch((error) => {
    console.error("❌ Erreur:", error);
    process.exitCode = 1;
});