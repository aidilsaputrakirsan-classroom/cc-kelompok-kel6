import { useState, useEffect, useCallback } from "react"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import ItemForm from "./components/ItemForm"
import ItemList from "./components/ItemList"
import LoginPage from "./components/LoginPage"
import {
  fetchItems, createItem, updateItem, deleteItem,
  checkHealth, login, register, setToken, clearToken,
} from "./services/api"

function App() {
  // ==================== AUTH STATE ====================
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // ==================== APP STATE ====================
  const [items, setItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // ==================== TAMBAHAN ====================
  const [notification, setNotification] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // ==================== LOAD DATA ====================
  const loadItems = useCallback(async (search = "") => {
    setLoading(true)
    try {
      const data = await fetchItems(search)
      setItems(data.items)
      setTotalItems(data.total)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        handleLogout()
      }
      console.error("Error loading items:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkHealth().then(setIsConnected)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadItems()
    }
  }, [isAuthenticated, loadItems])

  // ==================== AUTH ====================

  const handleLogin = async (email, password) => {
    const data = await login(email, password)
    setUser(data.user)
    setIsAuthenticated(true)
    showNotification("success", "Login berhasil")
  }

  const handleRegister = async (userData) => {
    await register(userData)
    await handleLogin(userData.email, userData.password)
    showNotification("success", "Register berhasil")
  }

  const handleLogout = () => {
    clearToken()
    setUser(null)
    setIsAuthenticated(false)
    setItems([])
    setTotalItems(0)
    setEditingItem(null)
    setSearchQuery("")
    showNotification("success", "Logout berhasil")
  }

  // ==================== ITEM ====================

  const handleSubmit = async (itemData, editId) => {
    setActionLoading(true)
    try {
      if (editId) {
        await updateItem(editId, itemData)
        setEditingItem(null)
        showNotification("success", "Data berhasil diupdate")
      } else {
        await createItem(itemData)
        showNotification("success", "Data berhasil ditambahkan")
      }
      loadItems(searchQuery)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else showNotification("error", err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id)
    if (!window.confirm(`Yakin ingin menghapus "${item?.name}"?`)) return

    setActionLoading(true)
    try {
      await deleteItem(id)
      showNotification("success", "Data berhasil dihapus")
      loadItems(searchQuery)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else showNotification("error", "Gagal menghapus: " + err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadItems(query)
  }

  // ==================== RENDER ====================

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
  }

  return (
    <div style={styles.app}>
      <div style={styles.container}>

        {/* ===== NOTIF (STABIL, TIDAK FLOATING) ===== */}
        {notification && (
          <div
            style={{
              ...styles.notification,
              backgroundColor:
                notification.type === "success" ? "#d4edda" : "#f8d7da",
              color:
                notification.type === "success" ? "#155724" : "#721c24",
            }}
          >
            {notification.message}
          </div>
        )}

        <Header
          totalItems={totalItems}
          isConnected={isConnected}
          user={user}
          onLogout={handleLogout}
        />

        <ItemForm
          onSubmit={handleSubmit}
          editingItem={editingItem}
          onCancelEdit={() => setEditingItem(null)}
        />

        <SearchBar onSearch={handleSearch} />

        <ItemList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      {/* ===== LOADING ===== */}
      {actionLoading && (
        <div style={styles.overlay}>
          <div style={styles.spinner}></div>
        </div>
      )}
    </div>
  )
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "2rem",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  // ✅ NOTIF CLEAN (NO POSITION BUG)
  notification: {
    width: "100%",
    padding: "14px 20px",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "500",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "16px",
  },

  // LOADING
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #ccc",
    borderTop: "5px solid #333",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
}

export default App