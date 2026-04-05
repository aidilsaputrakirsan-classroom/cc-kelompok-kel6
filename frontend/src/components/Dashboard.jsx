import { useState, useEffect } from 'react'
import { financeAPI } from '../services/api'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

export default function Dashboard({ user, onLogout }) {
  const [cashflow, setCashflow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dark, setDark] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/') {
      fetchCashflow()
    }
  }, [location.pathname])

  const fetchCashflow = async () => {
    try {
      const res = await financeAPI.getCashflow()
      setCashflow(res.data)
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (val) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(val || 0)

  /* 🔥 DATA CHART (SEMENTARA) */
  const chartData = [
    { label: 'Jan', value: 200000 },
    { label: 'Feb', value: 350000 },
    { label: 'Mar', value: 300000 },
    { label: 'Apr', value: 500000 },
    { label: 'Mei', value: 450000 },
  ]

  return (
    <div style={{
      ...styles.layout,
      background: dark ? '#0f172a' : '#f8fafc',
      color: dark ? '#fff' : '#000'
    }}>

      {/* SIDEBAR */}
      <aside style={{
        ...styles.sidebar,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        <h2>SIKASI</h2>

        <MenuItem active={location.pathname === '/'} onClick={() => navigate('/')}>
          Dashboard
        </MenuItem>

        <MenuItem active={location.pathname === '/finance'} onClick={() => navigate('/finance')}>
          Keuangan
        </MenuItem>

        <button style={styles.logout} onClick={onLogout}>Logout</button>
      </aside>

      {/* MAIN */}
      <main style={{
        ...styles.main,
        marginLeft: sidebarOpen ? 260 : 0
      }}>

        {/* TOPBAR */}
        <div style={styles.topbar}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setDark(!dark)}>
              {dark ? '☀️' : '🌙'}
            </button>
            <b>{user.username}</b>
          </div>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>

          {location.pathname === '/' && !loading && (
            <>
              <h1>Dashboard</h1>

              <div style={styles.grid}>
                <Card title="Pemasukan" value={formatRupiah(cashflow.total_income)} color="#22c55e"/>
                <Card title="Pengeluaran" value={formatRupiah(cashflow.total_expense)} color="#ef4444"/>
                <Card title="Saldo" value={formatRupiah(cashflow.balance)} color="#3b82f6"/>
              </div>

              {/* LINE CHART */}
              <div style={styles.chartBox}>
                <h3>Trend Keuangan</h3>
                <LineChart data={chartData} />
              </div>
            </>
          )}

          <Outlet />
        </div>
      </main>
    </div>
  )
}

/* MENU */
function MenuItem({ children, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 12,
        marginBottom: 8,
        borderRadius: 10,
        cursor: 'pointer',
        background: active ? '#3b82f6' : 'transparent',
        transition: '0.2s'
      }}
      onMouseEnter={(e) => e.target.style.background = '#334155'}
      onMouseLeave={(e) => e.target.style.background = active ? '#3b82f6' : 'transparent'}
    >
      {children}
    </div>
  )
}

/* CARD */
function Card({ title, value, color }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 15,
        background: '#fff',
        boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
        transition: '0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <p>{title}</p>
      <h2 style={{ color }}>{value}</h2>
    </div>
  )
}

/* LINE CHART */
function LineChart({ data }) {
  const width = 500
  const height = 200
  const padding = 40

  const max = Math.max(...data.map(d => d.value))

  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (data.length - 1)
    const y = height - padding - (d.value / max) * (height - padding * 2)
    return `${x},${y}`
  })

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      
      {/* GRID */}
      {[0,1,2,3,4].map(i => (
        <line
          key={i}
          x1={padding}
          x2={width - padding}
          y1={padding + i * 30}
          y2={padding + i * 30}
          stroke="#e5e7eb"
        />
      ))}

      {/* LINE */}
      <polyline
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3"
        points={points.join(' ')}
        style={{
          strokeDasharray: 1000,
          strokeDashoffset: 1000,
          animation: 'draw 1.5s ease forwards'
        }}
      />

      {/* DOT */}
      {points.map((p, i) => {
        const [x, y] = p.split(',')
        return <circle key={i} cx={x} cy={y} r="5" fill="#3b82f6" />
      })}
    </svg>
  )
}

/* STYLES */
const styles = {
  layout: { display: 'flex', minHeight: '100vh' },

  sidebar: {
    position: 'fixed',
    width: 260,
    height: '100%',
    background: '#1e293b',
    color: '#fff',
    padding: 20
  },

  main: { flex: 1 },

  topbar: {
    height: 60,
    background: '#1e293b',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px'
  },

  content: { padding: 20 },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20
  },

  chartBox: {
    marginTop: 30,
    padding: 20,
    background: '#fff',
    borderRadius: 15
  },

  logout: {
    marginTop: 20,
    padding: 10,
    background: '#ef4444',
    borderRadius: 10,
    color: '#fff'
  }
}