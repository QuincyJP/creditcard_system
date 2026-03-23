import { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Card } from "@mui/material";

function Billing({ user, refreshKey }) {
  const [cards, setCards] = useState([]);
  const [bills, setBills] = useState({});
  
  useEffect(() => {
    if (!user) return;

    fetch(`https://credit-backend-rrsg.onrender.com/api/cards/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setCards(data);

        data.forEach(card => {
          fetch(`https://credit-backend-rrsg.onrender.com/api/transactions/bill/${card.cardNumber}`)
            .then(res => res.json())
            .then(bill => {
              setBills(prev => ({
                ...prev,
                [card.cardNumber]: bill
              }));
            });
        });
      });
  }, [user, refreshKey]);

  const downloadStatement = (bill) => {
    const content = `
CREDIT CARD STATEMENT

Card Number: **** ${bill.cardNumber.slice(-4)}
Total Amount: ₹${bill.totalAmount}
Interest: ₹${bill.interest}
Final Amount: ₹${bill.finalAmount}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `statement-${bill.cardNumber}.txt`;
    a.click();
  };

  return (
    <Box p={3} sx={{ background: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        💳 Billing Statements
      </Typography>

      <Grid container spacing={3}>
        {cards.map(card => {
          const bill = bills?.[card.cardNumber];
          return (
            <Grid item xs={12} md={6} key={card.cardNumber}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 6,
                  background: "#fff",
                  minHeight: 160,
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Card Ending: **** {card.cardNumber.slice(-4)}
                </Typography>

                {bill ? (
                  <>
                    <Typography>Total: ₹{bill.totalAmount.toLocaleString()}</Typography>
                    <Typography>Interest: ₹{bill.interest.toLocaleString()}</Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      Final: ₹{bill.finalAmount.toLocaleString()}
                    </Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => downloadStatement(bill)}
                    >
                      Download Statement
                    </Button>
                  </>
                ) : (
                  <Typography sx={{ mt: 2 }}>Loading...</Typography>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Billing;