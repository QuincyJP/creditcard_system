import { Box, Typography, List, ListItemButton, ListItemText } from "@mui/material";
import CreditScoreIcon from '@mui/icons-material/CreditScore'; // optional icon

function Sidebar({ setPage, activePage }) {
  const menuItems = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Apply Card", key: "apply" },
    { label: "Shop", key: "shop" },
    { label: "My Cards", key: "cards" },
    { label: "Transactions", key: "transactions" },
    { label: "Billing", key: "billing" }
  ];

  return (
    <Box
      sx={{
        width: 220,
        height: "100vh",
        background: "linear-gradient(180deg, #1E3A8A, #1E40AF)",
        color: "white",
        padding: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo / Brand */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1 }}>
        <CreditScoreIcon fontSize="large" />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Credit System
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1 }}>
        {menuItems.map(item => (
          <ListItemButton
            key={item.key}
            onClick={() => setPage(item.key)}
            sx={{
              mb: 1,
              borderRadius: 2,
              backgroundColor: activePage === item.key ? "rgba(255,255,255,0.15)" : "transparent",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      {/* Footer / Version */}
      <Typography variant="caption" sx={{ mt: 2, opacity: 0.7 }}>
        v1.0.0
      </Typography>
    </Box>
  );
}

export default Sidebar;