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

  return (
    <div style={styles.wrapper}>
      
      <h1 style={styles.title}>Finance</h1>

      {/* TAB */}
      <div style={styles.tabs}>
        <button
          style={activeTab === 'transactions' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('transactions')}
        >
          Transaksi
        </button>

        <button
          style={activeTab === 'categories' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('categories')}
        >
          Kategori
        </button>
      </div>

      {/* CARD */}
      <div style={styles.card}>
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
                <tr key={item.id}>
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

const styles = {
  wrapper: {
    padding: 30,
    background: '#f8fafc',
    minHeight: '100vh'
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },

  tabs: {
    display: 'flex',
    gap: 10,
    marginBottom: 20
  },

  tab: {
    padding: '10px 20px',
    background: '#e2e8f0',
    borderRadius: 10,
    border: 'none'
  },

  activeTab: {
    padding: '10px 20px',
    background: '#3b82f6',
    color: '#fff',
    borderRadius: 10,
    border: 'none'
  },

  card: {
    background: '#fff',
    padding: 20,
    borderRadius: 15,
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  badge: {
    color: '#fff',
    padding: '5px 10px',
    borderRadius: 20,
    fontSize: 12
  }
}