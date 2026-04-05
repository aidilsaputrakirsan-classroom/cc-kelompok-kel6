import { useState, useEffect, useRef } from "react";
import { financeAPI } from "../services/api";

export default function Dashboard({ user }) {
  const [cashflow, setCashflow] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canvasRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      drawChart();
    }
  }, [transactions]);

  const fetchData = async () => {
    try {
      const cash = await financeAPI.getCashflow();
      const trx = await financeAPI.getTransactions(); // pastikan ada API ini

      setCashflow(cash.data);
      setTransactions(trx.data);
    } catch (err) {
      setError("Gagal memuat data");
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

  /* =========================
     📊 LOGIC CHART
  ========================= */
  const processMonthlyData = () => {
    const months = Array(12).fill(0).map(() => ({
      income: 0,
      expense: 0,
    }));

    transactions.forEach((t) => {
      const date = new Date(t.created_at);
      const m = date.getMonth();

      if (t.type === "income") months[m].income += t.amount;
      else months[m].expense += t.amount;
    });

    return months;
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const data = processMonthlyData();

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const maxVal = Math.max(
      ...data.map((d) => Math.max(d.income, d.expense)),
      1
    );

    const barWidth = 20;
    const gap = 15;

    data.forEach((d, i) => {
      const x = i * (barWidth * 2 + gap) + 30;

      const incomeHeight = (d.income / maxVal) * 200;
      const expenseHeight = (d.expense / maxVal) * 200;

      // income (hijau)
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(x, height - incomeHeight - 30, barWidth, incomeHeight);

      // expense (merah)
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(
        x + barWidth + 5,
        height - expenseHeight - 30,
        barWidth,
        expenseHeight
      );

      // label bulan
      ctx.fillStyle = "#334155";
      ctx.font = "10px sans-serif";
      ctx.fillText(i + 1, x, height - 10);
    });
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.emoji}>👋</span>
          <div>
            <h2 style={styles.title}>Halo, {user.username}</h2>
            <p style={styles.subtitle}>Selamat datang di SIKASI</p>
          </div>
        </div>

        {/* PROFIL ATAS */}
        <div style={styles.profile}>
          <div style={styles.avatar}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={styles.username}>{user.username}</p>
            <p style={styles.role}>{user.role}</p>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && <div style={styles.error}>{error}</div>}

      {/* SUMMARY */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.grid}>
          <SummaryCard
            title="Pemasukan"
            value={formatRupiah(cashflow?.total_income)}
            gradient="linear-gradient(135deg, #22c55e, #4ade80)"
            icon="💰"
          />
          <SummaryCard
            title="Pengeluaran"
            value={formatRupiah(cashflow?.total_expense)}
            gradient="linear-gradient(135deg, #ef4444, #f87171)"
            icon="💸"
          />
          <SummaryCard
            title="Saldo"
            value={formatRupiah(cashflow?.balance)}
            gradient="linear-gradient(135deg, #3b82f6, #60a5fa)"
            icon="📊"
          />
        </div>
      )}

      {/* 📊 CHART */}
      <div style={styles.card}>
        <h3>📊 Grafik Keuangan Bulanan</h3>
        <canvas ref={canvasRef} width={600} height={300}></canvas>

        <div style={{ marginTop: 10, fontSize: 12 }}>
          <span style={{ color: "#22c55e" }}>■ Pemasukan</span> &nbsp;
          <span style={{ color: "#ef4444" }}>■ Pengeluaran</span>
        </div>
      </div>

      {/* QUICK ACCESS */}
      <div style={styles.card}>
        <h3>⚡ Quick Access</h3>
        <div style={styles.list}>
          <HoverItem>💰 Kelola Keuangan</HoverItem>
          <HoverItem>📄 Lihat Surat</HoverItem>
        </div>
      </div>
    </div>
  );
}

/* CARD */
function SummaryCard({ title, value, gradient, icon }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles.summaryCard,
        background: gradient,
        transform: hover ? "translateY(-8px)" : "none",
      }}
    >
      <p>{icon} {title}</p>
      <h2>{value}</h2>
    </div>
  );
}

/* HOVER */
function HoverItem({ children }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles.listItem,
        background: hover ? "#e0f2fe" : "#f8fafc",
      }}
    >
      {children}
    </div>
  );
}

/* STYLE */
const styles = {
  container: { padding: 30, background: "#f1f5f9", minHeight: "100vh" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  headerLeft: { display: "flex", gap: 10, alignItems: "center" },
  emoji: { fontSize: 28 },

  profile: {
    display: "flex",
    gap: 10,
    background: "#fff",
    padding: "8px 12px",
    borderRadius: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#3b82f6",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    marginBottom: 30,
  },

  summaryCard: {
    padding: 20,
    borderRadius: 16,
    color: "#fff",
    transition: "0.3s",
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },

  list: { display: "flex", flexDirection: "column", gap: 10 },
  listItem: { padding: 10, borderRadius: 10 },

  error: {
    background: "#fee2e2",
    padding: 10,
    borderRadius: 8,
  },
};