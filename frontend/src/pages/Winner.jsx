import React from "react";
import Container from "../components/Container";
import Header from "../components/Header";
import "../styles/Winner.css";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function Winner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { winningCandidate, hasWon } = location.state || {};

  return (
    <div className="winner-background">
      <Header />
      <Container>
        <div
          className="winner-content"
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            sx={{
              fontFamily: "VT323",
              fontSize: "20px",
              color: "white",
              border: "rgb(50, 50, 50)",
              backgroundColor: "rgb(50, 50, 50)",
              textAlign: "right",
              marginLeft: "auto",
              marginRight: "30px",
              marginBottom: "0",
              "&:hover": {
                backgroundColor: "rgb(0, 0, 0)",
                color: "white",
              },
            }}
            onClick={() => navigate("/")}
            autoFocus
          >
            Back to home
          </Button>
          <img
            style={{ marginTop: 0 }}
            src={winningCandidate.winnerImage}
            alt="winner"
          />
          <h1 style={{ marginBottom: 0, marginTop: 0 }}>
            Your 2099 president is...
          </h1>
          <h2>{winningCandidate.name} 🏆</h2>
          <h2
            style={{
              color: hasWon ? "rgb(10, 179, 43)" : "rgb(255,0,0)",
              marginTop: 0,
            }}
          >
            {hasWon
              ? "Congratulations, You're candidate won!"
              : "Your candidate did not win... better luck next year!"}
          </h2>
        </div>
      </Container>
    </div>
  );
}

export default Winner;
