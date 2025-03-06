import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Header from "../components/Header";
import ShowInfo from "../components/ShowInfo";
import Wallet from "../components/Wallet";
import "../styles/Dashboard.css";
import "../styles/CandidateCard.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";
import { EthersContext } from "../context/EthersProvider";

function Dashboard() {
  const { contract } = useContext(EthersContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const candidates = [
    {
      id: 0,
      name: "Gregory the Gnome",
      image: "/images/characters/gnome.png",
      winnerImage: "/images/characters/gregory the gnome podium.png",
      shortDescription:
        "A proud representative of the undergrowth, Gregory promises to bring fairness, order, and a thriving mushroom economy.",
      slogan: "Small in stature, big on change!",
      fullDescription:
        "A true advocate for grassroots politics (literally), Gregory the Gnome has dedicated his tiny but mighty existence to ensuring fair governance for all creatures—big and small. With his deep understanding of underground networks (both political and fungal), he promises to root out corruption and grow a prosperous future for all.",
      attributes: [
        "Diplomatic Mastermind : Can resolve disputes with a single wise nod and a long-winded story.",
        "Stubborn as a Stump : Once he takes a stance, no storm, law, or gust of wind can move him.",
      ],
      controversy:
        "Accused of having “suspiciously close ties” with garden ornament manufacturers.",
    },
    {
      id: 1,
      name: "Bongo the Monkey",
      image: "/images/characters/monkey.png",
      winnerImage: "/images/characters/bongo the monkey podium.png",
      shortDescription:
        "A true political wildcard, Bongo’s campaign is built on bananas, chaos, and the promise of mandatory nap times.",
      slogan: "Chaos? I call it innovation!",
      fullDescription:
        "A true political wildcard, Bongo the Monkey represents the spirit of change. Unpredictable, energetic, and occasionally flinging policies (and other things) at the opposition. His campaign thrives on spontaneity, banana-based economic theories, and the promise of “mandatory siestas for all.",
      attributes: [
        "Banana-Based Economics : Insists that switching to a “fruit-backed currency” will stabilize inflation.",
        "Master of Distraction : Diverts from tough questions by juggling or breakdancing.",
      ],
      controversy:
        "Once interrupted a serious political debate by climbing the stage rafters and refusing to come down.",
    },
    {
      id: 2,
      name: "Vladimir the Vampire",
      image: "/images/characters/vampire.png",
      winnerImage: "/images/characters/vladimir the vampire podium.png",
      shortDescription:
        "Mysterious, charismatic, and definitely not a morning person, Vladimir swears he only wants to “drain corruption, not voters.",
      slogan: "Draining corruption, not voters!",
      fullDescription:
        "Mysterious, charismatic, and immortal (allegedly), Vladimir the Vampire has emerged from the shadows to campaign for a new kind of leadership—one that values efficiency, discipline, and long-term vision (like, really long-term). With centuries of “experience” under his belt, Vladimir assures the public he has seen empires rise and fall and knows exactly how to prevent the latter.",
      attributes: [
        "Eternal Strategist : Has played political chess for over 600 years, rarely loses.",
        "Bat-to-Human Diplomacy – Occasionally turns into a bat mid-negotiation to “think things over.",
      ],
      controversy:
        "The phrase “unlimited blood donations” appeared in one of his tax policies—still unclear what it means.",
    },
  ];

  const getWinner = async () => {
    try {
      setLoading(true);
      console.log("Requesting random winner...");

      contract.removeAllListeners("RequestFulfilled");
      contract.removeAllListeners("Winner");

      const tx = await contract.requestRandomWords();
      await tx.wait();
      console.log("VRF request sent, waiting for fulfillment...");

      contract.once("RequestFulfilled", async () => {
        console.log("VRF fulfilled, checking if user won");

        const txHasUserWon = await contract.hasUserWon();
        await txHasUserWon.wait();
      });

      contract.once("Winner", (userCandidateId, winnerId, hasWon) => {
        console.log("Winner Event emitted");
        console.log(`User Vote: ${userCandidateId.toString()}`);
        console.log(`Random Winner ID: ${winnerId.toString()}`);
        console.log(`Did the user win? ${hasWon ? "Yes" : "No"}`);

        navigate("/winner", {
          state: {
            userVote: candidates[userCandidateId],
            winningCandidate: candidates[winnerId],
            hasWon: hasWon,
          },
        });

        setLoading(false);
      });
    } catch (error) {
      console.error("Error getting winner:", error);
      alert("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <Container
        wallet={<Wallet />}
        back={
          <button
            style={{
              padding: "15px 30px",
              fontFamily: "VT323",
              fontSize: "20px",
              borderRadius: "30px",
              backgroundColor: "rgb(60,60,60)",
              color: "white",
              cursor: "pointer",
              marginRight: "10px",
              marginLeft: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(btn) =>
              (btn.target.style.backgroundColor = "rgb(0,0,0)")
            }
            onMouseLeave={(btn) =>
              (btn.target.style.backgroundColor = "rgb(60,60,60)")
            }
            onClick={() => navigate("/")}
            disabled={loading}
          >
            {loading ? "Processing..." : "Back"}
          </button>
        }
        getWinner={
          <button
            style={{
              padding: "15px 30px",
              fontFamily: "VT323",
              fontSize: "20px",
              borderRadius: "30px",
              backgroundColor: "rgb(255,215,0)",
              color: "rgb(30,30,30)",
              cursor: "pointer",
              marginLeft: "auto",
              marginRight: "10px",
              border: "1px solid rgb(219,172,52)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(btn) =>
              (btn.target.style.backgroundColor = "rgb(219,172,20)")
            }
            onMouseLeave={(btn) =>
              (btn.target.style.backgroundColor = "rgb(255,215,0)")
            }
            onClick={getWinner}
            disabled={loading}
          >
            {loading ? "Getting Winner..." : "Get Winner"}
          </button>
        }
      >
        <h1
          className="welcome-heading"
          style={{ color: "black", margin: 0, marginBottom: 20 }}
        >
          Vote for your candidate:
        </h1>

        <div className="candidate-section">
          {candidates.map((candidate) => (
            <Card
              sx={{
                maxWidth: 350,
                borderRadius: 5,
                overflow: "hidden",
                "&:hover": {
                  backgroundImage: "url(/images/landscape/spotlight.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                },
                "&:hover .card-content": { backgroundColor: "black" },
                "&:hover .scale-image": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease",
                },
              }}
            >
              <CardActionArea>
                <Box sx={{ overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={candidate.image}
                    alt={candidate.name}
                    className="scale-image"
                  />
                </Box>
                <CardContent
                  sx={{ backgroundColor: "rgb(50,50,50)", overflow: "hidden" }}
                  className="card-content"
                >
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                      fontFamily: "VT323",
                      color: "white",
                      fontWeight: "900",
                    }}
                  >
                    {candidate.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "white", fontFamily: "VT323", fontSize: 18 }}
                  >
                    {candidate.shortDescription}
                  </Typography>
                  <ShowInfo candidate={candidate} loading={loading} />
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
