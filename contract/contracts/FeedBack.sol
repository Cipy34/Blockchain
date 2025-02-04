// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IMarket {
    function getProduct(
        uint index
    )
        external
        view
        returns (
            uint price,
            string memory name,
            string memory description,
            address ownerProduct
        );
}

contract FeedBack {
    struct Review {
        uint productId;
        uint8 rating; // 1-5 stars
        string comment;
        uint timestamp;
        address reviewer;
    }

    IMarket marketContract;

    uint public reviewCount;

    constructor(
        address marketAddress,
        uint productId_,
        uint8 rating_,
        string memory comment_
    ) {
        marketContract = IMarket(marketAddress);
        reviews[reviewCount] = Review({
            productId: productId_,
            rating: rating_,
            comment: comment_,
            timestamp: block.timestamp,
            reviewer: msg.sender
        });
        reviewCount++;
    }

    mapping(uint => Review) public reviews;

    event FeedBackAdded(uint productId_, uint8 rating_, string comment_);

    function addFeedback(
        uint productId_,
        uint8 rating_,
        string memory comment_
    ) external {
        require(rating_ >= 1 && rating_ <= 5, "Rating must be between 1 and 5");
        (, , string memory test, address ownerProduct) = marketContract
            .getProduct(productId_);
        require(
            keccak256(bytes(test)) != keccak256(bytes("")),
            "Invalid product"
        );
        require(
            ownerProduct != msg.sender,
            "FeedBack sender address must be different from Product Owner address"
        );

        reviews[reviewCount] = Review({
            productId: productId_,
            rating: rating_,
            comment: comment_,
            timestamp: block.timestamp,
            reviewer: msg.sender
        });
        reviewCount++;

        emit FeedBackAdded(productId_, rating_, comment_);
    }

    function getAllFeedbacks(
        uint productId_
    ) public view returns (Review[] memory) {
        (, , string memory test, ) = marketContract.getProduct(productId_);
        require(
            keccak256(bytes(test)) != keccak256(bytes("")),
            "Invalid product"
        );

        Review[] memory allFeedbacks = new Review[](reviewCount);
        uint index = 0;

        for (uint i = 0; i < reviewCount; i++) {
            if (reviews[i].productId == productId_) {
                allFeedbacks[index] = reviews[i];
                index++;
            }
        }

        return allFeedbacks;
    }
}
