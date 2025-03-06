const { ethers, deployments } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Fetch VRF contract
  const vrfCoordinatorV2_5MockDeployment = await deployments.get(
    "VRFCoordinatorV2_5Mock"
  );
  const vrfCoordinatorV2_5Mock = await ethers.getContractAt(
    "VRFCoordinatorV2_5Mock",
    vrfCoordinatorV2_5MockDeployment.address
  );
  const vrfCoordinatorV2_5Address = vrfCoordinatorV2_5MockDeployment.address;

  console.log("VRF contract connected:", vrfCoordinatorV2_5Address);

  // getting mockVote contract
  const mockDeployment = await deployments.get("MockVote");
  const mockContract = await ethers.getContractAt(
    "MockVote",
    mockDeployment.address
  );

  console.log("MockVote contract connected:", mockDeployment.address);

  // adding consumer
  const tx = await vrfCoordinatorV2_5Mock.addConsumer(
    "39209009922664085120467656896779257046550020200442394068324625209245416488231",
    mockDeployment.address
  );
  await tx.wait();
  console.log("Consumer added:", tx.hash);

  // request for random words
  console.log("Requesting random words...");
  const txRequest = await mockContract.requestRandomWords();
  await txRequest.wait();

  const requestId = await mockContract.s_requestId();
  console.log("Request ID:", requestId.toString());

  // fulling random words
  console.log("Fulfilling random words...");
  const txFulfill = await vrfCoordinatorV2_5Mock.fulfillRandomWords(
    requestId,
    mockDeployment.address
  );
  await txFulfill.wait();

  const randomWord = await mockContract.s_randomWords(0);
  console.log("Random Word:", randomWord.toString());

  // user vote
  console.log("User voting for candidate 1");
  const userVoteTx = await mockContract.connect(deployer).vote(0);
  await userVoteTx.wait();

  await new Promise(async (resolve, reject) => {
    mockContract.once("Winner", (userCandidateId, winnerId, hasWon) => {
      console.log(`🏆 Winner Event Fired!`);
      console.log(`User Vote: ${userCandidateId.toString()}`);
      console.log(`Random Winner ID: ${winnerId.toString()}`);
      console.log(`Did the user win? ${hasWon ? "yes" : "no "}`);
      resolve();
    });

    const txHasUserWon = await mockContract.connect(deployer).hasUserWon();
    await txHasUserWon.wait();
  });
}

// Execute script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
