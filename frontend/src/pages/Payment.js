import { useState } from "react";
import { Box, TextField, Button, Typography, Card } from "@mui/material";

function Payment({ product, onRefresh }) {
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [result, setResult] = useState(null);

  const handlePay = () => {
    fetch(
      `http://localhost:8080/api/transactions/pay?cardNumber=${cardNumber}&pin=${pin}&amount=${product.price}&productName=${product.name}`,
      {
        method: "POST"
      }
    )
      .then(res => res.json())
      .then(data => {
        setResult(data);
        if (onRefresh) onRefresh();
      })
      .catch(() => setResult({ status: "FAILED", amount: product.price, description: product.name, date: new Date() }));
  };

  return (
    <Box sx={{ padding: 3, background: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        💳 Payment
      </Typography>

      <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 6, background: "#fff" }}>
        <Typography variant="h6">Product: {product.name}</Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Amount: ₹{product.price.toLocaleString()}
        </Typography>

        <TextField
          fullWidth
          label="Card Number"
          margin="normal"
          onChange={e => setCardNumber(e.target.value)}
        />

        <TextField
          fullWidth
          label="PIN"
          type="password"
          margin="normal"
          onChange={e => setPin(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handlePay}
        >
          Pay Now
        </Button>
      </Card>

      {result && (
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 6, background: result.status === "SUCCESS" ? "#e8f5e9" : "#ffebee" }}>
          <Typography variant="h6">
            {result.status === "SUCCESS" ? "✅ Payment Successful" : "❌ Payment Failed"}
          </Typography>
          <Typography>Amount: ₹{result.amount.toLocaleString()}</Typography>
          <Typography>Product: {result.description}</Typography>
          <Typography>Date: {new Date(result.date).toLocaleString()}</Typography>
        </Card>
      )}
    </Box>
  );
}

export default Payment;