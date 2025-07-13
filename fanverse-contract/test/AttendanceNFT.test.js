const { expect } = require("chai");


describe("AttendanceNFT", function () {
  let attendanceNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const AttendanceNFT = await ethers.getContractFactory("AttendanceNFT");
    attendanceNFT = await AttendanceNFT.deploy();
    await attendanceNFT.waitForDeployment();
  });

  describe("Déploiement", function () {
    it("Devrait définir le bon owner", async function () {
      expect(await attendanceNFT.owner()).to.equal(owner.address);
    });

    it("Devrait commencer avec nextTokenId = 1", async function () {
      expect(await attendanceNFT.nextTokenId()).to.equal(1);
    });

    it("Devrait avoir 0 NFT au départ", async function () {
      expect(await attendanceNFT.getTotalSupply()).to.equal(0);
    });
  });

  describe("Mint NFT Common", function () {
    it("Devrait permettre à l'owner de mint un NFT Common", async function () {
      const eventName = "PSG vs Barcelona";
      const eventDate = "2024-01-15";
      const eventType = "match";
      const attendanceCount = 1000;

      await expect(attendanceNFT.mintCommonNFT(
        addr1.address,
        eventName,
        eventDate,
        eventType,
        attendanceCount
      ))
        .to.emit(attendanceNFT, "NFTMinted")
        .withArgs(addr1.address, 1, "Common");

      expect(await attendanceNFT.getTotalSupply()).to.equal(1);
      expect(await attendanceNFT.tokenOwner(1)).to.equal(addr1.address);
      
      const metadata = await attendanceNFT.getNFTMetadata(1);
      expect(metadata.eventName).to.equal(eventName);
      expect(metadata.eventDate).to.equal(eventDate);
      expect(metadata.eventType).to.equal(eventType);
      expect(metadata.rarity).to.equal("Common");
      expect(metadata.attendanceCount).to.equal(attendanceCount);
    });

    it("Devrait rejeter le mint par non-owner", async function () {
      await expect(attendanceNFT.connect(addr1).mintCommonNFT(
        addr2.address,
        "Test",
        "2024-01-01",
        "test",
        100
      ))
        .to.be.revertedWith("Seul l'owner peut mint");
    });
  });

  describe("Mint NFT Rare", function () {
    it("Devrait permettre à l'owner de mint un NFT Rare", async function () {
      await expect(attendanceNFT.mintRareNFT(
        addr1.address,
        "PSG vs Real Madrid",
        "2024-01-20",
        "champions-league",
        2500
      ))
        .to.emit(attendanceNFT, "NFTMinted")
        .withArgs(addr1.address, 1, "Rare");

      const metadata = await attendanceNFT.getNFTMetadata(1);
      expect(metadata.rarity).to.equal("Rare");
      expect(metadata.eventName).to.equal("PSG vs Real Madrid");
    });
  });

  describe("Mint NFT Epic", function () {
    it("Devrait permettre à l'owner de mint un NFT Epic", async function () {
      await expect(attendanceNFT.mintEpicNFT(
        addr1.address,
        "Champions League Final",
        "2024-05-30",
        "final",
        5000
      ))
        .to.emit(attendanceNFT, "NFTMinted")
        .withArgs(addr1.address, 1, "Epic");

      const metadata = await attendanceNFT.getNFTMetadata(1);
      expect(metadata.rarity).to.equal("Epic");
      expect(metadata.eventName).to.equal("Champions League Final");
    });
  });

  describe("Mint NFT Legendary", function () {
    it("Devrait permettre à l'owner de mint un NFT Legendary", async function () {
      await expect(attendanceNFT.mintLegendaryNFT(
        addr1.address,
        "Clasico Historic",
        "2024-03-10",
        "clasico",
        8000
      ))
        .to.emit(attendanceNFT, "NFTMinted")
        .withArgs(addr1.address, 1, "Legendary");

      const metadata = await attendanceNFT.getNFTMetadata(1);
      expect(metadata.rarity).to.equal("Legendary");
      expect(metadata.eventName).to.equal("Clasico Historic");
    });
  });

  describe("Gestion des NFT", function () {
    beforeEach(async function () {
      // Mint plusieurs NFT de différentes raretés
      await attendanceNFT.mintCommonNFT(addr1.address, "Event 1", "2024-01-01", "match", 100);
      await attendanceNFT.mintRareNFT(addr1.address, "Event 2", "2024-01-02", "training", 50);
      await attendanceNFT.mintEpicNFT(addr2.address, "Event 3", "2024-01-03", "celebration", 200);
    });

    it("Devrait retourner les NFT d'un utilisateur", async function () {
      const addr1NFTs = await attendanceNFT.getUserNFTs(addr1.address);
      expect(addr1NFTs.length).to.equal(2);
      expect(addr1NFTs[0]).to.equal(1);
      expect(addr1NFTs[1]).to.equal(2);
      
      const addr2NFTs = await attendanceNFT.getUserNFTs(addr2.address);
      expect(addr2NFTs.length).to.equal(1);
      expect(addr2NFTs[0]).to.equal(3);
    });

    it("Devrait retourner les métadonnées correctes", async function () {
      const metadata1 = await attendanceNFT.getNFTMetadata(1);
      expect(metadata1.eventName).to.equal("Event 1");
      expect(metadata1.rarity).to.equal("Common");
      
      const metadata2 = await attendanceNFT.getNFTMetadata(2);
      expect(metadata2.eventName).to.equal("Event 2");
      expect(metadata2.rarity).to.equal("Rare");
      
      const metadata3 = await attendanceNFT.getNFTMetadata(3);
      expect(metadata3.eventName).to.equal("Event 3");
      expect(metadata3.rarity).to.equal("Epic");
    });

    it("Devrait rejeter la lecture de NFT inexistant", async function () {
      await expect(attendanceNFT.getNFTMetadata(999))
        .to.be.revertedWith("NFT inexistant");
    });
  });

  describe("Génération d'URL d'image", function () {
    it("Devrait générer des URLs différentes pour chaque rareté", async function () {
      await attendanceNFT.mintCommonNFT(addr1.address, "Test Event", "2024-01-01", "match", 1000);
      await attendanceNFT.mintRareNFT(addr1.address, "Test Event", "2024-01-01", "match", 1000);
      await attendanceNFT.mintEpicNFT(addr1.address, "Test Event", "2024-01-01", "match", 1000);
      await attendanceNFT.mintLegendaryNFT(addr1.address, "Test Event", "2024-01-01", "match", 1000);
      
      const commonNFT = await attendanceNFT.getNFTMetadata(1);
      const rareNFT = await attendanceNFT.getNFTMetadata(2);
      const epicNFT = await attendanceNFT.getNFTMetadata(3);
      const legendaryNFT = await attendanceNFT.getNFTMetadata(4);
      
      expect(commonNFT.imageUrl).to.contain("Common");
      expect(rareNFT.imageUrl).to.contain("Rare");
      expect(epicNFT.imageUrl).to.contain("Epic");
      expect(legendaryNFT.imageUrl).to.contain("Legendary");
      
      // Toutes les URLs doivent être différentes
      const urls = [commonNFT.imageUrl, rareNFT.imageUrl, epicNFT.imageUrl, legendaryNFT.imageUrl];
      const uniqueUrls = [...new Set(urls)];
      expect(uniqueUrls.length).to.equal(4);
    });

    it("Devrait contenir l'URL de base FanVerse", async function () {
      await attendanceNFT.mintCommonNFT(addr1.address, "Test", "2024-01-01", "match", 1000);
      
      const metadata = await attendanceNFT.getNFTMetadata(1);
      expect(metadata.imageUrl).to.contain("https://fanverse.io/nft/");
    });
  });

  describe("Incrémentation des tokens", function () {
    it("Devrait incrémenter nextTokenId pour chaque mint", async function () {
      expect(await attendanceNFT.nextTokenId()).to.equal(1);
      
      await attendanceNFT.mintCommonNFT(addr1.address, "Event 1", "2024-01-01", "match", 100);
      expect(await attendanceNFT.nextTokenId()).to.equal(2);
      
      await attendanceNFT.mintRareNFT(addr1.address, "Event 2", "2024-01-02", "match", 200);
      expect(await attendanceNFT.nextTokenId()).to.equal(3);
      
      await attendanceNFT.mintEpicNFT(addr1.address, "Event 3", "2024-01-03", "match", 300);
      expect(await attendanceNFT.nextTokenId()).to.equal(4);
      
      await attendanceNFT.mintLegendaryNFT(addr1.address, "Event 4", "2024-01-04", "match", 400);
      expect(await attendanceNFT.nextTokenId()).to.equal(5);
    });

    it("Devrait mettre à jour getTotalSupply correctement", async function () {
      expect(await attendanceNFT.getTotalSupply()).to.equal(0);
      
      await attendanceNFT.mintCommonNFT(addr1.address, "Event 1", "2024-01-01", "match", 100);
      expect(await attendanceNFT.getTotalSupply()).to.equal(1);
      
      await attendanceNFT.mintRareNFT(addr2.address, "Event 2", "2024-01-02", "match", 200);
      expect(await attendanceNFT.getTotalSupply()).to.equal(2);
      
      await attendanceNFT.mintEpicNFT(addr1.address, "Event 3", "2024-01-03", "match", 300);
      expect(await attendanceNFT.getTotalSupply()).to.equal(3);
    });
  });

  describe("Tests de sécurité", function () {
    it("Devrait rejeter tous les mints par non-owner", async function () {
      const eventData = [addr2.address, "Test", "2024-01-01", "test", 100];
      
      await expect(attendanceNFT.connect(addr1).mintCommonNFT(...eventData))
        .to.be.revertedWith("Seul l'owner peut mint");
        
      await expect(attendanceNFT.connect(addr1).mintRareNFT(...eventData))
        .to.be.revertedWith("Seul l'owner peut mint");
        
      await expect(attendanceNFT.connect(addr1).mintEpicNFT(...eventData))
        .to.be.revertedWith("Seul l'owner peut mint");
        
      await expect(attendanceNFT.connect(addr1).mintLegendaryNFT(...eventData))
        .to.be.revertedWith("Seul l'owner peut mint");
    });

    it("Devrait gérer correctement les timestamps", async function () {
      await attendanceNFT.mintCommonNFT(addr1.address, "Event", "2024-01-01", "match", 100);
      
      const metadata = await attendanceNFT.getNFTMetadata(1);
      expect(metadata.timestamp).to.be.greaterThan(0);
    });
  });
});

