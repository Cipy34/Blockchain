// scripts/deploy.js

const { ethers } = require("hardhat");

async function main() {
  // Get signers (owner, account1, account2)
  const [owner, account1, account2] = await ethers.getSigners();

  // -------------------------------------------------
  // Deploy the Market contract
  // -------------------------------------------------
  // Define constructor parameters for Market:
  // Price must be greater than 0, and we supply a product name and description.
  const price = ethers.parseEther("0.01");
  const name = "Initial Product";
  const description = "Initial Description";

  // Get the Market contract factory and deploy it
  const Market = await ethers.getContractFactory("Market");
  const marketContract = await Market.deploy(price, name, description);
  await marketContract.waitForDeployment(); // For Hardhat Ethers v6
  console.log("Market deployed at:", marketContract.target);

  // -------------------------------------------------
  // Deploy the Lock contract
  // -------------------------------------------------
  // Get the latest block's timestamp
  const latestBlock = await ethers.provider.getBlock("latest");
  const currentTimestamp = latestBlock.timestamp;

  // Set the unlock time to 60 seconds in the future (or any delay you prefer)
  const unlockTime = currentTimestamp + 60;

  // Optional: Define an amount to send along with the deployment
  const depositAmount = ethers.parseEther("0.01");

  // Get the Lock contract factory and deploy it with the future unlock time and initial deposit
  const Lock = await ethers.getContractFactory("Lock");
  const lockContract = await Lock.deploy(unlockTime, { value: depositAmount });
  await lockContract.waitForDeployment();
  console.log("Lock Contract deployed at:", lockContract.target);

  // -------------------------------------------------
  // Deploy the FeedBack contract
  // -------------------------------------------------
  // FeedBack's constructor parameters are:
  //   - marketAddress: address of the deployed Market contract
  //   - productId_: the product ID to which the initial feedback relates (assume 0)
  //   - rating_: an initial rating (e.g., 3)
  //   - comment_: an initial comment (e.g., "Initial Feedback")
  const initialProductId = 0; // Assuming the product we deployed in Market has ID 0.
  const initialRating = 3;
  const initialComment = "Initial Feedback";

  const FeedBack = await ethers.getContractFactory("FeedBack");
  const feedbackContract = await FeedBack.deploy(
    marketContract.target, 
    initialProductId, 
    initialRating, 
    initialComment
  );
  await feedbackContract.waitForDeployment();
  console.log("FeedBack Contract deployed at:", feedbackContract.target);

  // -------------------------------------------------
  // Add additional feedback using the addFeedback function
  // -------------------------------------------------
  // Use a different account (account1) to add feedback so that it isn’t the product owner.
  const additionalRating = 4;
  const additionalComment = "Additional Feedback from account1";
  const tx = await feedbackContract.connect(account1).addFeedback(
    initialProductId, 
    additionalRating, 
    additionalComment
  );
  await tx.wait();
  console.log("Additional feedback added by account1.");

  // Optionally, retrieve and log the additional feedback (index 1, since constructor stored index 0)
  const review = await feedbackContract.reviews(1);
  console.log("Feedback review at index 1:", review);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
