// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EmotionBet {
    struct Bet {
        address user;
        string description;
        uint96 amount; // uint96 au lieu de uint256 pour économiser du gas
    }

    address public immutable owner; // immutable économise du gas
    Bet[] public bets;
    bool public closed;

    constructor() {
        owner = msg.sender;
        // closed est false par défaut, pas besoin de l'assigner
    }

    function placeBet(string calldata description) external payable {
        require(!closed, "Pari ferme");
        require(msg.value > 0, "Mise requise");
        require(msg.value <= type(uint96).max, "Mise trop elevee");

        bets.push(Bet({
            user: msg.sender,
            description: description,
            amount: uint96(msg.value)
        }));
    }

    function endBet() external {
        require(msg.sender == owner, "Seul l'owner peut cloturer");
        closed = true;
    }

    function getAllBets() external view returns (Bet[] memory) {
        return bets;
    }

    function getBetCount() external view returns (uint256) {
        return bets.length;
    }
}
