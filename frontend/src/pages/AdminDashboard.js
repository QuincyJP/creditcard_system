import { Box, Button, Typography, Grid, Card } from "@mui/material";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchApplications = () => {
    setLoading(true);

    fetch("https://credit-backend-rrsg.onrender.com/api/applications/all")
      .then(res => res.json())
      .then(data => {
        console.log("APPLICATIONS:", data);

        let formattedData = [];

        if (Array.isArray(data)) {
          formattedData = data;
        } else if (data) {
          formattedData = [data];
        }

        setApplications(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleProcess = async (id) => {
    setProcessingId(id);

    await fetch(`https://credit-backend-rrsg.onrender.com/api/applications/process/${id}`, {
      method: "POST",
    });

    setProcessingId(null);
    fetchApplications();
  };

  const hoverCardStyle = {
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
    }
  };

  // 🔥 Loading UI
  if (loading) {
    return (
      <Typography sx={{ padding: 3 }}>
        Loading applications...
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 3, minHeight: "100vh", background: "#f5f7fa" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {/* Analytics Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h4">
              {applications.length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Pending</Typography>
            <Typography variant="h4" color="orange">
              {applications.filter(a => a?.status === "PENDING").length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Approved</Typography>
            <Typography variant="h4" color="green">
              {applications.filter(a => a?.status === "APPROVED").length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Rejected</Typography>
            <Typography variant="h4" color="red">
              {applications.filter(a => a?.status === "REJECTED").length}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Approval Rate */}
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Approval Rate:{" "}
        {applications.length > 0
          ? (
              (applications.filter(a => a?.status === "APPROVED").length /
                applications.length) *
              100
            ).toFixed(1)
          : 0}
        %
      </Typography>

      {/* Existing Applications List */}
      <Grid container spacing={3}>
        {applications.map(app => (
          <Grid item xs={12} md={6} key={app.id}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 2,
                background: "#fff",
                ...hoverCardStyle
              }}
            >
              <Typography><b>User ID:</b> {app.userId}</Typography>
              <Typography><b>Income:</b> ₹{app.income}</Typography>
              <Typography><b>EMI:</b> ₹{app.monthlyEMI}</Typography>
              <Typography><b>Score:</b> {app.calculatedScore}</Typography>

              <Typography
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color:
                    app.status === "APPROVED"
                      ? "green"
                      : app.status === "REJECTED"
                      ? "red"
                      : "orange"
                }}
              >
                Status: {app.status}
              </Typography>

              {app.status === "PENDING" && (
                <Button
                  variant="contained"
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
    </Box>
  );
}

export default AdminDashboard;