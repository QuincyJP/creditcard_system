import { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, Chip } from "@mui/material";

function Transaction({ user, refreshKey }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`https://credit-backend-rrsg.onrender.com/api/transactions/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        let formattedData = [];
        if (Array.isArray(data)) formattedData = data;
        else if (data) formattedData = [data];

        // Filter valid data and sort latest first
        formattedData = formattedData.filter(t => t && t.amount && t.date);
        formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(formattedData);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setTransactions([]);
      });
  }, [user, refreshKey]);

  if (!transactions || transactions.length === 0) {
    return (
      <Typography variant="h6" sx={{ padding: 3 }}>
        No Transactions Found
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 3, background: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        📊 Transactions
      </Typography>

      <Grid container spacing={3}>
        {transactions.map((t, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 6,
                minHeight: 160,
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.3s ease",
                "&:hover": { transform: "translateY(-5px)", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  ₹{(t.amount || 0).toLocaleString()}
                </Typography>

                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <b>Product:</b> {t.description || "No description"}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <b>Date:</b> {t.date ? new Date(t.date).toLocaleString() : "No Date"}
                </Typography>

                {t.cardNumber && (
                  <Typography variant="body2" color="textSecondary">
                    <b>Card:</b> **** {t.cardNumber.slice(-4)}
                  </Typography>
                )}
              </Box>

              {/* Status Chip */}
              <Chip
                label={t.status || "UNKNOWN"}
                sx={{
                  fontWeight: "bold",
                  color: t.status === "SUCCESS" ? "green" : "red",
                  backgroundColor: t.status === "SUCCESS" ? "#d4edda" : "#f8d7da",
                  width: "fit-content",
                  mt: 2
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Transaction;