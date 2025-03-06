const {
  ethers,
  network,
  run,
  deployments,
  getNamedAccounts,
} = require("hardhat");

module.exports = async () => {
  const chainId = network.config.chainId;
  const _BASEFEE = "250000000000000000";
  const _GASPRICELINK = "1000000000";
  const _WEIPERUNITLINK = "7241540074737172";

  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying mock contract...");

  if (chainId == 31337) {
    const mockDeploy = await deploy("VRFCoordinatorV2_5Mock", {
      from: deployer,
      log: true,
      args: [_BASEFEE, _GASPRICELINK, _WEIPERUNITLINK],
      waitConfirmations: 1,
    });

    log(`VRF Mock deployed at: ${mockDeploy.address}`);
  }
};

module.exports.tags = ["all", "mock"];
