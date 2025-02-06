import React, { useState } from "react";
import contractServices from "../utils/contractServices";
import { parseUnits } from "ethers";

const CreateProduct = ({ account }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await contractServices.createProduct(
      parseUnits(price, "ether"),
      name,
      description
    );
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Price (ETH)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit">Create Product</button>
    </form>
  );
};

export default CreateProduct;
