"use client";

import { useState, useEffect } from "react";
import { buyProduct, deleteProduct } from "../utils/contractServices";
import { ethers } from "ethers";
import ReviewComponent from "./ReviewComponent";

const ProductCard = ({ product, index, onProductUpdate }) => {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setIsOwner(
          address.toLowerCase() === product.ownerProduct.toLowerCase()
        );
      }
    };

    checkOwnership();
  }, [product.ownerProduct]);

  const handleBuy = async () => {
    try {
      await buyProduct(index, product.price);
      onProductUpdate();
    } catch (error) {
      console.error("Error buying product:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(index);
      onProductUpdate();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px",
        maxWidth: "300px",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
        {product.name}
      </h2>
      <p style={{ fontSize: "1rem", color: "#666", marginBottom: "8px" }}>
        {product.description}
      </p>
      <p
        style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "8px" }}
      >
        {ethers.formatEther(product.price)} ETH
      </p>
      <p style={{ fontSize: "0.875rem", color: "#888", marginBottom: "16px" }}>
        Owner: {product.ownerProduct}
      </p>
      {!isOwner ? (
        <button
          onClick={handleBuy}
          style={{
            backgroundColor: "#4CAF50",
            border: "none",
            color: "white",
            padding: "10px 20px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            margin: "4px 2px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Buy
        </button>
      ) : (
        <button
          onClick={handleDelete}
          style={{
            backgroundColor: "#f44336",
            border: "none",
            color: "white",
            padding: "10px 20px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            margin: "4px 2px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Delete
        </button>
      )}
      <ReviewComponent productId={index} />
    </div>
  );
};

export default ProductCard;
