import { Box, Typography, Button, Grid, Card } from "@mui/material";

const products = [
  { name: "Laptop", price: 50000 },
  { name: "Phone", price: 20000 },
  { name: "Headphones", price: 2000 },
  { name: "Shoes", price: 3000 }
];

function Shop({ setSelectedProduct, setPage }) {
  return (
    <Box sx={{ padding: 3, background: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        🛒 Shop
      </Typography>

      <Grid container spacing={3}>
        {products.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 6,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "#fff"
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  ₹{item.price.toLocaleString()}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSelectedProduct(item);
                  setPage("payment");
                }}
              >
                Buy Now
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Shop;