import { useState, useEffect } from "react";
import { letterAPI } from "../services/api";

export default function LetterModule({ user }) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      setLoading(true);
      const response = await letterAPI.getLetters();
      setLetters(response.data);
    } catch (err) {
      setError("Gagal memuat surat");
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => {
    setSearch("");
    setFilterYear("");
    setFilterMonth("");
    setFilterDept("");
    setFilterType("");
  };

  const departments = ["Exbo", "Infairs", "Extions", "Mention", "Entra", "Sowelf", "Stufare", "Srd", "Stars"];

  const filtered = letters.filter((l) => {
    const date = l.created_at ? new Date(l.created_at) : new Date();
    const matchSearch = l.title?.toLowerCase().includes(search.toLowerCase());
    const matchYear = filterYear ? date.getFullYear() === parseInt(filterYear) : true;
    const matchMonth = filterMonth ? date.getMonth() + 1 === parseInt(filterMonth) : true;
    const matchDept = filterDept ? (l.department || "-") === filterDept : true;
    const matchType = filterType ? l.type === filterType : true;
    return matchSearch && matchYear && matchMonth && matchDept && matchType;
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
      {/* HEADER */}
      <div style={styles.header}>
        <h2>📄 Letter Module</h2>
        <div style={styles.profile}>
          <div style={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
          <div>
            <p style={styles.name}>{user.username}</p>
            <p style={styles.role}>{user.role}</p>
          </div>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* SUMMARY CARD */}
      <div style={styles.grid}>
        <SummaryCard title="Total Surat" value={letters.length} gradient="linear-gradient(135deg, #3b82f6, #60a5fa)" icon="📄" />
        <SummaryCard title="Masuk" value={letters.filter(l => l.type === "in").length} gradient="linear-gradient(135deg, #22c55e, #4ade80)" icon="📥" />
        <SummaryCard title="Keluar" value={letters.filter(l => l.type === "out").length} gradient="linear-gradient(135deg, #ef4444, #f87171)" icon="📤" />
      </div>

      {/* FILTER + SEARCH BAR */}
      <div style={styles.filterBar}>
        <input
          placeholder="🔍 Cari judul..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.filterInput}
        />
        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={styles.filterInput}>
          <option value="">Bulan</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} style={styles.filterInput}>
          <option value="">Tahun</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={styles.filterInput}>
          <option value="">Departemen</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={styles.filterInput}>
          <option value="">Jenis Surat</option>
          <option value="in">Masuk</option>
          <option value="out">Keluar</option>
        </select>
        <button onClick={resetFilter} style={styles.resetBtn}>Reset</button>
      </div>

      {/* TABLE */}
      <div style={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Judul</th>
                <th>Jenis</th>
                <th>Departemen</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>Tidak ada data</td>
                </tr>
              ) : (
                filtered.map((l, idx) => (
                  <tr key={l.id}>
                    <td>{idx + 1}</td>
                    <td>{l.title}</td>
                    <td>{l.type === "in" ? "Masuk" : "Keluar"}</td>
                    <td>{l.department || "-"}</td>
                    <td>{new Date(l.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* CARD COMPONENT */
function SummaryCard({ title, value, gradient, icon }) {
  return (
    <div style={{ ...styles.summaryCard, background: gradient }}>
      <p>{icon} {title}</p>
      <h2>{value}</h2>
    </div>
  );
}

/* STYLE */
const styles = {
  container: { padding: 30, background: "#f1f5f9", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  profile: { display: "flex", gap: 10, alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: "50%", background: "#3b82f6", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" },
  name: { margin: 0, fontWeight: "bold" },
  role: { margin: 0, fontSize: 12 },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20, marginBottom: 15 },
  summaryCard: { padding: 15, borderRadius: 12, color: "#fff" },

  filterBar: { display: "flex", gap: 6, marginBottom: 15, flexWrap: "wrap", alignItems: "center", maxWidth: "100%", overflowX: "auto" },
  filterInput: { padding: "6px 8px", borderRadius: 8, border: "1px solid #cbd5e1", minWidth: 80, flex: "1 1 auto" },
  resetBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", flex: "0 0 auto" },

  card: { background: "#fff", padding: 20, borderRadius: 12, overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  error: { background: "#fee2e2", padding: 10, borderRadius: 8, marginBottom: 10 },
};