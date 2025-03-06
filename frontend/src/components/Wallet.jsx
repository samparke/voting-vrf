import React, { useContext } from "react";
import { EthersContext } from "../context/EthersProvider";
import "../styles/Wallet.css";

function Wallet() {
  // passed from our EthersProvider export
  const { account, connectWallet } = useContext(EthersContext);

  return (
    <div>
      <button onClick={connectWallet} className="wallet">
        {account
          ? `${account.substring(0, 6)}...${account.slice(-4)}`
          : "Connect Wallet"}
      </button>
    </div>
  );
}

export default Wallet;