const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Test du contrat AttendanceNFT déployé...\n");
  
  // Remplacez par votre adresse de contrat déployé
  const ATTENDANCE_NFT_ADDRESS = "VOTRE_ADRESSE_CONTRAT_ICI";
  
  const [owner] = await ethers.getSigners();
  console.log("👤 Testeur:", owner.address);
  
  try {
    // Se connecter au contrat déployé
    const attendanceNFT = await ethers.getContractAt("AttendanceNFT", ATTENDANCE_NFT_ADDRESS);
    
    console.log("🔍 Informations du contrat:");
    console.log("   Owner:", await attendanceNFT.owner());
    console.log("   Total Supply:", await attendanceNFT.getTotalSupply());
    console.log("   Next Token ID:", await attendanceNFT.nextTokenId());
    
    // Test de mint (si vous êtes le owner)
    console.log("\n🎨 Test de mint NFT...");
    
    const mintTx = await attendanceNFT.mintAttendanceNFT(
      owner.address,
      "Test Event",
      "2024-01-15",
      "match",
      1500
    );
    
    console.log("📄 Transaction hash:", mintTx.hash);
    await mintTx.wait();
    
    console.log("✅ NFT minté avec succès!");
    
    // Vérifier les NFT de l'utilisateur
    const userNFTs = await attendanceNFT.getUserNFTs(owner.address);
    console.log("🎫 NFTs possédés:", userNFTs.length);
    
    if (userNFTs.length > 0) {
      const latestNFT = userNFTs[userNFTs.length - 1];
      const metadata = await attendanceNFT.getNFTMetadata(latestNFT);
      
      console.log("\n📋 Métadonnées du dernier NFT:");
      console.log("   Event Name:", metadata.eventName);
      console.log("   Event Date:", metadata.eventDate);
      console.log("   Event Type:", metadata.eventType);
      console.log("   Rarity:", metadata.rarity);
      console.log("   Attendance:", metadata.attendanceCount);
      console.log("   Image URL:", metadata.imageUrl);
    }
    
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    
    if (error.message.includes("Seul l'owner peut mint")) {
      console.log("💡 Vous n'êtes pas le owner du contrat");
    }
  }
}

main().catch(console.error);