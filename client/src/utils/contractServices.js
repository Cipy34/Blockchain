import { BrowserProvider, Contract } from "ethers";
import { MARKET_ADDRESS, FEEDBACK_ADDRESS } from "../utils/constants";
import MARKET_ABI from "../utils/Market_ABI.json";
import FEEDBACK_ABI from "../utils/Feedback_ABI.json";

const getProvider = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed!");
  }
  return new BrowserProvider(window.ethereum);
};

const getMarketContract = async () => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  return new Contract(MARKET_ADDRESS, MARKET_ABI, signer);
};

const getFeedbackContract = async () => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  return new Contract(FEEDBACK_ADDRESS, FEEDBACK_ABI, signer);
};

export const createProduct = async (price, name, description) => {
  const contract = await getMarketContract();
  await contract.createProduct(price, name, description);
};

export const buyProduct = async (index) => {
  const contract = await getMarketContract();
  const product = await contract.getProduct(index);
  await contract.buyProduct(index, { value: product.price });
};

export const deleteProduct = async (index) => {
  const contract = await getMarketContract();
  await contract.deleteProduct(index);
};

export const getAllProducts = async () => {
  const contract = await getMarketContract();
  return await contract.getAllProducts();
};

export const withdraw = async () => {
  const contract = await getMarketContract();
  await contract.withdraw();
};

export const addFeedback = async (productId, rating, comment) => {
  const contract = await getFeedbackContract();
  await contract.addFeedback(productId, rating, comment);
};

export const getAllFeedbacks = async (productId) => {
  const contract = await getFeedbackContract();
  const feedbacks = await contract.getAllFeedbacks(productId);
  return feedbacks.map((feedback) => ({
    productId: feedback.productId.toString(),
    rating: feedback.rating,
    comment: feedback.comment,
    timestamp: new Date(Number(feedback.timestamp) * 1000).toLocaleString(),
    reviewer: feedback.reviewer,
  }));
};

export const getTotalPointsForProduct = async (productId) => {
  const contract = await getFeedbackContract();
  const totalPoints = await contract.getTotalPointsForProduct(productId);
  return totalPoints.toString();
};

export default {
  createProduct,
  buyProduct,
  deleteProduct,
  getAllProducts,
  withdraw,
  addFeedback,
  getAllFeedbacks,
  getTotalPointsForProduct,
};
