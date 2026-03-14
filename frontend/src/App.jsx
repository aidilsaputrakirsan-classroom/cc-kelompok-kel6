import { useState, useEffect, useCallback, useMemo } from "react"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import ItemForm from "./components/ItemForm"
import ItemList from "./components/ItemList"
import { fetchItems, createItem, updateItem, deleteItem, checkHealth } from "./services/api"
import Toast from "./components/Toast"

function App() {

  // ==================== STATE ====================
  const [items, setItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("") // ⭐ state sorting
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")

  // ==================== LOAD DATA ====================
  const loadItems = useCallback(async (search = "") => {
    setLoading(true)
    try {
      const data = await fetchItems(search)
      setItems(data.items)
      setTotalItems(data.total)
    } catch (err) {
      console.error("Error loading items:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================== ON MOUNT ====================
  useEffect(() => {
    checkHealth().then(setIsConnected)
    loadItems()
  }, [loadItems])

  // ==================== SORTING (FRONTEND) ====================
  const sortedItems = useMemo(() => {
    let sorted = [...items]

    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    }

    if (sortBy === "price") {
      sorted.sort((a, b) => a.price - b.price)
    }

    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return sorted
  }, [items, sortBy])

  // ==================== HANDLERS ====================

  const handleSubmit = async (itemData, editId) => {
  try {
    if (editId) {
      await updateItem(editId, itemData)
      setEditingItem(null)
      setToastMessage("Item berhasil diperbarui")
      setToastType("success")
    } else {
      await createItem(itemData)
      setToastMessage("Item berhasil ditambahkan")
      setToastType("success")
    }

    loadItems(searchQuery)

  } catch (err) {
    setToastMessage("Gagal menyimpan item")
    setToastType("error")
  }
}

  const handleDelete = async (id) => {
  const item = items.find((i) => i.id === id)

  if (!window.confirm(`Yakin ingin menghapus "${item?.name}"?`)) return

  try {
    await deleteItem(id)
    setToastMessage("Item berhasil dihapus")
    setToastType("success")
    loadItems(searchQuery)
  } catch (err) {
    setToastMessage("Gagal menghapus item")
    setToastType("error")
  }
}

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadItems(query)
  }

  const handleSort = (type) => {
    setSortBy(type)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
  }

  const handleEdit = (item) => {
  setEditingItem(item)
  }

  // ==================== RENDER ====================
return (
  <div style={styles.app}>

    <Toast
      message={toastMessage}
      type={toastType}
      onClose={() => setToastMessage("")}
    />

    <div style={styles.container}>

        <Header totalItems={totalItems} isConnected={isConnected} />

        <ItemForm
          onSubmit={handleSubmit}
          editingItem={editingItem}
          onCancelEdit={handleCancelEdit}
        />

        {/* SEARCH + SORT */}
        <SearchBar
          onSearch={handleSearch}
          onSort={handleSort}
        />

        {/* LIST ITEM */}
        <ItemList
          items={sortedItems}   // ⭐ pakai hasil sorting
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

      </div>
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
}

export default App