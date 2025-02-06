"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllProducts } from "../utils/contractServices";
import ProductCard from "./ProductCard";
import { ethers } from "ethers";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const productsData = await getAllProducts();
      const filteredProducts = productsData.filter(
        (product) =>
          product.price && ethers.getBigInt(product.price) > ethers.getBigInt(0)
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {products.map((product, index) => (
        <ProductCard
          key={`${product.name}-${index}`}
          product={product}
          index={index}
        />
      ))}
    </div>
  );
};

export default ProductList;
