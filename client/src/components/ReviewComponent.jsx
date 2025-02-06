"use client";

import { useState, useEffect } from "react";
import {
  addFeedback,
  getAllFeedbacks,
  getTotalPointsForProduct,
} from "../utils/contractServices";

const ReviewComponent = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    fetchReviews();
    fetchTotalPoints();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const fetchedReviews = await getAllFeedbacks(productId);
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchTotalPoints = async () => {
    try {
      const points = await getTotalPointsForProduct(productId);
      setTotalPoints(points);
    } catch (error) {
      console.error("Error fetching total points:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await addFeedback(productId, newReview.rating, newReview.comment);
      setNewReview({ rating: 5, comment: "" });
      await fetchReviews();
      await fetchTotalPoints();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const renderStars = (rating) => {
    const starCount = Number(rating);
    return "⭐".repeat(starCount);
  };

  return (
    <div
      style={{
        marginTop: "20px",
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "8px",
      }}
    >
      <h3>Reviews</h3>
      <p>Total Points: {totalPoints.toString()}</p>

      <form onSubmit={handleSubmitReview} style={{ marginBottom: "20px" }}>
        <select
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({
              ...newReview,
              rating: Number.parseInt(e.target.value),
            })
          }
          style={{ marginRight: "10px" }}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Star{num !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          placeholder="Your review"
          style={{ marginRight: "10px" }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            border: "none",
            color: "white",
            padding: "5px 10px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "14px",
            margin: "4px 2px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Submit Review
        </button>
      </form>

      <div>
        {reviews.map((review, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
            }}
          >
            <p>Rating: {renderStars(review.rating)}</p>
            <p>{review.comment}</p>
            <small>
              By: {review.reviewer} on {review.timestamp}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewComponent;
