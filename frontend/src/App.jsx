import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { authAPI } from "./services/api";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import FinanceModule from "./components/FinanceModule";
import LetterModule from "./components/LetterModule";
import UserManagement from "./components/UserManagement";
import Navigation from "./components/Navigation";

/* 🔥 LAYOUT WRAPPER */
function Layout({ user, onLogout, children }) {
  return (
    <div style={{ display: "flex" }}>
      {/* SIDEBAR */}
      <Navigation user={user} onLogout={onLogout} />

      {/* CONTENT */}
      <div style={{ marginLeft: 260, width: "100%" }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authAPI
        .getMe()
        .then((response) => setUser(response.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (data) => {
    const { access_token, user: userData } = data;
    localStorage.setItem("token", access_token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        <p>Mohon tunggu, sedang memuat SIKASI...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            !user ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Dashboard user={user} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* FINANCE */}
        <Route
          path="/finance"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <FinanceModule user={user} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* LETTER */}
        <Route
          path="/letter"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <LetterModule user={user} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* USERS (KHUSUS KETUA) */}
        <Route
          path="/users"
          element={
            user?.role === "Ketua" ? (
              <Layout user={user} onLogout={handleLogout}>
                <UserManagement user={user} />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;