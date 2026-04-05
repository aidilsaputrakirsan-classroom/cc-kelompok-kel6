import { useState, useEffect } from "react";
import { financeAPI } from "../services/api";

export default function FinanceModule({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDept, setFilterDept] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // sementara tunggu backend
      setTransactions([]);
    } catch (err) {
      setError("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => {
    setSearch("");
    setFilterYear("");
    setFilterMonth("");
    setFilterType("");
    setFilterDept("");
  };

  const departments = [
    "Exbo",
    "Infairs",
    "Extions",
    "Mention",
    "Entra",
    "Sowelf",
    "Stufare",
    "Srd",
    "Stars",
  ];

  const filtered = transactions.filter((t) => {
    const date = t.created_at ? new Date(t.created_at) : new Date();
    const matchSearch = t.description?.toLowerCase().includes(search.toLowerCase());
    const matchYear = filterYear ? date.getFullYear() === parseInt(filterYear) : true;
    const matchMonth = filterMonth ? date.getMonth() + 1 === parseInt(filterMonth) : true;
    const matchType = filterType ? t.type === filterType : true;
    const dept = t.department || "-";
    const matchDept = filterDept ? dept === filterDept : true;

    return matchSearch && matchYear && matchMonth && matchType && matchDept;
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2013 + 1 }, (_, i) => 2013 + i);
  const months = [
    { value: "1", label: "Jan" },
    { value: "2", label: "Feb" },
    { value: "3", label: "Mar" },
    { value: "4", label: "Apr" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Jun" },
    { value: "7", label: "Jul" },
    { value: "8", label: "Agu" },
    { value: "9", label: "Sep" },
    { value: "10", label: "Okt" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Des" },
  ];

  return (
    <div style={styles.container}>
      {/* HEADER PROFIL */}
      <div style={styles.header}>
        <h2>💰 Finance Module</h2>
        <div style={styles.profile}>
          <div style={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
          <div>
            <p style={styles.username}>{user.username}</p>
            <p style={styles.role}>{user.role}</p>
          </div>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* FILTER BAR */}
      <div style={styles.filterBar}>
        <input
          placeholder="🔍 Cari..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          style={styles.input}
        >
          <option value="">Tahun</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          style={styles.input}
        >
          <option value="">Bulan</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={styles.input}
        >
          <option value="">Kategori</option>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>

        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          style={styles.input}
        >
          <option value="">Departemen</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <button onClick={resetFilter} style={styles.resetBtn}>Reset</button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Jumlah</th>
                <th>Kategori</th>
                <th>Departemen</th>
                <th>Deskripsi</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>Tidak ada data</td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>Rp {parseFloat(t.amount).toLocaleString("id-ID")}</td>
                    <td>
                      <span style={t.type === "income" ? styles.income : styles.expense}>
                        {t.type === "income" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </td>
                    <td>{t.department || "-"}</td>
                    <td>{t.description}</td>
                    <td>{t.created_at ? new Date(t.created_at).toLocaleDateString() : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* STYLING SESUAI DASHBOARD */
const styles = {
  container: { padding: 30, background: "#f1f5f9", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  profile: { display: "flex", gap: 10, background: "#fff", padding: "8px 12px", borderRadius: 12 },
  avatar: { width: 40, height: 40, borderRadius: "50%", background: "#3b82f6", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" },
  username: { margin: 0, fontWeight: "bold" },
  role: { margin: 0, fontSize: 12, color: "#64748b" },
  filterBar: { display: "flex", gap: 10, marginBottom: 20, alignItems: "center", flexWrap: "nowrap", overflowX: "auto" },
  input: { padding: "8px 10px", borderRadius: 12, border: "1px solid #cbd5e1", minWidth: 120 },
  resetBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 12, cursor: "pointer" },
  card: { background: "#fff", padding: 20, borderRadius: 16, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" },
  table: { width: "100%", borderCollapse: "collapse" },
  income: { background: "#dcfce7", color: "#16a34a", padding: "3px 10px", borderRadius: 12 },
  expense: { background: "#fee2e2", color: "#dc2626", padding: "3px 10px", borderRadius: 12 },
  error: { background: "#fee2e2", padding: 10, borderRadius: 8, marginBottom: 10 },
};