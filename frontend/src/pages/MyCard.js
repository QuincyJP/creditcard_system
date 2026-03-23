import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Collapse,
  Alert
} from "@mui/material";

function MyCard({ user, refreshKey }) {
  const [cards, setCards] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [pin, setPin] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const fetchCards = useCallback(() => {
    if (!user) return;

    fetch(`https://credit-backend-rrsg.onrender.com/api/cards/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
      console.log("Fetched cards:", data); // 🔥 DEBUG
      setCards(data);
    })
      .catch(err => console.error("ERROR:", err));
  }, [user]);

  // 🔥 Fetch cards whenever user changes
  useEffect(() => {
    fetchCards();
  }, [fetchCards, refreshKey]);


  const handleOpenDialog = (card) => {
    setSelectedCard(card);
    setPin("");
    setOpenDialog(true);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCard(null);
  };

  const handleSetPin = () => {
    fetch(
      `https://credit-backend-rrsg.onrender.com/api/cards/set-pin?cardNumber=${selectedCard.cardNumber}&pin=${pin}`,
      { method: "POST" }
    )
      .then(res => {
        if (!res.ok)
          return res.text().then(text => {
            throw new Error(text);
          });
        return res.text();
      })
      .then(msg => {
        setSuccessMsg(`✅ PIN set for card ${selectedCard.cardNumber}`);
        setErrorMsg("");
        handleCloseDialog();
        fetchCards();
      })
      .catch(err => setErrorMsg(err.message));
  };

  const isPinValid = /^\d{4}$/.test(pin);

  if (!cards || cards.length === 0) {
    return <Typography sx={{ padding: 2 }}>No Cards Found</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
      {cards.map((card, index) => (
        <Card
          key={index}
          sx={{ p: 3, background: "#1E3A8A", color: "white", position: "relative" }}
        >
          <Typography variant="h6">💳 Credit Card</Typography>
          <Typography>Card Number: {card.cardNumber}</Typography>
          <Typography>Limit: ₹{card.creditLimit}</Typography>
          <Typography>Available: ₹{card.availableLimit}</Typography>

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => handleOpenDialog(card)}
          >
            {card.pin ? "Reset PIN" : "Set PIN"}
          </Button>
        </Card>
      ))}

      {/* Success and Error Alerts */}
      <Collapse in={!!successMsg}>
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMsg}
        </Alert>
      </Collapse>
      <Collapse in={!!errorMsg}>
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMsg}
        </Alert>
      </Collapse>

      {/* PIN Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedCard?.pin ? "Reset PIN" : "Set PIN"} - {selectedCard?.cardNumber}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter 4-digit PIN"
            type="password"
            fullWidth
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            helperText="PIN must be exactly 4 digits"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSetPin}
            disabled={!isPinValid} // 🔥 Save button enabled only if 4-digit PIN
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyCard;