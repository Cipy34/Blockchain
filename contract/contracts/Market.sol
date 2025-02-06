// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./Withdrawable.sol";

contract Market is Withdrawable {
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
        require(index < productCount, "Invalid index");
        require(msg.value >= products[index].price, "Insufficient funds");

        //Actualizat cu withdrawal, se actualizeaza soldul seller-ului pentru retragere ulterioara
        address seller = products[index].ownerProduct;
        _addPendingWithdrawal(seller, products[index].price);

        //Daca s a trimis o suma mai mare, se da refund sender ului
        if (msg.value > products[index].price) {
            uint refund = msg.value - products[index].price;
            payable(msg.sender).transfer(refund);
        }

        emit ProductBought(index, msg.sender);
    }

    modifier onlyOwner(uint index) {
        require(
            msg.sender == products[index].ownerProduct,
            "Only the owner can access this"
        );
        _;
    }

    function deleteProduct(uint index) external onlyOwner(index) {
        require(index < productCount, "Invalid index");

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
            if(
            keccak256(bytes(products[i].name)) != keccak256(bytes("")))
            
            allProducts[i] = products[i];
        }
        return allProducts;
    }

    function getProduct(uint index) external view returns (Product memory) {
        require(index < productCount, "Invalid index");
        require(
            keccak256(bytes(products[index].name)) != keccak256(bytes("")),
            "Invalid product"
        );
        return products[index];
    }
}
