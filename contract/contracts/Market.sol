// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Market {
    struct Product {
        uint price;
        string name;
        string description;
        address ownerProduct;
    }

    mapping(uint => Product) public products;
    uint256 public productCount;

    event ProductCreated(uint price, string name, string description);
    event ProductBought(uint index, address buyer);
    event ProductDeleted(uint index);

    constructor(uint price_, string memory name_, string memory description_) {
        require(price_ > 0, "The product price must be higher than 0");
        products[productCount] = Product({
            price: price_,
            name: name_,
            description: description_,
            ownerProduct: msg.sender
        });
        productCount++;

        emit ProductCreated(price_, name_, description_);
    }

    function createProduct(
        uint price_,
        string memory name_,
        string memory description_
    ) external {
        products[productCount] = Product({
            price: price_,
            name: name_,
            description: description_,
            ownerProduct: msg.sender
        });
        productCount++;
        emit ProductCreated(price_, name_, description_);
    }

    function buyProduct(uint index) external payable {
        require(index >= 0 && index < productCount, "Invalid index");
        require(msg.value >= products[index].price, "Insufficient funds");

        address seller = products[index].ownerProduct;

        payable(seller).transfer(products[index].price);

        emit ProductBought(index, msg.sender);
    }

    modifier onliOwner(uint index) {
        require(
            msg.sender == products[index].ownerProduct,
            "Only the owner can acces this"
        );
        _;
    }

    function deleteProduct(uint index) external onliOwner(index) {
        require(index >= 0 && index < productCount, "Invalid index");

        products[index] = Product({
            price: 0,
            name: "",
            description: "",
            ownerProduct: address(0)
        });

        emit ProductDeleted(index);
    }

    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](productCount);

        for (uint i = 0; i < productCount; i++) {
            allProducts[i] = products[i];
        }

        return allProducts;
    }

    function getProduct(uint index) external view returns (Product memory) {
        require(index >= 0 && index < productCount, "Invalid index");

        return products[index];
    }
}
