import { Box, Typography, Grid, Card, Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PieChartIcon from '@mui/icons-material/PieChart';

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ApplyCard from "./ApplyCard";
import MyCard from "./MyCard";
import Shop from "./Shop";
import Payment from "./Payment";
import Transaction from "./Transaction";
import Billing from "./Billing";

function UserDashboard({ user, setUser }) {
  const [page, setPage] = useState("dashboard");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch user's cards
  useEffect(() => {
    console.log("Fetching cards for user:", user.id);

    fetch(`https://credit-backend-rrsg.onrender.com/api/cards/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        console.log("CARDS DATA:", data);
        setCards(data);
      })
      .catch(err => console.error("Error fetching cards:", err));
  }, [user, refreshKey]);

  useEffect(() => {
    console.log("Fetching transactions for user:", user.id);

    fetch(`https://credit-backend-rrsg.onrender.com/api/transactions/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        console.log("TRANSACTION DATA:", data);

        let formattedData = [];
        if (Array.isArray(data)) formattedData = data;
        else if (data) formattedData = [data];

        formattedData = formattedData.filter(t => t && t.amount && t.date);

        setTransactions(formattedData);
      })
      .catch(err => console.error("Error fetching transactions:", err));
  }, [user, refreshKey]);

  const totalSpent = cards.reduce((acc, c) => acc + (c.creditLimit - c.availableLimit), 0);
  const totalLimit = cards.reduce((acc, c) => acc + c.creditLimit, 1);
  const creditUtilization = cards.length > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  const hoverCardStyle = {
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f5f7fa" }}>
      <Sidebar setPage={setPage} />

      <Box sx={{ flex: 1 }}>
        <Navbar user={user} onLogout={() => setUser(null)} />

        <Box sx={{ padding: 3 }}>
          {page === "dashboard" && (
            <>
              {/* Welcome & Avatar */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Welcome, {user.name}!
                </Typography>
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  {user.name.charAt(0)}
                </Avatar>
              </Box>

              {/* Analytics Cards */}
              <Grid container spacing={3} mb={4}>
                {/* Total Spent */}
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e3f2fd', ...hoverCardStyle }}
                  >
                    <AttachMoneyIcon color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Total Spent</Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 600 }}>
                        ₹{totalSpent.toLocaleString()}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                {/* Credit Utilization */}
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff3e0', ...hoverCardStyle }}
                  >
                    <PieChartIcon color="secondary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Credit Utilization</Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 600 }}>
                        {creditUtilization}%
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                {/* Number of Cards */}
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e8f5e9', ...hoverCardStyle }}
                  >
                    <CreditCardIcon color="action" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Number of Cards</Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 600 }}>
                        {cards.length}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              {/* Recent Transactions Preview */}
              <Box mb={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>Recent Transactions</Typography>
                {transactions.length > 0 ? (
                  transactions.slice(0, 5).map((t, i) => (
                    <Card
                      key={i}
                      sx={{
                        p: 2,
                        mb: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        ...hoverCardStyle
                      }}
                    >
                      <Box>
                        <Typography>{t.description}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(t.date).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          color: t.status === "SUCCESS" ? "green" : "red",
                          fontWeight: "bold"
                        }}
                      >
                        ₹{t.amount.toLocaleString()}
                      </Typography>
                    </Card>
                  ))
                ) : (
                  <Typography>No recent transactions</Typography>
                )}
              </Box>

              {/* Quick Actions */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{ p: 3, textAlign: "center", cursor: "pointer", borderRadius: 3, boxShadow: "0 3px 10px rgba(0,0,0,0.08)", ...hoverCardStyle }}
                      onClick={() => setPage("apply")}
                    >
                      Apply Card
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{ p: 3, textAlign: "center", cursor: "pointer", borderRadius: 3, boxShadow: "0 3px 10px rgba(0,0,0,0.08)", ...hoverCardStyle }}
                      onClick={() => setPage("shop")}
                    >
                      Shop
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{ p: 3, textAlign: "center", cursor: "pointer", borderRadius: 3, boxShadow: "0 3px 10px rgba(0,0,0,0.08)", ...hoverCardStyle }}
                      onClick={() => setPage("cards")}
                    >
                      My Cards
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}

          {page === "apply" && <ApplyCard user={user} />}
          {page === "shop" && <Shop setSelectedProduct={setSelectedProduct} setPage={setPage} />}
          {page === "payment" && selectedProduct && <Payment product={selectedProduct} onRefresh={() => setRefreshKey(p => p + 1)} />}
          {page === "cards" && <MyCard user={user} refreshKey={refreshKey}/>}
          {page === "transactions" && <Transaction user={user} refreshKey={refreshKey}/>}
          {page === "billing" && <Billing user={user} refreshKey={refreshKey}/>}
        </Box>
      </Box>
    </Box>
  );
}

export default UserDashboard;