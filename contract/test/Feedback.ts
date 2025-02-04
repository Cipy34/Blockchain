import { expect } from "chai";
const { ethers } = require("hardhat");

describe("FeedBack Contract", function () {
    it("should add a feedback", async function () {
        const [owner, account1, account2] = await ethers.getSigners();
        
        // Deploy the contract
        const Market = await ethers.getContractFactory("Market");
        const marketContract = await Market.deploy(ethers.parseEther("0.01"), "Initial Product", "Initial Description");

        const FeedBack = await ethers.getContractFactory("FeedBack");
        const feedbackContract = await FeedBack.deploy(owner, 0, 3, "Comment");
        await feedbackContract.connect(account1).addFeedback(0, 4, "Comment2")

        const feedback = await feedbackContract.reviews(1);

        expect(feedback.productId == 0);
        expect(feedback.rating == 4);
        expect(feedback.comment == "Comment2");
    });
});
