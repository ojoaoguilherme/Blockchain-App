// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.3;
import "hardhat/console.sol";

contract WavePortal{
   uint256 totalWaves;
   
   struct Wave {
      address waver;
      string message;
      uint256 timestamp;
   }
   struct Winner{
      address winner;
      string message;
   }

   Winner[] winners;
   Wave[] waves;  
   
   event NewWave(address indexed from, uint256 timestamp, string message);
   event PrizeWinner(address indexed winner, string message);

   uint256 private seed;
   mapping(address=>uint256) lastWavedAt;

   constructor() payable {
      console.log("Im alive!!!"); 
      
      seed = (block.difficulty + block.difficulty) % 100;
   }

   function wave(string memory _message) public{
      require(lastWavedAt[msg.sender] + 15 seconds < block.timestamp, "Espere 15 segundos");
      lastWavedAt[msg.sender] = block.timestamp;
      totalWaves += 1;
      waves.push(Wave(msg.sender, _message, block.timestamp));
      seed = (block.difficulty + block.timestamp) % 100;
      emit NewWave(msg.sender, block.timestamp, _message);

      if (seed <= 50){
         uint256 prizeAmount = 0.0001 ether;
         string memory messageWinner = "Parabens voce ganhou 0.0001 ETH";
         require(prizeAmount <= address(this).balance, "Voce ganhou porem infelizmente nao temos mais premios");
         console.log("%s voce ganhou %f", msg.sender, prizeAmount);
         winners.push(Winner(msg.sender, messageWinner));
         emit PrizeWinner(msg.sender, messageWinner);
         (bool success,) = (msg.sender).call{value: prizeAmount}("");
         require(success, "Erro ao mandar dinheiro");

      }
   }

   function getAllWaves() public view returns (Wave[] memory){
      return waves;
   }

   function getAllWinners() public view returns (Winner[] memory){
      return winners;
   }

   function getTotalWaves() public view returns (uint256){
      console.log("We have %d total waves!", totalWaves);
      return totalWaves;
   }
}