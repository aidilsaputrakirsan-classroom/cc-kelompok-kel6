import { useState, useEffect } from 'react'
import { financeAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Dashboard({ user, onLogout }) {
  const [cashflow, setCashflow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCashflow()
  }, [])

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
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0)

  return (
    <div style={styles.layout}>

      {/* SIDEBAR */}
      <aside style={{
        ...styles.sidebar,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        
        {/* LOGO */}
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>S</div>
          <div>
            <h2 style={styles.logoText}>SIKASI</h2>
            <p style={styles.logoSub}>Finance System</p>
          </div>
        </div>

        {/* MENU */}
        <div style={styles.menu}>

          <MenuItem active label="Dashboard" icon={icons.dashboard} />
          <MenuItem label="Keuangan" icon={icons.wallet} onClick={() => navigate('/finance')} />
          <MenuItem label="Surat" icon={icons.mail} onClick={() => navigate('/letter')} />
          <MenuItem label="Laporan" icon={icons.file} />

        </div>

        {/* LOGOUT */}
        <button style={styles.logout} onClick={onLogout}>
          {icons.logout} Logout
        </button>
      </aside>

      {/* MAIN */}
      <main style={{
        ...styles.main,
        marginLeft: sidebarOpen ? 260 : 0
      }}>

        {/* TOPBAR */}
        <div style={styles.topbar}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.toggle}>
            ☰
          </button>

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
          <h1 style={styles.title}>Dashboard Keuangan</h1>

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
        </div>

      </main>
    </div>
  )
}

/* 🔥 COMPONENT MENU ITEM */
function MenuItem({ label, icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.menuItem,
        ...(active && styles.activeItem)
      }}
    >
      {icon}
      {label}
    </div>
  )
}

/* 🔥 ICON MANUAL (SVG) */
const icons = {
  dashboard: <svg width="18" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>,
  wallet: <svg width="18" fill="currentColor" viewBox="0 0 24 24"><path d="M21 7H3v10h18V7zm-2 6h-4v-2h4v2z"/></svg>,
  mail: <svg width="18" fill="currentColor" viewBox="0 0 24 24"><path d="M2 4h20v16H2V4zm10 7l10-7H2l10 7z"/></svg>,
  file: <svg width="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6V2zm8 1.5V9h5.5"/></svg>,
  logout: <svg width="18" fill="currentColor" viewBox="0 0 24 24"><path d="M16 17l5-5-5-5v3H9v4h7v3z"/><path d="M4 4h9v2H6v12h7v2H4z"/></svg>
}

/* 🔥 STYLES */
const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#f1f5f9' },

  sidebar: {
    position: 'fixed',
    width: 260,
    height: '100%',
    background: '#1e3a8a',
    color: '#fff',
    padding: 20,
    display: 'flex',
    flexDirection: 'column'
  },

  logoWrap: {
    display: 'flex',
    gap: 10,
    marginBottom: 30
  },

  logoIcon: {
    width: 40,
    height: 40,
    background: '#fff',
    color: '#1e3a8a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    fontWeight: 'bold'
  },

  logoText: { margin: 0 },
  logoSub: { fontSize: 10, opacity: 0.7 },

  menu: { flex: 1 },

  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    cursor: 'pointer',
    marginBottom: 10,
    color: '#c7d2fe'
  },

  activeItem: {
    background: '#3b82f6',
    color: '#fff'
  },

  logout: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    background: '#ef4444',
    color: '#fff'
  },

  main: { flex: 1 },

  topbar: {
    height: 70,
    background: '#1e3a8a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    color: '#fff'
  },

  toggle: {
    background: '#3b82f6',
    border: 'none',
    padding: 10,
    borderRadius: 10,
    color: '#fff'
  },

  profile: { display: 'flex', gap: 10 },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: '50%',
    background: '#fff',
    color: '#1e3a8a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  content: { padding: 30 },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 20
  },

  cardGreen: { background: '#ecfdf5', padding: 20, borderRadius: 15 },
  cardRed: { background: '#fef2f2', padding: 20, borderRadius: 15 },
  cardBlue: { background: '#eff6ff', padding: 20, borderRadius: 15 }
}