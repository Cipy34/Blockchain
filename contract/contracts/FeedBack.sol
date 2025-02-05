// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./Market.sol";

contract FeedBack {
    struct Review {
        uint productId;
        uint8 rating; // 1-5 stars
        string comment;
        uint timestamp;
        address reviewer;
    }

    // Reference to the Market contract
    Market public marketContract;

    // Mapping to store reviews
    mapping(uint => Review) public reviews;
    uint public reviewCount;

    event FeedBackAdded(uint productId_, uint8 rating_, string comment_);

    // The constructor now receives the market contract address along with an initial review
    constructor(
        address marketAddress,
        uint productId_,
        uint8 rating_,
        string memory comment_
    ) {
        marketContract = Market(marketAddress);
        reviews[reviewCount] = Review({
            productId: productId_,
            rating: rating_,
            comment: comment_,
            timestamp: block.timestamp,
            reviewer: msg.sender
        });
        reviewCount++;
    }

    function addFeedback(
        uint productId_,
        uint8 rating_,
        string memory comment_
    ) external {
        require(rating_ >= 1 && rating_ <= 5, "Rating must be between 1 and 5");

        // Retrieve product details from the Market contract as a struct
        Market.Product memory prod = marketContract.getProduct(productId_);

        // Check that the product exists (for example, the product's name is not empty)
        require(
            keccak256(bytes(prod.name)) != keccak256(bytes("")),
            "Invalid product"
        );

        // Ensure the reviewer is not the product owner
        require(
            prod.ownerProduct != msg.sender,
            "FeedBack sender address must be different from Product Owner address"
        );

        // Add the feedback
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
        // Retrieve product details to validate product existence
        Market.Product memory prod = marketContract.getProduct(productId_);
        require(
            keccak256(bytes(prod.name)) != keccak256(bytes("")),
            "Invalid product"
        );

        // Count reviews for this product
        uint count = 0;
        for (uint i = 0; i < reviewCount; i++) {
            if (reviews[i].productId == productId_) {
                count++;
            }
        }

        // Allocate an array of the correct size and populate it
        Review[] memory allFeedbacks = new Review[](count);
        uint index = 0;
        for (uint i = 0; i < reviewCount; i++) {
            if (reviews[i].productId == productId_) {
                allFeedbacks[index] = reviews[i];
                index++;
            }
        }
        return allFeedbacks;
    }

    function calculateTotalPoints(
        Review[] memory reviewsArray,
        uint productId
    ) public pure returns (uint totalPoints) {
        for (uint i = 0; i < reviewsArray.length; i++) {
            // Only include ratings for the specified productId
            if (reviewsArray[i].productId == productId) {
                totalPoints += reviewsArray[i].rating;
            }
        }
    }

    function getTotalPointsForProduct(
        uint productId
    ) external view returns (uint) {
        Review[] memory productReviews = getAllFeedbacks(productId);
        return calculateTotalPoints(productReviews, productId);
    }
}
