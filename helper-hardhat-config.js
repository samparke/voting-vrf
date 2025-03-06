const { ethers } = require("hardhat");

const networkConfig = {
  default: {
    name: "hardhat",
  },
  31337: {
    name: "localhost",
    keyHash:
      "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
    voteEntranceFee: ethers.parseEther("0.01"),
    callbackGasLimit: "100000",
  },
  11155111: {
    name: "sepolia",
    subscriptionId:
      "56989853655162213739074828022812217193192306752547285741008570409357173507994",
    keyHash:
      "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
    voteEntranceFee: ethers.parseEther("0.01"),
    callbackGasLimit: "100000",
  },
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATIONS_BLOCK_CONFIRMATIONS = 6;

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATIONS_BLOCK_CONFIRMATIONS,
};
