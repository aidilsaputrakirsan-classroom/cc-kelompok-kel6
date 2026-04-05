import { useState, useEffect } from "react";
import { financeAPI } from "../services/api";
import Navigation from "./Navigation";

export default function FinanceModule({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("transactions");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "income",
    categoryId: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transRes, catRes] = await Promise.all([
        financeAPI.getTransactions(),
        financeAPI.getCategories(),
      ]);
      setTransactions(transRes.data);
      setCategories(catRes.data);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await financeAPI.createCategory(formData.name, formData.type);
      fetchData();
      setShowModal(false);
      setFormData({
        name: "",
        type: "income",
        categoryId: "",
        amount: "",
        description: "",
      });
    } catch (err) {
      setError("Failed to add category");
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await financeAPI.createTransaction(
        formData.categoryId,
        parseFloat(formData.amount),
        formData.description,
        formData.type,
      );
      fetchData();
      setShowModal(false);
      setFormData({
        name: "",
        type: "income",
        categoryId: "",
        amount: "",
        description: "",
      });
    } catch (err) {
      setError("Failed to add transaction");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await financeAPI.deleteCategory(categoryId);
        fetchData();
      } catch (err) {
        setError("Failed to delete category");
      }
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await financeAPI.deleteTransaction(transactionId);
        fetchData();
      } catch (err) {
        setError("Failed to delete transaction");
      }
    }
  };

  /* 🔥 HITUNG TOTAL */
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((a, b) => a + parseFloat(b.amount), 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((a, b) => a + parseFloat(b.amount), 0)

  return (
<<<<<<< HEAD
    <div style={styles.wrapper}>

      <h1 style={styles.title}>💰 Keuangan</h1>

      {/* 🔥 SUMMARY */}
      <div style={styles.summary}>
        <div style={styles.card}>
          <p>Pemasukan</p>
          <h3 style={{ color: '#22c55e' }}>{formatRupiah(totalIncome)}</h3>
        </div>

        <div style={styles.card}>
          <p>Pengeluaran</p>
          <h3 style={{ color: '#ef4444' }}>{formatRupiah(totalExpense)}</h3>
        </div>

        <div style={styles.card}>
          <p>Saldo</p>
          <h3 style={{ color: '#3b82f6' }}>
            {formatRupiah(totalIncome - totalExpense)}
          </h3>
        </div>
      </div>

      {/* 🔥 TAB */}
      <div style={styles.tabs}>
        <Tab active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')}>
          Transaksi
        </Tab>

        <Tab active={activeTab === 'categories'} onClick={() => setActiveTab('categories')}>
          Kategori
        </Tab>
      </div>

      {/* 🔥 TABLE */}
      <div style={styles.tableCard}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Jumlah</th>
                <th>Tipe</th>
                <th>Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {(activeTab === 'transactions' ? transactions : categories).map((item) => (
                <tr key={item.id} style={styles.row}>
                  <td>{item.id}</td>
                  <td>{item.name || item.description}</td>
                  <td>{item.amount ? formatRupiah(item.amount) : '-'}</td>

                  <td>
                    <span style={{
                      ...styles.badge,
                      background: item.type === 'income' ? '#22c55e' : '#ef4444'
                    }}>
                      {item.type}
                    </span>
                  </td>

                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
=======
    <div style={styles.layout}>
      <Navigation user={user} onLogout={onLogout} />

      <main style={styles.main}>
        {/* TOPBAR */}
        <div style={styles.topbar}>
          <h2 style={styles.topbarTitle}>Finance Module</h2>
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

          {/* TABS */}
          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab("transactions")}
              style={{
                ...styles.tab,
                ...(activeTab === "transactions" && styles.tabActive),
              }}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              style={{
                ...styles.tab,
                ...(activeTab === "categories" && styles.tabActive),
              }}
            >
              Categories
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : activeTab === "transactions" ? (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={{ margin: 0 }}>Transactions</h2>
                {user?.role === "Bendahara" && (
                  <button
                    style={styles.btnPrimary}
                    onClick={() => {
                      setModalType("transaction");
                      setShowModal(true);
                    }}
                  >
                    + Add Transaction
                  </button>
                )}
              </div>
              {transactions.length === 0 ? (
                <p>No transactions</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Description</th>
                      <th style={styles.th}>Created At</th>
                      {user?.role === "Bendahara" && (
                        <th style={styles.th}>Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.id} style={styles.tr}>
                        <td style={styles.td}>{t.id}</td>
                        <td style={styles.td}>
                          Rp {parseFloat(t.amount).toLocaleString("id-ID")}
                        </td>
                        <td style={styles.td}>
                          <span
                            style={
                              t.type === "income"
                                ? styles.badgeGreen
                                : styles.badgeRed
                            }
                          >
                            {t.type}
                          </span>
                        </td>
                        <td style={styles.td}>{t.description}</td>
                        <td style={styles.td}>
                          {new Date(t.created_at).toLocaleDateString()}
                        </td>
                        {user?.role === "Bendahara" && (
                          <td style={styles.td}>
                            <button
                              style={styles.btnDanger}
                              onClick={() => handleDeleteTransaction(t.id)}
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={{ margin: 0 }}>Categories</h2>
                {user?.role === "Bendahara" && (
                  <button
                    style={styles.btnPrimary}
                    onClick={() => {
                      setModalType("category");
                      setShowModal(true);
                    }}
                  >
                    + Add Category
                  </button>
                )}
              </div>
              {categories.length === 0 ? (
                <p>No categories</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Created At</th>
                      {user?.role === "Bendahara" && (
                        <th style={styles.th}>Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id} style={styles.tr}>
                        <td style={styles.td}>{c.id}</td>
                        <td style={styles.td}>{c.name}</td>
                        <td style={styles.td}>
                          <span
                            style={
                              c.type === "income"
                                ? styles.badgeGreen
                                : styles.badgeRed
                            }
                          >
                            {c.type}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        {user?.role === "Bendahara" && (
                          <td style={styles.td}>
                            <button
                              style={styles.btnDanger}
                              onClick={() => handleDeleteCategory(c.id)}
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>
>>>>>>> a4c0d573e457b7fa2f624bc3196c1736af537a0c

      {/* MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>
              {modalType === "category" ? "Add Category" : "Add Transaction"}
            </h2>
            <form
              onSubmit={
                modalType === "category"
                  ? handleAddCategory
                  : handleAddTransaction
              }
            >
              {modalType === "category" ? (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Name</label>
                    <input
                      style={styles.input}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Type</label>
                    <select
                      style={styles.input}
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Category</label>
                    <select
                      style={styles.input}
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Amount</label>
                    <input
                      style={styles.input}
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      step="0.01"
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea
                      style={styles.input}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Type</label>
                    <select
                      style={styles.input}
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                </>
              )}
              <div style={styles.modalFooter}>
                <button
                  type="button"
                  style={styles.btnGray}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.btnPrimary}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🔥 TAB COMPONENT */
function Tab({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        background: active ? '#3b82f6' : '#e2e8f0',
        color: active ? '#fff' : '#1e293b',
        transition: '0.2s'
      }}
    >
      {children}
    </button>
  )
}

/* 🔥 STYLES */
const styles = {
<<<<<<< HEAD
  wrapper: {
    padding: 30
=======
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
>>>>>>> a4c0d573e457b7fa2f624bc3196c1736af537a0c
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
<<<<<<< HEAD

  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
    marginBottom: 20
  },

  card: {
    background: '#fff',
    padding: 20,
    borderRadius: 15,
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
    transition: '0.2s'
  },

  tabs: {
    display: 'flex',
    gap: 10,
    marginBottom: 20
  },

  tableCard: {
    background: '#fff',
    padding: 20,
    borderRadius: 15,
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  row: {
    transition: '0.2s'
  },

  badge: {
    color: '#fff',
    padding: '5px 10px',
=======
  content: { padding: 30 },
  tabs: { marginBottom: 20, display: "flex", gap: 10 },
  tab: {
    padding: "10px 20px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#cbd5e1",
    color: "#1e3a8a",
    fontWeight: "bold",
  },
  tabActive: { background: "#3b82f6", color: "#fff" },
  card: { background: "#fff", borderRadius: 15, padding: 20 },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f1f5f9" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: 600,
    color: "#475569",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 16px", color: "#334155" },
  badgeGreen: {
    background: "#dcfce7",
    color: "#16a34a",
    padding: "2px 10px",
>>>>>>> a4c0d573e457b7fa2f624bc3196c1736af537a0c
    borderRadius: 20,
    fontSize: 12,
  },
  badgeRed: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "2px 10px",
    borderRadius: 20,
    fontSize: 12,
  },
  btnPrimary: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
  },
  btnDanger: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnGray: {
    background: "#94a3b8",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
  },
  error: {
    background: "#fef2f2",
    color: "#dc3545",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalBox: { background: "#fff", borderRadius: 15, padding: 30, width: 420 },
  modalTitle: { marginBottom: 20, color: "#1e3a8a" },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  formGroup: { marginBottom: 15 },
  label: {
    display: "block",
    marginBottom: 5,
    fontWeight: 600,
    color: "#475569",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    boxSizing: "border-box",
  },
};
