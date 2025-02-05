import { expect } from "chai";
const { ethers } = require("hardhat");

describe("FeedBack Contract", function () {
    it("should add a feedback", async function () {
        const [owner, account1, account2] = await ethers.getSigners();
        
        // Deploy the contract
        const Market = await ethers.getContractFactory("Market");
        const marketContract = await Market.deploy(ethers.parseEther("0.01"), "Initial Product", "Initial Description");
        await marketContract.connect(owner).createProduct(100, "Software", "Creez aplicatii web");

        const FeedBack = await ethers.getContractFactory("FeedBack");
        const feedbackContract = await FeedBack.deploy(marketContract.target, 0, 3, "Comment");
        await feedbackContract.connect(account1).addFeedback(1, 4, "Comment2")
        

        const feedback = await feedbackContract.reviews(1);

        expect(feedback.productId == 0);
        expect(feedback.rating == 4);
        expect(feedback.comment == "Comment2");
    });

    it("should get all feedbacks from a product", async function () {
        const [owner, account1, account2] = await ethers.getSigners();
        
        // Deploy the contract
        const Market = await ethers.getContractFactory("Market");
        const marketContract = await Market.deploy(ethers.parseEther("0.01"), "Initial Product", "Initial Description");
        await marketContract.connect(owner).createProduct(100, "Software", "Creez aplicatii web");

        const FeedBack = await ethers.getContractFactory("FeedBack");
        const feedbackContract = await FeedBack.deploy(marketContract.target, 0, 3, "Comment");
        await feedbackContract.connect(account1).addFeedback(1, 4, "Comment2")
        await feedbackContract.connect(account1).addFeedback(1, 3, "Comment3")

        const Array = await feedbackContract.getAllFeedbacks(1);

        expect(Array[1].productId == 1);
        expect(Array[1].rating == 3);
        expect(Array[1].comment == "Comment3");
    });

    it("should get all review points for a product", async function () {
        const [owner, account1, account2] = await ethers.getSigners();
        
        // Deploy the contract
        const Market = await ethers.getContractFactory("Market");
        const marketContract = await Market.deploy(ethers.parseEther("0.01"), "Initial Product", "Initial Description");
        await marketContract.connect(owner).createProduct(100, "Software", "Creez aplicatii web");

        const FeedBack = await ethers.getContractFactory("FeedBack");
        const feedbackContract = await FeedBack.deploy(marketContract.target, 0, 3, "Comment");
        await feedbackContract.connect(account1).addFeedback(1, 5, "Comment2")
        await feedbackContract.connect(account1).addFeedback(1, 3, "Comment3")
        await feedbackContract.connect(account1).addFeedback(1, 5, "Comment2")
        await feedbackContract.connect(account1).addFeedback(1, 2, "Comment3")

        const Array = await feedbackContract.getAllFeedbacks(1);
        const points = await feedbackContract.getTotalPointsForProduct(1);

        expect(points == 15);
    });
});
