require("dotenv").config();
const { ethers } = require("hardhat");
const readline = require('readline');

// Fonction pour demander confirmation
function askConfirmation(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
    });
}

async function main() {
    console.log("🎯 Déploiement avec confirmation manuelle...\n");
    
    const [deployer] = await ethers.getSigners();
    console.log("📍 Déploiement depuis:", deployer.address);
    
    const balanceBefore = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Solde actuel:", ethers.formatEther(balanceBefore), "CHZ");
    
    // ÉTAPE 1: Estimation précise
    console.log("\n🔍 Estimation des coûts...");
    const feeData = await ethers.provider.getFeeData();
    const EmotionBet = await ethers.getContractFactory("EmotionBet");
    const deployTransaction = EmotionBet.getDeployTransaction();
    const estimatedGas = await deployer.estimateGas(deployTransaction);
    const estimatedCost = estimatedGas * feeData.gasPrice;
    
    // ÉTAPE 2: Affichage détaillé
    console.log("\n📋 Détails du déploiement:");
    console.log("   Gas estimé:", estimatedGas.toString());
    console.log("   Prix du gas:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
    console.log("   💸 Coût estimé:", ethers.formatEther(estimatedCost), "CHZ");
    console.log("   🏦 Solde après déploiement:", ethers.formatEther(balanceBefore - estimatedCost), "CHZ");
    
    // ÉTAPE 3: Avertissements
    const costInUSD = parseFloat(ethers.formatEther(estimatedCost)) * 0.1; // Estimation 1 CHZ = $0.1
    console.log("   💵 Coût estimé en USD:", costInUSD.toFixed(4), "$");
    
    if (estimatedCost > ethers.parseEther("2.0")) {
        console.log("\n⚠️  ATTENTION: Coût très élevé (> 2 CHZ)!");
    } else if (estimatedCost > ethers.parseEther("1.0")) {
        console.log("\n⚠️  ATTENTION: Coût élevé (> 1 CHZ)");
    } else {
        console.log("\n✅ Coût acceptable");
    }
    
    // ÉTAPE 4: Demander confirmation
    console.log("\n" + "=".repeat(50));
    const confirmed = await askConfirmation("🤔 Voulez-vous continuer le déploiement ? (y/n): ");
    
    if (!confirmed) {
        console.log("❌ Déploiement annulé par l'utilisateur");
        return;
    }
    
    // ÉTAPE 5: Déploiement
    console.log("\n✅ Déploiement confirmé, lancement...");
    
    const contract = await EmotionBet.deploy({
        gasLimit: estimatedGas + 10000n // Petite marge de sécurité
    });
    
    console.log("🔍 Transaction envoyée, hash:", contract.deploymentTransaction().hash);
    console.log("⏳ Attente de confirmation...");
    
    await contract.waitForDeployment();
    
    // ÉTAPE 6: Résultats
    const balanceAfter = await ethers.provider.getBalance(deployer.address);
    const actualCost = balanceBefore - balanceAfter;
    
    console.log("\n" + "=".repeat(50));
    console.log("🎉 DÉPLOIEMENT RÉUSSI!");
    console.log("📍 Adresse du contrat:", contract.target);
    console.log("💸 Coût réel:", ethers.formatEther(actualCost), "CHZ");
    console.log("🏦 Nouveau solde:", ethers.formatEther(balanceAfter), "CHZ");
    
    // ÉTAPE 7: Analyse de précision
    const difference = actualCost > estimatedCost ? actualCost - estimatedCost : estimatedCost - actualCost;
    const accuracy = 100 - Number((difference * 100n) / estimatedCost);
    
    console.log("\n📊 Analyse de l'estimation:");
    console.log("   Coût estimé:", ethers.formatEther(estimatedCost), "CHZ");
    console.log("   Coût réel:", ethers.formatEther(actualCost), "CHZ");
    console.log("   Précision:", accuracy.toFixed(1), "%");
    
    if (accuracy < 80) {
        console.log("⚠️  Estimation peu précise - vérifiez votre configuration réseau");
    } else if (accuracy > 95) {
        console.log("✅ Estimation très précise!");
    }
    
    console.log("\n🌐 Explorer le contrat:");
    console.log("   Spicy Explorer:", `https://spicy-explorer.chiliz.com/address/${contract.target}`);
}

main().catch((error) => {
    console.error("❌ Erreur:", error);
    process.exitCode = 1;
});