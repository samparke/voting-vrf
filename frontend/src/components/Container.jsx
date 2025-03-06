import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import "../styles/Container.css";

function Container({ children, wallet, back, getWinner }) {
  // this is the floating animation for the white box
  // I used gsap - an animation library
  const boxRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      boxRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }, []);
  return (
    <div className="container">
      <div ref={boxRef} className="box">
        <div className="box-buttons">
          {back}
          {wallet}
          {getWinner}
        </div>
        {children}
      </div>
    </div>
  );
}

export default Container;
