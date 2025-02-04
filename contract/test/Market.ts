import { expect } from "chai";
const { ethers } = require("hardhat");

describe("Market Contract", function () {
    it("should create a product", async function () {
        const [owner, account1, account2] = await ethers.getSigners();
        
        // Deploy the contract
        const Market = await ethers.getContractFactory("Market");
        const marketContract = await Market.deploy(100, "Initial Product", "Initial Description");

        // Create a new product
        await marketContract.connect(owner).createProduct(100, "Software", "Creez aplicatii web");

        // Fetch the created product from the contract
        const product = await marketContract.products(1);

        // Check the product details
        expect(product.price).to.equal(100);
        expect(product.name).to.equal("Software");
        expect(product.description).to.equal("Creez aplicatii web");
        expect(product.ownerProduct).to.equal(owner.address);
    });

    it("should buy a product", async function () {
        const [owner, account1, account2] = await ethers.getSigners();
        
        // Deploy the contract
        const Market = await ethers.getContractFactory("Market");
        const marketContract = await Market.deploy(ethers.parseEther("0.01"), "Initial Product", "Initial Description");

        const product = await marketContract.products(0);

        const sellerInitialBalance = await ethers.provider.getBalance(owner);

        const confirmation = await marketContract.connect(account1).buyProduct(0, {value: product.price});

        await confirmation.wait();

        const sellerNewBalance = await ethers.provider.getBalance(owner);

        expect(sellerInitialBalance < sellerNewBalance);
    });

    it("should delete a product", async function () {
        const [owner, account1, account2] = await ethers.getSigners();
        
        // Deploy the contract
        const Market = await ethers.getContractFactory("Market");
        const marketContract = await Market.deploy(ethers.parseEther("0.01"), "Initial Product", "Initial Description");

        await marketContract.connect(owner).deleteProduct(0);

        const product = await marketContract.products(0);
        
        expect(product[0].price == 0 && product[0].name == "" && product[0].description == "");
    });

    it("should get all products", async function () {
        const [owner, account1, account2] = await ethers.getSigners();
        
        // Deploy the contract
        const Market = await ethers.getContractFactory("Market");
        const marketContract = await Market.deploy(ethers.parseEther("0.01"), "Initial Product", "Initial Description");

        const Array = await marketContract.connect(owner).getAllProducts();
        
        expect(!Array);
    });

    it("should get a product", async function () {
        const [owner, account1, account2] = await ethers.getSigners();
        
        // Deploy the contract
        const Market = await ethers.getContractFactory("Market");
        const marketContract = await Market.deploy(ethers.parseEther("0.01"), "Initial Product", "Initial Description");

        const product = await marketContract.connect(owner).getProduct(0);
        
        expect(product[0].price == ethers.parseEther("0.01") && product[0].name == "Initial Product" && product[0].description == "Initial Description");
    });
});
