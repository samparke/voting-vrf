const { ethers, network, run } = require("hardhat");
require("dotenv").config();

module.exports = async (hre) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying vote contract...");

  const chainId = network.config.chainId;
  const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID;

  if (chainId == 31337) {
    throw new Error(
      "This script is not for local testing, use Sepolia instead"
    );
  }

  const vote = await deploy("Vote", {
    from: deployer,
    log: true,
    args: [SUBSCRIPTION_ID],
    waitConfirmations: 3,
  });

  log(`Vote contract deployed at: ${vote.address}`);

  if (chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    log("Verifying contract on Etherscan...");
    await run("verify:verify", {
      address: vote.address,
      constructorArguments: [SUBSCRIPTION_ID],
    });
  }
  log("Deployment complete");
  log("-----------------------------------------");
};

module.exports.tags = ["all", "vote"];
