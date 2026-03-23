import { Box, Typography, Avatar, Menu, MenuItem, IconButton, Divider } from "@mui/material";
import { useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    if (onLogout) onLogout();
  };

  return (
    <Box
      sx={{
        height: 60,
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: "1px solid #ddd"
      }}
    >
      {/* Welcome text */}
      <Typography variant="h6">
        Welcome, {user?.name || "User"}!
      </Typography>

      {/* Avatar + Menu */}
      <IconButton onClick={handleClick} size="large">
        <Avatar sx={{ bgcolor: "#3B82F6" }}>
          {user?.name ? user.name.charAt(0) : <AccountCircleIcon />}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {/* Profile */}
        <MenuItem onClick={() => alert("Profile page coming soon!")}>
          View Profile
        </MenuItem>

        <Divider />

        {/* Role */}
        <MenuItem disabled>
          Role: {user?.role || "USER"}
        </MenuItem>

        {/* Logout */}
        <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Navbar;