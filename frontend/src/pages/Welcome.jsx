import React, { useRef, useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Welcome.css";
import gsap from "gsap";
import { EthersContext } from "../context/EthersProvider";
import { ethers } from "ethers";

function Welcome() {
  const { connectWallet, contract, account, signer } =
    useContext(EthersContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      imageRef.current,
      { y: -10 },
      { y: 10, repeat: -1, yoyo: true, duration: 1, ease: "power1.inOut" }
    );
  }, []);

  const blimpRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      blimpRef.current,
      { y: -10 },
      { y: 10, repeat: -1, yoyo: true, duration: 5, ease: "power1.inOut" }
    );
  }, []);

  const handleEnterVote = async () => {
    if (!account) {
      await connectWallet();
    }

    if (!contract) {
      alert("Contract is not available, please connect wallet...");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.enterVote({
        value: ethers.parseEther("0.0001"),
      });
      await tx.wait();
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.log("Error entering vote", error);
      setLoading(false);
      alert(
        "There was an error entering the vote, please refresh and try again..."
      );
    }
  };

  return (
    <div className="introduction-screen">
      <img
        style={{ width: "500px" }}
        ref={blimpRef}
        src="/images/landscape/blimp.png"
        alt="blimp"
      />
      <div className="robot-speech">
        <div className="speech">
          <p>
            Greetings, citizen! <br /> Welcome to the 2099 Vote, where the
            future is in your hands. Three candidates, three visions, one
            decision that shapes history. Will you choose stability, revolution,
            or chaos? Cast your vote and decide the future!
          </p>
          <button onClick={handleEnterVote} disabled={loading}>
            {loading ? "Processing entry..." : "Enter vote"}
          </button>
        </div>
        <img ref={imageRef} src="/images/characters/robot.png" alt="robot" />
      </div>
    </div>
  );
}

export default Welcome;
