"use client";

import React, { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { ethers } from "ethers";
import "./styles.css";

import ProductList from "./components/ProductList";
import CreateProduct from "./components/CreateProduct";
import DepositWithdraw from "./components/DepositWithdraw";

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null); // Adăugăm o stare pentru balanță

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum); // Folosește BrowserProvider în versiunea 6.x
      try {
        // Cere permisiunea pentru a obține conturile
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  // Obținem balanța contului la fiecare schimbare de cont
  useEffect(() => {
    const getBalance = async () => {
      if (account) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balanceWei = await provider.getBalance(account);
        const balanceEth = ethers.formatUnits(balanceWei, 18); // Conversie din Wei în ETH
        setBalance(balanceEth);
      }
    };

    getBalance();
  }, [account]); // Rulează doar când contul se schimbă

  return (
    <div>
      <h1>Web3 Marketplace</h1>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account}` : "Connect Wallet"}
      </button>

      {account && balance !== null && <p>Your balance: {balance} ETH</p>}

      <DepositWithdraw account={account} />
      <CreateProduct account={account} />
      <ProductList account={account} />
    </div>
  );
}

export default App;
