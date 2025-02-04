// deployLock.js

const { ethers } = require("hardhat");

async function main() {
  // Get the signer (the deployer)
  const [deployer] = await ethers.getSigners();

  // Get the latest block's timestamp
  const latestBlock = await ethers.provider.getBlock("latest");
  const currentTimestamp = latestBlock.timestamp;

  // Set the unlock time to 60 seconds in the future (or any delay you prefer)
  const unlockTime = currentTimestamp + 60;

  // Optional: Define an amount to send along with the deployment
  const depositAmount = ethers.parseEther("0.01");

  // Get the Lock contract factory
  const Lock = await ethers.getContractFactory("Lock");

  // Deploy the Lock contract with the future unlock time and an initial deposit
  const lockContract = await Lock.deploy(unlockTime, { value: depositAmount });
  await lockContract.waitForDeployment(); // For Hardhat Ethers v6

  console.log("Lock Contract deployed at:", lockContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
