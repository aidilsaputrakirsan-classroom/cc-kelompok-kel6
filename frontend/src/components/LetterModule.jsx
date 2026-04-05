import { useState, useEffect } from 'react'
import { letterAPI } from '../services/api'

export default function LetterModule({ user }) {
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [nextNumber, setNextNumber] = useState('')

  const [formData, setFormData] = useState({
    type: 'in',
    title: '',
    content: '',
    senderName: '',
    recipientName: '',
    filePath: '',
  })

  useEffect(() => {
    fetchLetters()
  }, [])

  const fetchLetters = async () => {
    try {
      setLoading(true)
      const response = await letterAPI.getLetters()
      setLetters(response.data)
    } catch (err) {
      setError('Failed to load letters')
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

  const handleOpenModal = async () => {
    try {
      const response = await letterAPI.getNextNumber(formData.type)
      setNextNumber(response.data.number)
    } catch (err) {
      setError('Failed to get next letter number')
    }
    setShowModal(true)
  }

  const handleAddLetter = async (e) => {
    e.preventDefault()
    if (!user || user.role !== 'Sekretaris') {
      setError('Only Sekretaris can add letters')
      return
    }

    try {
      await letterAPI.createLetter(
        formData.type,
        formData.title,
        formData.content,
        formData.senderName,
        formData.recipientName,
        formData.filePath
      )
      fetchLetters()
      setShowModal(false)
      setFormData({
        type: 'in',
        title: '',
        content: '',
        senderName: '',
        recipientName: '',
        filePath: '',
      })
    } catch (err) {
      setError('Failed to add letter')
    }
  }

  const handleDeleteLetter = async (letterId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await letterAPI.deleteLetter(letterId)
        fetchLetters()
      } catch (err) {
        setError('Failed to delete letter')
      }
    }
  }

  return (
    <div className="container">
      <h1>Letter Module</h1>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <h2>Letters</h2>
        {user && user.role === 'Sekretaris' && (
          <button onClick={handleOpenModal} style={{ marginBottom: '20px' }}>
            + Add Letter
          </button>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : letters.length === 0 ? (
          <p>No letters</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Type</th>
                <th>Title</th>
                <th>Sender</th>
                <th>Recipient</th>
                <th>Created At</th>
                {user && user.role === 'Sekretaris' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {letters.map((letter) => (
                <tr key={letter.id}>
                  <td>{letter.number}</td>
                  <td>{letter.type === 'in' ? 'Incoming' : 'Outgoing'}</td>
                  <td>{letter.title}</td>
                  <td>{letter.sender_name || '-'}</td>
                  <td>{letter.recipient_name || '-'}</td>
                  <td>{new Date(letter.created_at).toLocaleDateString()}</td>
                  {user && user.role === 'Sekretaris' && (
                    <td>
                      <button
                        onClick={() => handleDeleteLetter(letter.id)}
                        className="btn-danger btn-small"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">Add Letter</div>
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              <strong>Letter Number:</strong> {nextNumber}
            </div>

            <form onSubmit={handleAddLetter}>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="in">Incoming</option>
                  <option value="out">Outgoing</option>
                </select>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Sender Name</label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Recipient Name</label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>File Path</label>
                <input
                  type="text"
                  name="filePath"
                  value={formData.filePath}
                  onChange={handleChange}
                />
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
