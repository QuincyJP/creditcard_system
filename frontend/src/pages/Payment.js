import { useState, useEffect } from "react";
import { Typography, Card, Button, TextField, Box } from "@mui/material";

function Payment({ product, onRefresh }) {
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [result, setResult] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  const handlePay = () => {
    fetch(
      `https://credit-backend-rrsg.onrender.com/api/transactions/pay?cardNumber=${cardNumber}&pin=${pin}&amount=${product.price}&productName=${product.name}`,
      { method: "POST" }
    )
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Payment failed");
        }
        return res.json();
      })
      .then((data) => {
        setResult(data);
        setTransactionId(data.transactionId || data.id);

        if (onRefresh) onRefresh();
      })
      .catch((err) =>
        setResult({
          status: "FAILED",
          amount: product.price,
          description: err.message,
          date: new Date()
        })
      );
  };

  useEffect(() => {
    if (!transactionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://credit-backend-rrsg.onrender.com/api/transactions/${transactionId}`
        );

        if (!res.ok) return;

        const data = await res.json();

        // 🔥 Normalize backend status (VERY IMPORTANT)
        const status = (data.status || "").toUpperCase();

        setResult({
          ...data,
          status:
            status === "APPROVED"
              ? "SUCCESS"
              : status === "REJECTED"
              ? "FAILED"
              : status
        });

        // stop polling only when final state is confirmed
        if (
          status === "APPROVED" ||
          status === "REJECTED" ||
          status === "SUCCESS" ||
          status === "FAILED"
        ) {
          clearInterval(interval);
        }
      } catch (err) {
        console.log("Polling error:", err);
      }
    }, 4000); // slightly slower = more stable

    return () => clearInterval(interval);
  }, [transactionId]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4
      }}
    >
      <Card
        sx={{
          width: 420,
          p: 4,
          borderRadius: 4,
          boxShadow: 5
        }}
      >
        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
          Payment Checkout
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, color: "gray" }}>
          Pay for: <b>{product.name}</b> — ₹{product.price}
        </Typography>

        {/* INPUT STACK */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Card Number"
            variant="outlined"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            fullWidth
          />

          <TextField
            label="PIN"
            type="password"
            variant="outlined"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            size="large"
            onClick={handlePay}
            sx={{
              mt: 1,
              py: 1.2,
              fontWeight: "bold",
              borderRadius: 2
            }}
          >
            Pay ₹{product.price}
          </Button>
        </Box>

        {/* RESULT */}
        {result && (
          <Card
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 3,
              background:
                result.status === "SUCCESS"
                  ? "#e8f5e9"
                  : result.status === "FAILED"
                  ? "#ffebee"
                  : "#fff3e0"
            }}
          >
            <Typography variant="h6">
              {result.status === "SUCCESS" && "✅ Payment Successful"}
              {result.status === "FAILED" && "❌ Payment Failed"}
              {result.status === "PENDING" && "⏳ Payment Pending"}
            </Typography>

            <Typography>Amount: ₹{result.amount}</Typography>
            <Typography>Product: {result.description}</Typography>
            <Typography>
              Date: {new Date(result.date).toLocaleString()}
            </Typography>
          </Card>
        )}
      </Card>
    </Box>
  );
}

export default Payment;