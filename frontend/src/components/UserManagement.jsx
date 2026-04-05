import { useState, useEffect } from 'react'
import { authAPI } from '../services/api'

export default function UserManagement({ user }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Anggota',
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await authAPI.listUsers()
      setUsers(response.data)
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      await authAPI.createUser(
        formData.username,
        formData.email,
        formData.password,
        formData.role
      )
      fetchUsers()
      setShowModal(false)
      setFormData({ username: '', email: '', password: '', role: 'Anggota' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await authAPI.deleteUser(userId)
        fetchUsers()
      } catch (err) {
        setError('Failed to delete user')
      }
    }
  }

  return (
    <div className="container">
      <h1>User Management</h1>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <h2>Members</h2>
        <button onClick={() => setShowModal(true)} style={{ marginBottom: '20px' }}>
          + Add User
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.is_active ? 'Active' : 'Inactive'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="btn-danger btn-small"
                      disabled={u.id === user.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">Add User</div>

            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="Anggota">Anggota</option>
                  <option value="Bendahara">Bendahara</option>
                  <option value="Sekretaris">Sekretaris</option>
                  <option value="Ketua">Ketua</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} style={{ backgroundColor: '#999' }}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
