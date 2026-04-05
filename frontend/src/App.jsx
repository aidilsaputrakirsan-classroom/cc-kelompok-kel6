import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { authAPI } from './services/api'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import FinanceModule from './components/FinanceModule'
import LetterModule from './components/LetterModule'
import UserManagement from './components/UserManagement'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authAPI.getMe()
        .then((response) => {
          setUser(response.data)
        })
        .catch(() => {
          localStorage.removeItem('token')
          setUser(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const handleLoginSuccess = (data) => {
    const { access_token, user: userData } = data
    localStorage.setItem('token', access_token)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <p>Mohon tunggu, sedang memuat SIKASI...</p>
      </div>
    )
  }

  return (
    <Router>
      {/* BARIS DI BAWAH INI DIHAPUS (Navigation) 
          Karena kita sudah pakai Sidebar di dalam Dashboard 
      */}
      
      <Routes>
        {/* Halaman Utama */}
        <Route
          path="/"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        {/* Halaman Login */}
        <Route
          path="/login"
          element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />}
        />

        {/* Modul Keuangan */}
        <Route
          path="/finance"
          element={user ? <FinanceModule user={user} /> : <Navigate to="/login" />}
        />

        {/* Modul Surat */}
        <Route
          path="/letter"
          element={user ? <LetterModule user={user} /> : <Navigate to="/login" />}
        />

        {/* Manajemen User */}
        <Route
          path="/users"
          element={user && user.role === 'Ketua' ? <UserManagement user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  )
}

export default App