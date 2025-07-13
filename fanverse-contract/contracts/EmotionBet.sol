// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EmotionBet {
    struct Bet {
        address user;
        string description;
        uint96 amount;
        bool claimed; // ✅ NOUVEAU: pour éviter les doubles retraits
    }

    address public immutable owner;
    Bet[] public bets;
    bool public closed;
    bool public resolved; // ✅ NOUVEAU: pari résolu
    string public winningDescription; // ✅ NOUVEAU: description gagnante
    uint256 public totalPool; // ✅ NOUVEAU: total des mises
    uint256 public winnersPool; // ✅ NOUVEAU: total des mises gagnantes

    event BetPlaced(address indexed user, string description, uint96 amount);
    event BetResolved(string winningDescription, uint256 totalWinners, uint256 totalPool);
    event WinningsClaimed(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function placeBet(string calldata description) external payable {
        require(!closed, "Pari ferme");
        require(msg.value > 0, "Mise requise");
        require(msg.value <= type(uint96).max, "Mise trop elevee");

        bets.push(Bet({
            user: msg.sender,
            description: description,
            amount: uint96(msg.value),
            claimed: false
        }));

        totalPool += msg.value; // ✅ NOUVEAU: comptabiliser le total
        
        emit BetPlaced(msg.sender, description, uint96(msg.value));
    }

    function endBet() external {
        require(msg.sender == owner, "Seul l'owner peut cloturer");
        closed = true;
    }

    // ✅ NOUVELLE FONCTION: Résoudre le pari avec une description gagnante
    function resolveBet(string calldata _winningDescription) external {
        require(msg.sender == owner, "Seul l'owner peut resoudre");
        require(closed, "Pari doit etre ferme");
        require(!resolved, "Pari deja resolu");

        winningDescription = _winningDescription;
        resolved = true;

        // Calculer le total des mises gagnantes
        for (uint256 i = 0; i < bets.length; i++) {
            if (keccak256(abi.encodePacked(bets[i].description)) == 
                keccak256(abi.encodePacked(_winningDescription))) {
                winnersPool += bets[i].amount;
            }
        }

        emit BetResolved(_winningDescription, winnersPool, totalPool);
    }

    // ✅ NOUVELLE FONCTION: Réclamer les gains
    function claimWinnings() external {
        require(resolved, "Pari non resolu");
        require(winnersPool > 0, "Aucun gagnant");

        uint256 totalWinnings = 0;
        
        for (uint256 i = 0; i < bets.length; i++) {
            if (bets[i].user == msg.sender && 
                !bets[i].claimed &&
                keccak256(abi.encodePacked(bets[i].description)) == 
                keccak256(abi.encodePacked(winningDescription))) {
                
                bets[i].claimed = true;
                
                // Calcul des gains: (mise individuelle / total des mises gagnantes) * total du pool
                uint256 winnings = (uint256(bets[i].amount) * totalPool) / winnersPool;
                totalWinnings += winnings;
            }
        }

        require(totalWinnings > 0, "Aucun gain a reclamer");
        
        payable(msg.sender).transfer(totalWinnings);
        emit WinningsClaimed(msg.sender, totalWinnings);
    }

    // ✅ NOUVELLE FONCTION: Vérifier les gains potentiels
    function checkWinnings(address user) external view returns (uint256) {
        if (!resolved || winnersPool == 0) return 0;

        uint256 totalWinnings = 0;
        
        for (uint256 i = 0; i < bets.length; i++) {
            if (bets[i].user == user && 
                !bets[i].claimed &&
                keccak256(abi.encodePacked(bets[i].description)) == 
                keccak256(abi.encodePacked(winningDescription))) {
                
                uint256 winnings = (uint256(bets[i].amount) * totalPool) / winnersPool;
                totalWinnings += winnings;
            }
        }

        return totalWinnings;
    }

    // ✅ NOUVELLE FONCTION: Obtenir les statistiques
    function getStats() external view returns (
        uint256 _totalPool,
        uint256 _winnersPool,
        uint256 _totalBets,
        bool _resolved,
        string memory _winningDescription
    ) {
        return (totalPool, winnersPool, bets.length, resolved, winningDescription);
    }

    // Fonctions existantes inchangées
    function getAllBets() external view returns (Bet[] memory) {
        return bets;
    }

    function getBetCount() external view returns (uint256) {
        return bets.length;
    }

    // ✅ NOUVELLE FONCTION: Retrait d'urgence pour l'owner
    function emergencyWithdraw() external {
        require(msg.sender == owner, "Seul l'owner");
        require(block.timestamp > block.timestamp + 30 days, "Attendre 30 jours");
        
        payable(owner).transfer(address(this).balance);
    }
}