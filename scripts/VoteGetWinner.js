const { ethers, deployments } = require("hardhat");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const voteContractJson = require("../artifacts/contracts/Vote.sol/Vote.json");
  const voteContractAbi = voteContractJson.abi;
  const voteContractAddress = "0x86f7586d177cbdc984f746ee9dd88138abc9c120";
  const vote = new ethers.Contract(
    voteContractAddress,
    voteContractAbi,
    wallet
  );
  console.log("Connected to vote contract:", voteContractAddress);

  // requesting a random number
  console.log("Requesting randomness");
  const tx = await vote.requestRandomWords();
  await tx.wait();
  console.log("Randomness requested! Tx Hash:", tx.hash);

  console.log("Waiting for randomness fulfillment...");

  // fetch request Id
  const requestId = await vote.lastRequestId();
  console.log("Last request ID:", requestId.toString());

  // fetch result
  const status = await vote.getRequestStatus(requestId);
  if (status.fulfilled) {
    console.log("Random number:", status.randomWords[0].toString());
  } else {
    console.log("Random number not fullfiled yet, try again soon");
  }

  const randomNumber = await status.randomWords[0];
  const winnerIndex = await (randomNumber % 3);
  const winner = await vote.candidates[winnerIndex];
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
