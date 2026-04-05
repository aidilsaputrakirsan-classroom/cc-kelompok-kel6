import { useState, useEffect } from 'react'
import { financeAPI } from '../services/api'

export default function FinanceModule({ user }) {
  const [activeTab, setActiveTab] = useState('transactions')
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [t, c] = await Promise.all([
        financeAPI.getTransactions(),
        financeAPI.getCategories()
      ])
      setTransactions(t.data)
      setCategories(c.data)
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (val) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(val || 0)

  /* 🔥 HITUNG TOTAL */
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((a, b) => a + parseFloat(b.amount), 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((a, b) => a + parseFloat(b.amount), 0)

  return (
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

    </div>
  )
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
  wrapper: {
    padding: 30
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },

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
    borderRadius: 20,
    fontSize: 12
  }
}