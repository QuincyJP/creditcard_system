import { useState } from "react";
import { Box, Paper, Tabs, Tab, TextField, Button, Typography, Avatar, Alert } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function AuthPage({ setUser }) {
  const [tab, setTab] = useState(0); // 0=Login, 1=Register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setMessage({ text: "", type: "" });
  };

  const handleLogin = () => {
    fetch("https://credit-backend-rrsg.onrender.com/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data);
        setUser(data);
      })
      .catch(err => setMessage({ text: err.message, type: "error" }));
  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }
    fetch("https://credit-backend-rrsg.onrender.com/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })
      .then(res => res.text().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data);
        setMessage({ text: "Registration successful! Please login.", type: "success" });
        setTab(0);
        setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
      })
      .catch(err => setMessage({ text: err.message, type: "error" }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(120deg, #1E3A8A, #3B82F6)"
      }}
    >
      <Paper sx={{ p: 4, width: 380, borderRadius: 4, boxShadow: 8 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: "#3B82F6" }}>
            <AccountCircleIcon sx={{ fontSize: 60 }} />
          </Avatar>
        </Box>

        <Typography variant="h5" textAlign="center" mb={2}>
          {tab === 0 ? "Login" : "Create Account"}
        </Typography>

        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {tab === 1 && (
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {tab === 1 && (
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          )}

          {message.text && (
            <Alert severity={message.type}>{message.text}</Alert>
          )}

          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={tab === 0 ? handleLogin : handleRegister}
          >
            {tab === 0 ? "Login" : "Create Account"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AuthPage;