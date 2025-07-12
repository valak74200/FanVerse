const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Intégration EmotionBet + AttendanceNFT", function () {
  let emotionBet;
  let attendanceNFT;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    // Déployer les contrats
    const EmotionBet = await ethers.getContractFactory("EmotionBet");
    emotionBet = await EmotionBet.deploy();
    
    const AttendanceNFT = await ethers.getContractFactory("AttendanceNFT");
    attendanceNFT = await AttendanceNFT.deploy();
    
    await Promise.all([
      emotionBet.waitForDeployment(),
      attendanceNFT.waitForDeployment()
    ]);
  });

  describe("Scénario utilisateur complet", function () {
    it("Devrait simuler une expérience utilisateur", async function () {
      // 1. Utilisateur place un pari
      await emotionBet.connect(user1).placeBet("PSG va gagner!", { value: ethers.parseEther("10") });
      expect(await emotionBet.getBetCount()).to.equal(1);
      
      // 2. Mint NFT d'attendance
      await attendanceNFT.mintAttendanceNFT(
        user1.address,
        "PSG vs Barcelona",
        "2024-01-15",
        "match",
        1500
      );
      
      const userNFTs = await attendanceNFT.getUserNFTs(user1.address);
      expect(userNFTs.length).to.equal(1);
      
      // 3. Vérifier les soldes
      const contractBalance = await ethers.provider.getBalance(emotionBet.target);
      expect(contractBalance).to.equal(ethers.parseEther("10"));
      
      // 4. Vérifier les NFT
      const nftMetadata = await attendanceNFT.getNFTMetadata(1);
      expect(nftMetadata.eventName).to.equal("PSG vs Barcelona");
      expect(nftMetadata.attendanceCount).to.equal(1500);
    });

    it("Devrait gérer plusieurs utilisateurs", async function () {
      // User1 place des paris
      await emotionBet.connect(user1).placeBet("Mbappé marquera", { value: ethers.parseEther("5") });
      await emotionBet.connect(user1).placeBet("Plus de 2.5 buts", { value: ethers.parseEther("3") });
      
      // User2 place un pari
      await emotionBet.connect(user2).placeBet("Barcelone gagnera", { value: ethers.parseEther("8") });
      
      // Vérifier les paris
      expect(await emotionBet.getBetCount()).to.equal(3);
      
      // Mint NFT pour les deux utilisateurs
      await attendanceNFT.mintAttendanceNFT(user1.address, "Match 1", "2024-01-15", "match", 1200);
      await attendanceNFT.mintAttendanceNFT(user2.address, "Match 1", "2024-01-15", "match", 1200);
      
      // Vérifier les NFT
      const user1NFTs = await attendanceNFT.getUserNFTs(user1.address);
      const user2NFTs = await attendanceNFT.getUserNFTs(user2.address);
      
      expect(user1NFTs.length).to.equal(1);
      expect(user2NFTs.length).to.equal(1);
      expect(user1NFTs[0]).to.equal(1);
      expect(user2NFTs[0]).to.equal(2);
    });

    it("Devrait fermer les paris et conserver les NFT", async function () {
      // Placer des paris
      await emotionBet.connect(user1).placeBet("Test bet", { value: ethers.parseEther("2") });
      
      // Mint NFT
      await attendanceNFT.mintAttendanceNFT(user1.address, "Event", "2024-01-15", "match", 800);
      
      // Fermer les paris
      await emotionBet.endBet();
      expect(await emotionBet.closed()).to.equal(true);
      
      // Vérifier que les paris sont fermés
      await expect(emotionBet.connect(user2).placeBet("Late bet", { value: ethers.parseEther("1") }))
        .to.be.revertedWith("Pari ferme");
      
      // Vérifier que les NFT restent accessibles
      const userNFTs = await attendanceNFT.getUserNFTs(user1.address);
      expect(userNFTs.length).to.equal(1);
      
      const nftData = await attendanceNFT.getNFTMetadata(1);
      expect(nftData.eventName).to.equal("Event");
    });
  });

  describe("Tests de performance", function () {
    it("Devrait gérer de nombreux paris", async function () {
      const numBets = 50;
      
      for (let i = 0; i < numBets; i++) {
        await emotionBet.connect(user1).placeBet(`Pari ${i}`, { 
          value: ethers.parseEther("0.1") 
        });
      }
      
      expect(await emotionBet.getBetCount()).to.equal(numBets);
      
      const allBets = await emotionBet.getAllBets();
      expect(allBets.length).to.equal(numBets);
    });

    it("Devrait gérer de nombreux NFT", async function () {
      const numNFTs = 20;
      
      for (let i = 0; i < numNFTs; i++) {
        await attendanceNFT.mintAttendanceNFT(
          user1.address,
          `Event ${i}`,
          "2024-01-15",
          "match",
          1000 + i
        );
      }
      
      expect(await attendanceNFT.getTotalSupply()).to.equal(numNFTs);
      
      const userNFTs = await attendanceNFT.getUserNFTs(user1.address);
      expect(userNFTs.length).to.equal(numNFTs);
    });
  });
});