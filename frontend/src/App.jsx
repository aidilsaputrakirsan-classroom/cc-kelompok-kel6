import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { authAPI } from './services/api'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import FinanceModule from './components/FinanceModule'
import LetterModule from './components/LetterModule'
import UserManagement from './components/UserManagement'
import Navigation from './components/Navigation'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
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
    return <div className="container"><p>Loading...</p></div>
  }

  return (
    <Router>
      {user && <Navigation user={user} onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard user={user} /> : <Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/finance"
          element={user ? <FinanceModule user={user} /> : <Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/letter"
          element={user ? <LetterModule user={user} /> : <Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/users"
          element={user && user.role === 'Ketua' ? <UserManagement user={user} /> : <div className="container"><p>Access denied</p></div>}
        />
      </Routes>
    </Router>
  )
}

export default App
