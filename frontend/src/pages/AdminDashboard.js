import { Box, Button, Typography, Grid, Card } from "@mui/material";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // 🔹 FETCH APPLICATIONS
  const fetchApplications = () => {
    fetch("https://credit-backend-rrsg.onrender.com/api/applications/all")
      .then(res => res.json())
      .then(data => {
        let formattedData = Array.isArray(data) ? data : [data];
        setApplications(formattedData);
      })
      .catch(err => console.error(err));
  };

  // 🔹 FETCH TRANSACTIONS (PENDING ONLY)
  const fetchTransactions = () => {
    fetch("https://credit-backend-rrsg.onrender.com/api/transactions/all") // TEMP USER
      .then(res => res.json())
      .then(data => {
        const pending = data.filter(t => t && t.status === "PENDING");
        setTransactions(pending);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
    fetchTransactions();
  }, []);

  // 🔹 PROCESS APPLICATION
  const handleProcess = async (id) => {
    setProcessingId(id);

    await fetch(`https://credit-backend-rrsg.onrender.com/api/applications/process/${id}`, {
      method: "POST",
    });

    setProcessingId(null);
    fetchApplications();
  };

  // 🔹 APPROVE TRANSACTION
  const handleApprove = async (id) => {
    await fetch(`https://credit-backend-rrsg.onrender.com/api/transactions/approve/${id}`, {
      method: "POST"
    });
    fetchTransactions();
  };

  // 🔹 REJECT TRANSACTION
  const handleReject = async (id) => {
    await fetch(`https://credit-backend-rrsg.onrender.com/api/transactions/reject/${id}`, {
      method: "POST"
    });
    fetchTransactions();
  };

  // 🔹 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const hoverCardStyle = {
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
    }
  };

  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3, minHeight: "100vh", background: "#f5f7fa" }}>
      
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* ================= APPLICATION SECTION ================= */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Credit Card Applications
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Pending Applications: {applications.filter(a => a.status === "PENDING").length}
      </Typography>

      <Grid container spacing={3}>
        {applications.map(app => (
          <Grid item xs={12} md={6} key={app.id}>
            <Card sx={{ p: 3, borderRadius: 3, ...hoverCardStyle }}>
              <Typography><b>User ID:</b> {app.userId}</Typography>
              <Typography><b>Income:</b> ₹{app.income}</Typography>
              <Typography><b>EMI:</b> ₹{app.monthlyEMI}</Typography>
              <Typography><b>Score:</b> {app.calculatedScore}</Typography>

              <Typography sx={{
                fontWeight: "bold",
                color:
                  app.status === "APPROVED" ? "green" :
                  app.status === "REJECTED" ? "red" : "orange"
              }}>
                Status: {app.status}
              </Typography>

              {app.status === "PENDING" && (
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => handleProcess(app.id)}
                  disabled={processingId === app.id}
                >
                  {processingId === app.id ? "Processing..." : "Process"}
                </Button>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= TRANSACTION SECTION ================= */}
      <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
        Pending Transactions
      </Typography>

      {transactions.length === 0 && (
        <Typography>No pending transactions</Typography>
      )}

      <Grid container spacing={3}>
        {transactions.map(t => (
          <Grid item xs={12} md={6} key={t.id}>
            <Card sx={{ p: 3, borderRadius: 3, ...hoverCardStyle }}>
              <Typography><b>User ID:</b> {t.userId}</Typography>
              <Typography><b>Card:</b> {t.cardNumber}</Typography>
              <Typography><b>Amount:</b> ₹{t.amount}</Typography>
              <Typography><b>Description:</b> {t.description}</Typography>

              <Typography sx={{ color: "orange", fontWeight: "bold" }}>
                Status: {t.status}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mr: 2 }}
                  onClick={() => handleApprove(t.id)}
                >
                  Approve
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleReject(t.id)}
                >
                  Reject
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

    </Box>
  );
}

export default AdminDashboard;