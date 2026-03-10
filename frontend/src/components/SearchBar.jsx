import { useState } from "react"

function SearchBar({ onSearch, onSort }) {
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  const handleSortChange = (e) => {
    const value = e.target.value
    setSortBy(value)
    onSort(value)
  }

  return (
    <div>
      {/* Dropdown Sorting */}
      <div style={styles.sortContainer}>
        <label style={styles.label}>Urutkan berdasarkan:</label>
        <select value={sortBy} onChange={handleSortChange} style={styles.select}>
          <option value="">-- Pilih --</option>
          <option value="name">Nama</option>
          <option value="price">Harga</option>
          <option value="newest">Terbaru</option>
        </select>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Cari item berdasarkan nama atau deskripsi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.btnSearch}>
          🔍 Cari
        </button>

        {query && (
          <button type="button" onClick={handleClear} style={styles.btnClear}>
            ✕ Clear
          </button>
        )}
      </form>
    </div>
  )
}

const styles = {
  sortContainer: {
    marginBottom: "0.5rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
  },
  select: {
    padding: "0.4rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  form: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  input: {
    flex: 1,
    padding: "0.75rem",
    borderRadius: "8px",
    border: "2px solid #ddd",
  },
  btnSearch: {
    padding: "0.75rem 1rem",
    backgroundColor: "#2E75B6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  btnClear: {
    padding: "0.75rem",
    backgroundColor: "#eee",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
}

export default SearchBar