import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa"
      }}
    >
      <Box
        sx={{
          background: "white",
          padding: 5,
          borderRadius: 3,
          boxShadow: 3,
          textAlign: "center"
        }}
      >
        <Typography variant="h4" gutterBottom>
          💳 Credit Card System
        </Typography>

        <Typography>Select Login</Typography>

        <Box sx={{ marginTop: 3 }}>
          <Button
            variant="contained"
            sx={{ margin: 1 }}
            onClick={() => navigate("/user")}
          >
            User Login
          </Button>

          <Button
            variant="outlined"
            sx={{ margin: 1 }}
            onClick={() => navigate("/admin")}
          >
            Admin Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;