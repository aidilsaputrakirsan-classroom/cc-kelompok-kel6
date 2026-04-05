import { useState, useEffect } from 'react'
import { financeAPI } from '../services/api'

export default function FinanceModule({ user }) {
  const [activeTab, setActiveTab] = useState('transactions')
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    type: 'income',
    categoryId: '',
    amount: '',
    description: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [transRes, catRes] = await Promise.all([
        financeAPI.getTransactions(),
        financeAPI.getCategories(),
      ])
      setTransactions(transRes.data)
      setCategories(catRes.data)
    } catch (err) {
      setError('Failed to load data')
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

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!user || user.role !== 'Bendahara') {
      setError('Only Bendahara can add categories')
      return
    }

    try {
      await financeAPI.createCategory(formData.name, formData.type)
      fetchData()
      setShowModal(false)
      setFormData({ name: '', type: 'income', categoryId: '', amount: '', description: '' })
    } catch (err) {
      setError('Failed to add category')
    }
  }

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    if (!user || user.role !== 'Bendahara') {
      setError('Only Bendahara can add transactions')
      return
    }

    try {
      await financeAPI.createTransaction(
        formData.categoryId,
        parseFloat(formData.amount),
        formData.description,
        formData.type
      )
      fetchData()
      setShowModal(false)
      setFormData({ name: '', type: 'income', categoryId: '', amount: '', description: '' })
    } catch (err) {
      setError('Failed to add transaction')
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await financeAPI.deleteCategory(categoryId)
        fetchData()
      } catch (err) {
        setError('Failed to delete category')
      }
    }
  }

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await financeAPI.deleteTransaction(transactionId)
        fetchData()
      } catch (err) {
        setError('Failed to delete transaction')
      }
    }
  }

  return (
    <div className="container">
      <h1>Finance Module</h1>

      {error && <div className="error">{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('transactions')}
          style={{ marginRight: '10px', backgroundColor: activeTab === 'transactions' ? '#007bff' : '#999' }}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          style={{ backgroundColor: activeTab === 'categories' ? '#007bff' : '#999' }}
        >
          Categories
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : activeTab === 'transactions' ? (
        <div className="card">
          <h2>Transactions</h2>
          {user && user.role === 'Bendahara' && (
            <button onClick={() => { setModalType('transaction'); setShowModal(true); }} style={{ marginBottom: '20px' }}>
              + Add Transaction
            </button>
          )}

          {transactions.length === 0 ? (
            <p>No transactions</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Created At</th>
                  {user && user.role === 'Bendahara' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>Rp {parseFloat(t.amount).toLocaleString('id-ID')}</td>
                    <td>{t.type}</td>
                    <td>{t.description}</td>
                    <td>{new Date(t.created_at).toLocaleDateString()}</td>
                    {user && user.role === 'Bendahara' && (
                      <td>
                        <button
                          onClick={() => handleDeleteTransaction(t.id)}
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
      ) : (
        <div className="card">
          <h2>Categories</h2>
          {user && user.role === 'Bendahara' && (
            <button onClick={() => { setModalType('category'); setShowModal(true); }} style={{ marginBottom: '20px' }}>
              + Add Category
            </button>
          )}

          {categories.length === 0 ? (
            <p>No categories</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Created At</th>
                  {user && user.role === 'Bendahara' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.type}</td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    {user && user.role === 'Bendahara' && (
                      <td>
                        <button
                          onClick={() => handleDeleteCategory(c.id)}
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
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              {modalType === 'category' ? 'Add Category' : 'Add Transaction'}
            </div>

            <form onSubmit={modalType === 'category' ? handleAddCategory : handleAddTransaction}>
              {modalType === 'category' ? (
                <>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Category</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                </>
              )}

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
