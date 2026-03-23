import { Box, Button, Typography, Grid, Card } from "@mui/material";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = () => {
    fetch("http://localhost:8080/api/applications/all")
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleProcess = async (id) => {
    // Call backend to process the application based on your calculation logic
    await fetch(`http://localhost:8080/api/applications/process/${id}`, {
      method: "POST",
    });

    // Refresh list after processing
    fetchApplications();
  };

  const hoverCardStyle = {
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
    }
  };

  return (
    <Box sx={{ padding: 3, minHeight: "100vh", background: "#f5f7fa" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Pending Applications: {applications.filter(a => a.status === "PENDING").length}
      </Typography>

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
              <Typography sx={{ mb: 2 }}><b>Status:</b> {app.status}</Typography>

              {app.status === "PENDING" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleProcess(app.id)}
                >
                  Process
                </Button>
              )}
            </Card>
          </Grid>
        ))}

        {applications.length === 0 && (
          <Typography>No applications found.</Typography>
        )}
      </Grid>
    </Box>
  );
}

export default AdminDashboard;