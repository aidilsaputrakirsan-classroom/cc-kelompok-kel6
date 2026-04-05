import { useState, useEffect } from 'react'
import { financeAPI } from '../services/api'

export default function Dashboard({ user }) {
  const [cashflow, setCashflow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCashflow()
  }, [])

  const fetchCashflow = async () => {
    try {
      const response = await financeAPI.getCashflow()
      setCashflow(response.data)
    } catch (err) {
      setError('Failed to load cashflow')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Welcome, {user.username}!</h1>
      <p>Role: <strong>{user.role}</strong></p>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
          <div className="card">
            <h3>Total Income</h3>
            <p style={{ fontSize: '24px', color: '#28a745', fontWeight: 'bold' }}>
              Rp {parseFloat(cashflow?.total_income || 0).toLocaleString('id-ID')}
            </p>
          </div>

          <div className="card">
            <h3>Total Expense</h3>
            <p style={{ fontSize: '24px', color: '#dc3545', fontWeight: 'bold' }}>
              Rp {parseFloat(cashflow?.total_expense || 0).toLocaleString('id-ID')}
            </p>
          </div>

          <div className="card">
            <h3>Balance</h3>
            <p style={{ fontSize: '24px', color: '#007bff', fontWeight: 'bold' }}>
              Rp {parseFloat(cashflow?.balance || 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '30px' }}>
        <h2>Quick Access</h2>
        <p>Use the navigation menu to access different modules:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li><strong>Finance:</strong> Manage categories and transactions</li>
          <li><strong>Letters:</strong> Manage incoming and outgoing letters</li>
          {user.role === 'Ketua' && <li><strong>Users:</strong> Manage organization members</li>}
        </ul>
      </div>
    </div>
  )
}
