import { useState } from "react";
import { Box, TextField, Button, Typography, Card } from "@mui/material";

function Payment({ product, onRefresh }) {
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [result, setResult] = useState(null);

  const handlePay = () => {
    fetch(
      `https://credit-backend-rrsg.onrender.com/api/transactions/pay?cardNumber=${cardNumber}&pin=${pin}&amount=${product.price}&productName=${product.name}`,
      {
        method: "POST"
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Payment failed");
        }

        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          return res.json();
        }

        throw new Error("Invalid card details");
      })
      .then((data) => {
        setResult(data);
        if (onRefresh) onRefresh();
      })
      .catch((err) =>
        setResult({
          status: "FAILED",
          amount: product.price,
          description: err.message || product.name,
          date: new Date()
        })
      );
  };

  {result && (
  <Card
    sx={{
      p: 3,
      borderRadius: 3,
      boxShadow: 6,
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
      {result.status === "PENDING" && "⏳ Payment Pending (Waiting for Admin Approval)"}
    </Typography>

    <Typography>Amount: ₹{result.amount}</Typography>
    <Typography>Product: {result.description}</Typography>
    <Typography>Date: {new Date(result.date).toLocaleString()}</Typography>
  </Card>
)}
}

export default Payment;