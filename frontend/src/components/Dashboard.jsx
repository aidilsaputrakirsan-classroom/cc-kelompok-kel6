import { useState, useEffect } from "react";
import { financeAPI } from "../services/api";
import Navigation from "./Navigation";

export default function Dashboard({ user, onLogout }) {
  const [cashflow, setCashflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCashflow();
  }, []);

  const fetchCashflow = async () => {
    try {
      const response = await financeAPI.getCashflow();
      setCashflow(response.data);
    } catch (err) {
      setError("Failed to load cashflow");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  /* 🔥 DATA CHART (SEMENTARA) */
  const chartData = [
    { label: "Jan", value: 200000 },
    { label: "Feb", value: 350000 },
    { label: "Mar", value: 300000 },
    { label: "Apr", value: 500000 },
    { label: "Mei", value: 450000 },
  ];

  return (
    <div style={styles.layout}>
      <Navigation user={user} onLogout={onLogout} />

      <main style={styles.main}>
        {/* TOPBAR */}
        <div style={styles.topbar}>
          <h2 style={styles.topbarTitle}>Dashboard</h2>
          <div style={styles.profile}>
            <div>
              <p style={styles.name}>{user.username}</p>
              <p style={styles.role}>{user.role}</p>
            </div>
            <div style={styles.avatar}>
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          {error && <div style={styles.error}>{error}</div>}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={styles.grid}>
              <div style={styles.cardGreen}>
                <p>Pemasukan</p>
                <h2>{formatRupiah(cashflow?.total_income)}</h2>
              </div>
              <div style={styles.cardRed}>
                <p>Pengeluaran</p>
                <h2>{formatRupiah(cashflow?.total_expense)}</h2>
              </div>
              <div style={styles.cardBlue}>
                <p>Saldo</p>
                <h2>{formatRupiah(cashflow?.balance)}</h2>
              </div>
            </div>
          )}

          {/* QUICK ACCESS */}
          <div style={styles.card}>
            <h2>Quick Access</h2>
            <p>Use the navigation menu to access different modules:</p>
            <ul style={{ marginLeft: "20px" }}>
              {(user.role === "Bendahara" || user.role === "Ketua") && (
                <li>
                  <strong>Finance:</strong> Manage categories and transactions
                </li>
              )}
              {user.role !== "Bendahara" && (
                <li>
                  <strong>Finance:</strong> View financial reports (Read-only)
                </li>
              )}
              {(user.role === "Sekretaris" || user.role === "Ketua") && (
                <li>
                  <strong>Letters:</strong> Manage incoming and outgoing letters
                </li>
              )}
              {user.role !== "Sekretaris" && user.role !== "Ketua" && (
                <li>
                  <strong>Letters:</strong> View organization letters
                  (Read-only)
                </li>
              )}
              {user.role === "Ketua" && (
                <li>
                  <strong>Users:</strong> Manage organization members
                </li>
              )}
            </ul>
          </div>

          {/* PERMISSIONS */}
          <div style={styles.cardPermission}>
            <h2>Your Permissions</h2>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <div style={{ marginTop: "15px" }}>
              {user.role === "Ketua" && (
                <div>
                  <p>✓ View all financial reports</p>
                  <p>✓ Manage user accounts</p>
                  <p>✓ View all letters</p>
                </div>
              )}
              {user.role === "Bendahara" && (
                <div>
                  <p>✓ Create and manage categories</p>
                  <p>✓ Create and manage transactions</p>
                  <p>✓ View financial reports</p>
                </div>
              )}
              {user.role === "Sekretaris" && (
                <div>
                  <p>✓ Create and manage letters</p>
                  <p>✓ Auto-generate letter numbers</p>
                  <p>✓ View all letters</p>
                </div>
              )}
              {user.role === "Anggota" && (
                <div>
                  <p>✓ View financial reports</p>
                  <p>✓ View organization letters</p>
                  <p>✓ View member information</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#f1f5f9" },
  main: { flex: 1, marginLeft: 260 },
  topbar: {
    height: 70,
    background: "#1e3a8a",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    color: "#fff",
  },
  topbarTitle: { margin: 0, color: "#fff" },
  profile: { display: "flex", gap: 10, alignItems: "center" },
  name: { margin: 0, fontWeight: "bold" },
  role: { margin: 0, fontSize: 12, opacity: 0.7 },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: "50%",
    background: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  content: { padding: 30 },
  title: { marginBottom: 20 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
  },
  cardGreen: { background: "#ecfdf5", padding: 20, borderRadius: 15 },
  cardRed: { background: "#fef2f2", padding: 20, borderRadius: 15 },
  cardBlue: { background: "#eff6ff", padding: 20, borderRadius: 15 },
  card: { background: "#fff", padding: 20, borderRadius: 15, marginTop: 30 },
  cardPermission: {
    background: "#f8f9fa",
    padding: 20,
    borderRadius: 15,
    marginTop: 30,
    borderLeft: "4px solid #007bff",
  },
  error: {
    background: "#fef2f2",
    color: "#dc3545",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
};
