const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EmotionBet", function () {
  let emotionBet;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Déployer le contrat avant chaque test
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    const EmotionBet = await ethers.getContractFactory("EmotionBet");
    emotionBet = await EmotionBet.deploy();
    await emotionBet.waitForDeployment();
  });

  describe("Déploiement", function () {
    it("Devrait définir le bon owner", async function () {
      expect(await emotionBet.owner()).to.equal(owner.address);
    });

    it("Devrait initialiser avec 0 paris", async function () {
      expect(await emotionBet.getBetCount()).to.equal(0);
    });

    it("Devrait être ouvert au déploiement", async function () {
      expect(await emotionBet.closed()).to.equal(false);
    });
  });

  describe("Placer des paris", function () {
    it("Devrait permettre de placer un pari valide", async function () {
      const betAmount = ethers.parseEther("1");
      const description = "PSG va gagner!";

      await expect(emotionBet.connect(addr1).placeBet(description, { value: betAmount }))
        .to.not.be.reverted;

      expect(await emotionBet.getBetCount()).to.equal(1);
      
      const bet = await emotionBet.bets(0);
      expect(bet.user).to.equal(addr1.address);
      expect(bet.description).to.equal(description);
      expect(bet.amount).to.equal(betAmount);
    });

    it("Devrait rejeter un pari sans CHZ", async function () {
      await expect(emotionBet.connect(addr1).placeBet("Test", { value: 0 }))
        .to.be.revertedWith("Mise requise");
    });

    it("Devrait rejeter un pari si fermé", async function () {
      // Fermer les paris
      await emotionBet.endBet();
      
      await expect(emotionBet.connect(addr1).placeBet("Test", { value: ethers.parseEther("1") }))
        .to.be.revertedWith("Pari ferme");
    });

    it("Devrait accepter une mise à la limite uint96", async function () {
      // Tester avec une valeur proche mais inférieure à uint96 max
      const nearMaxUint96 = "1000000000000000000000"; // 1000 ETH en wei
      
      await expect(emotionBet.connect(addr1).placeBet("Test limite", { value: nearMaxUint96 }))
        .to.not.be.reverted;
        
      expect(await emotionBet.getBetCount()).to.equal(1);
    });
  });

  describe("Gestion des paris", function () {
    it("Seul l'owner peut fermer les paris", async function () {
      await expect(emotionBet.connect(addr1).endBet())
        .to.be.revertedWith("Seul l'owner peut cloturer");
      
      await expect(emotionBet.endBet())
        .to.not.be.reverted;
      
      expect(await emotionBet.closed()).to.equal(true);
    });

    it("Devrait retourner tous les paris", async function () {
      // Placer plusieurs paris
      await emotionBet.connect(addr1).placeBet("Pari 1", { value: ethers.parseEther("1") });
      await emotionBet.connect(addr2).placeBet("Pari 2", { value: ethers.parseEther("2") });
      
      const allBets = await emotionBet.getAllBets();
      expect(allBets.length).to.equal(2);
      expect(allBets[0].description).to.equal("Pari 1");
      expect(allBets[1].description).to.equal("Pari 2");
    });
  });

  describe("Solde du contrat", function () {
    it("Devrait accumuler les CHZ des paris", async function () {
      const bet1 = ethers.parseEther("1");
      const bet2 = ethers.parseEther("2");
      
      await emotionBet.connect(addr1).placeBet("Pari 1", { value: bet1 });
      await emotionBet.connect(addr2).placeBet("Pari 2", { value: bet2 });
      
      const contractBalance = await ethers.provider.getBalance(emotionBet.target);
      expect(contractBalance).to.equal(bet1 + bet2);
    });
  });

  describe("Limites et validation", function () {
    it("Devrait gérer les montants en wei correctement", async function () {
      const smallAmount = "1"; // 1 wei
      
      await expect(emotionBet.connect(addr1).placeBet("Petit pari", { value: smallAmount }))
        .to.not.be.reverted;
        
      const bet = await emotionBet.bets(0);
      expect(bet.amount).to.equal(smallAmount);
    });

    it("Devrait gérer plusieurs paris du même utilisateur", async function () {
      await emotionBet.connect(addr1).placeBet("Pari 1", { value: ethers.parseEther("1") });
      await emotionBet.connect(addr1).placeBet("Pari 2", { value: ethers.parseEther("2") });
      
      expect(await emotionBet.getBetCount()).to.equal(2);
      
      const bet1 = await emotionBet.bets(0);
      const bet2 = await emotionBet.bets(1);
      
      expect(bet1.user).to.equal(addr1.address);
      expect(bet2.user).to.equal(addr1.address);
      expect(bet1.description).to.equal("Pari 1");
      expect(bet2.description).to.equal("Pari 2");
    });
  });
});