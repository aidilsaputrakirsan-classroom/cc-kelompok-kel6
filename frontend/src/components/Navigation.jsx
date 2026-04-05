import { useNavigate } from 'react-router-dom'

export default function Navigation({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav>
      <button onClick={() => navigate('/')}>Dashboard</button>
      <button onClick={() => navigate('/finance')}>Finance</button>
      <button onClick={() => navigate('/letter')}>Letters</button>
      {user && user.role === 'Ketua' && (
        <button onClick={() => navigate('/users')}>Users</button>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <span style={{ padding: '15px 20px' }}>
          {user && user.username} ({user && user.role})
        </span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}
