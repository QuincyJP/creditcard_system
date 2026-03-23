import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

function ApplyCard({ user }) {
  const [form, setForm] = useState({
    income: "",
    employmentType: "",
    existingLoans: "",
    monthlyEMI: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user || !user.id) {
      setMessage("❌ User not logged in");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/applications/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          income: Number(form.income),
          employmentType: form.employmentType,
          existingLoans: Number(form.existingLoans),
          monthlyEMI: Number(form.monthlyEMI)
        })
      });

      if (res.ok) {
        setMessage("✅ Application submitted successfully");
        setForm({
          income: "",
          employmentType: "",
          existingLoans: "",
          monthlyEMI: ""
        });
      } else {
        setMessage("❌ Error submitting application");
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Apply for Credit Card
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300 }}>

        <TextField name="income" label="Monthly Income" value={form.income} onChange={handleChange} />
        <TextField name="employmentType" label="Employment Type" value={form.employmentType} onChange={handleChange} />
        <TextField name="existingLoans" label="Existing Loans" value={form.existingLoans} onChange={handleChange} />
        <TextField name="monthlyEMI" label="Monthly EMI" value={form.monthlyEMI} onChange={handleChange} />

        <Button variant="contained" onClick={handleSubmit}>
          Submit Application
        </Button>

        <Typography>{message}</Typography>
      </Box>
    </Box>
  );
}

export default ApplyCard;