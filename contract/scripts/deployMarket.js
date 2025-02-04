require("@nomicfoundation/hardhat-ethers");
const { ethers } = require("hardhat");

async function main() {
  // Get signers (owner, account1, account2)
  const [owner, account1, account2] = await ethers.getSigners();

  // Define constructor parameters for Market
  const price = ethers.parseEther("0.01"); // Price must be greater than 0
  const name = "Initial Product";
  const description = "Initial Description";

  // Deploy Market with the correct constructor parameters
  const Market = await ethers.getContractFactory("Market");
  const MarketContract = await Market.deploy(price, name, description);
  await MarketContract.waitForDeployment(); // For Hardhat Ethers v6; use deployed() for v5

  console.log("Market deployed at:", MarketContract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
