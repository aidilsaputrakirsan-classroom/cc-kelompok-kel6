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
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const handleLoginSuccess = (data) => {
    localStorage.setItem('token', data.access_token)
    setUser(data.user)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  if (loading) return <p>Loading...</p>

  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />}
        />

        {/* LAYOUT DASHBOARD */}
        <Route
          path="/"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        >

          {/* HALAMAN DALAM DASHBOARD */}
          <Route index element={<h1>Dashboard Home</h1>} />
          <Route path="finance" element={<FinanceModule user={user} />} />
          <Route path="letter" element={<LetterModule user={user} />} />
          <Route path="users" element={<UserManagement user={user} />} />

        </Route>

      </Routes>
    </Router>
  )
}

export default App