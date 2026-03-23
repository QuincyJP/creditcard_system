import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

import AuthPage from "./pages/AuthPage";          // Combined login/register page
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [user, setUser] = useState(null); // stores logged-in user

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          {/* If user is not logged in, show AuthPage */}
          {!user && <Route path="*" element={<AuthPage setUser={setUser} />} />}

          {/* Logged in routes */}
          {user?.role === "USER" && (
            <Route path="/user" element={<UserDashboard user={user} setUser={setUser}/>} />
          )}
          {user?.role === "ADMIN" && (
            <Route path="/admin" element={<AdminDashboard user={user} />} />
          )}

          {/* Redirect unknown paths to correct dashboard */}
          {user && (
            <Route
              path="*"
              element={
                <Navigate
                  to={user.role === "USER" ? "/user" : "/admin"}
                  replace
                />
              }
            />
          )}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;