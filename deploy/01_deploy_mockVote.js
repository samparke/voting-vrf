const {
  ethers,
  network,
  run,
  deployments,
  getNamedAccounts,
} = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

module.exports = async () => {
  const chainId = network.config.chainId;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  let subscriptionId, vrfCoordinatorV2_5Mock;

  const vrfCoordinatorV2_5MockDeployment = await deployments.get(
    "VRFCoordinatorV2_5Mock"
  );
  vrfCoordinatorV2_5Mock = await ethers.getContractAt(
    "VRFCoordinatorV2_5Mock",
    vrfCoordinatorV2_5MockDeployment.address
  );
  vrfCoordinatorV2_5Address = vrfCoordinatorV2_5MockDeployment.address;

  log("Creating subscription...");
  const tx = await vrfCoordinatorV2_5Mock.createSubscription();
  const txReceipt = await tx.wait();
  subscriptionId = txReceipt.logs[0].args.subId;
  log("Subscription created:", subscriptionId.toString());

  log("Funding subscription...");
  await vrfCoordinatorV2_5Mock.fundSubscription(
    subscriptionId,
    ethers.parseUnits("100", "ether")
  );
  log("Subscription funded");
  log("-------------------------------------------------------");

  const arguments = [
    subscriptionId,
    vrfCoordinatorV2_5MockDeployment.address,
    networkConfig[chainId]["keyHash"],
  ];

  const mockDeploy = await deploy("MockVote", {
    from: deployer,
    log: true,
    args: arguments,
    waitConfirmations: 1,
  });

  log(`Mock deployed at: ${mockDeploy.address}`);
  log("-------------------------------------------------------");

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2_5Mock = await ethers.getContractAt(
      "VRFCoordinatorV2_5Mock",
      vrfCoordinatorV2_5MockDeployment.address
    );
    await vrfCoordinatorV2_5Mock.addConsumer(
      subscriptionId,
      mockDeploy.address
    );
  }
};

module.exports.tags = ["all", "mock"];
