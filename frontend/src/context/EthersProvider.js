import React, { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import { voteContractAbi, voteContractAddress } from "../utils/constants";

export const EthersContext = createContext();

export const EthersProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  // this section, once enabled, prompts a connection instantly. I've commented out for the moment.

  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        try {
          const ethersProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(ethersProvider);

          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length > 0) {
            const ethersSigner = await ethersProvider.getSigner();
            setSigner(ethersSigner);
            setAccount(accounts[0]);

            const voteContract = new ethers.Contract(
              voteContractAddress,
              voteContractAbi,
              signer
            );
            setContract(voteContract);
          }
        } catch (error) {
          console.error("Auto-connect failed:", error);
        }
      }
    };
    autoConnect();
  }, []);

  // manual connection
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    try {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);

      const accounts = await ethersProvider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        const ethersSigner = await ethersProvider.getSigner();
        setSigner(ethersSigner);
        setAccount(accounts[0]);

        const voteContract = new ethers.Contract(
          voteContractAddress,
          voteContractAbi,
          signer
        );
        setContract(voteContract);
      }
    } catch (error) {
      console.error("Error connecting to Ethereum:", error);
    }
  };

  useEffect(() => {
    if (signer) {
      const voteContract = new ethers.Contract(
        voteContractAddress,
        voteContractAbi,
        signer
      );
      setContract(voteContract);
      console.log("Contract set:", voteContract);
    }
  }, [signer]);

  // checks for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (provider) {
            const currentSigner = await provider.getSigner();
            setSigner(currentSigner);
          }
        } else {
          setAccount(null);
          setSigner(null);
          setProvider(null);
          setContract(null);
        }
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, [provider]);

  // checks for network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleChainsChanged = () => window.location.reload();
      window.ethereum.on("chainChanged", handleChainsChanged);

      return () => {
        window.ethereum.removeListener("chainsChanged", handleChainsChanged);
      };
    }
  }, []);

  return (
    <EthersContext.Provider
      value={{ provider, signer, account, connectWallet, contract }}
    >
      {children}
    </EthersContext.Provider>
  );
};
