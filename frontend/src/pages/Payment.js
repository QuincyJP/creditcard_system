import { useState } from "react";
import { Typography, Card, Button } from "@mui/material";

function Payment({ product, onRefresh }) {
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [result, setResult] = useState(null);

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

  return (
    <div>
      <Typography variant="h6">Payment Page</Typography>

      {/* INPUTS (IMPORTANT: now state is actually used → fixes ESLint) */}
      <input
        placeholder="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />

      <input
        placeholder="PIN"
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <Button variant="contained" onClick={handlePay}>
        Pay ₹{product.price}
      </Button>

      {/* RESULT CARD */}
      {result && (
        <Card
          sx={{
            p: 3,
            mt: 2,
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
            {result.status === "PENDING" && "⏳ Payment Pending"}
          </Typography>

          <Typography>Amount: ₹{result.amount}</Typography>
          <Typography>Product: {result.description}</Typography>
          <Typography>
            Date: {new Date(result.date).toLocaleString()}
          </Typography>
        </Card>
      )}
    </div>
  );
}

export default Payment;