import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useConfirm } from "material-ui-confirm";
import { EthersContext } from "../context/EthersProvider";

function ShowInfo({ candidate, loading }) {
  const [open, setOpen] = useState(false);
  const confirm = useConfirm();
  const { contract } = useContext(EthersContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfrim = async () => {
    const { confirmed } = await confirm({
      title: `Are you sure you want to vote for ${candidate.name}?`,
      content: "You will be unable to vote again!",
      confirmationText: "Yes",
      cancellationText: "No",
      dialogProps: {
        sx: {
          fontFamily: "VT323",
        },
        PaperProps: {
          sx: {
            borderRadius: "30px",
            height: "230px",
            width: "320px",
          },
        },
      },
      titleProps: {
        sx: {
          fontFamily: "VT323",
          fontSize: "22px",
        },
      },
      contentProps: {
        sx: {
          fontFamily: "VT323",
          fontSize: "20px",
          color: "rgb(220,20,60)",
        },
      },
      confirmationButtonProps: {
        sx: {
          "&:hover": {
            backgroundColor: "rgb(10, 179, 43)",
            color: "white",
          },
          fontFamily: "VT323",
          color: "rgb(10, 179, 43)",
          fontSize: "18px",
        },
      },
      cancellationButtonProps: {
        sx: {
          "&:hover": {
            backgroundColor: "rgb(255,0,0)",
            color: "white",
          },
          fontFamily: "VT323",
          color: "rgb(255,0,0)",
          fontSize: "18px",
        },
      },
    });

    if (confirmed) {
      vote();
    }
  };

  const vote = async () => {
    handleClose();
    const tx = await contract.vote(candidate.id);
    alert("Your vote is processing...⏳");
    await tx.wait();
    alert(
      "Your vote has been made! ✅ When you are ready, press 'Get winner'!"
    );
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        disabled={loading}
        sx={{
          color: "white",
          border: "1px solid white",
          borderRadius: "10px",
          fontFamily: "VT323",
          fontSize: "15px",
          marginTop: "10px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
          "&:hover": {
            backgroundColor: loading ? "transparent" : "white",
            color: loading ? "white" : "black",
          },
        }}
      >
        {loading ? "Processing..." : "Show info"}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontFamily: "VT323", fontSize: "35px" }}
        >
          {candidate.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ fontFamily: "VT323", fontSize: "20px" }}
          >
            {candidate.fullDescription}
            <br /> <br />
            Attributes:
            <li>{candidate.attributes[0]}</li>
            <li>{candidate.attributes[1]}</li>
            <br />
            Controversies:
            <li>{candidate.controversy}</li>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              fontFamily: "VT323",
              fontSize: "20px",
              color: "black",
              "&:hover": { backgroundColor: "rgb(211,211,211)" },
            }}
            onClick={handleClose}
          >
            Back
          </Button>
          <Button
            sx={{
              fontFamily: "VT323",
              fontSize: "20px",
              color: "rgb(10, 179, 43)",
              "&:hover": {
                backgroundColor: "rgb(10, 179, 43)",
                color: "white",
              },
            }}
            onClick={handleConfrim}
            autoFocus
          >
            Vote
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ShowInfo;
