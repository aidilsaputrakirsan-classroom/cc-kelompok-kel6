import { useState, useEffect } from "react";
import { letterAPI } from "../services/api";
import Navigation from "./Navigation";

export default function LetterModule({ user, onLogout }) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nextNumber, setNextNumber] = useState("");

  const [formData, setFormData] = useState({
    type: "in",
    title: "",
    content: "",
    senderName: "",
    recipientName: "",
    filePath: "",
  });

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      setLoading(true);
      const response = await letterAPI.getLetters();
      setLetters(response.data);
    } catch (err) {
      setError("Failed to load letters");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = async () => {
    try {
      const response = await letterAPI.getNextNumber(formData.type);
      setNextNumber(response.data.number);
    } catch (err) {
      setError("Failed to get next letter number");
    }
    setShowModal(true);
  };

  const handleAddLetter = async (e) => {
    e.preventDefault();
    try {
      await letterAPI.createLetter(
        formData.type,
        formData.title,
        formData.content,
        formData.senderName,
        formData.recipientName,
        formData.filePath,
      );
      fetchLetters();
      setShowModal(false);
      setFormData({
        type: "in",
        title: "",
        content: "",
        senderName: "",
        recipientName: "",
        filePath: "",
      });
    } catch (err) {
      setError("Failed to add letter");
    }
  };

  const handleDeleteLetter = async (letterId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await letterAPI.deleteLetter(letterId);
        fetchLetters();
      } catch (err) {
        setError("Failed to delete letter");
      }
    }
  };

  return (
    <div style={styles.layout}>
      <Navigation user={user} onLogout={onLogout} />

      <main style={styles.main}>
        {/* TOPBAR */}
        <div style={styles.topbar}>
          <h2 style={styles.topbarTitle}>Letter Module</h2>
          <div style={styles.profile}>
            <div>
              <p style={styles.name}>{user.username}</p>
              <p style={styles.role}>{user.role}</p>
            </div>
            <div style={styles.avatar}>
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={{ margin: 0 }}>Letters</h2>
              {user?.role === "Sekretaris" && (
                <button style={styles.btnPrimary} onClick={handleOpenModal}>
                  + Add Letter
                </button>
              )}
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : letters.length === 0 ? (
              <p>No letters</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Number</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Sender</th>
                    <th style={styles.th}>Recipient</th>
                    <th style={styles.th}>Created At</th>
                    {user?.role === "Sekretaris" && (
                      <th style={styles.th}>Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {letters.map((letter) => (
                    <tr key={letter.id} style={styles.tr}>
                      <td style={styles.td}>{letter.number}</td>
                      <td style={styles.td}>
                        <span
                          style={
                            letter.type === "in"
                              ? styles.badgeBlue
                              : styles.badgePurple
                          }
                        >
                          {letter.type === "in" ? "Incoming" : "Outgoing"}
                        </span>
                      </td>
                      <td style={styles.td}>{letter.title}</td>
                      <td style={styles.td}>{letter.sender_name || "-"}</td>
                      <td style={styles.td}>{letter.recipient_name || "-"}</td>
                      <td style={styles.td}>
                        {new Date(letter.created_at).toLocaleDateString()}
                      </td>
                      {user?.role === "Sekretaris" && (
                        <td style={styles.td}>
                          <button
                            style={styles.btnDanger}
                            onClick={() => handleDeleteLetter(letter.id)}
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
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>Add Letter</h2>

            <div style={styles.numberBadge}>
              <span style={{ opacity: 0.7 }}>Letter Number:</span>
              <strong style={{ color: "#1e3a8a" }}> {nextNumber}</strong>
            </div>

            <form onSubmit={handleAddLetter}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Type</label>
                <select
                  style={styles.input}
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="in">Incoming</option>
                  <option value="out">Outgoing</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input
                  style={styles.input}
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Content</label>
                <textarea
                  style={{ ...styles.input, height: 80 }}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Sender Name</label>
                <input
                  style={styles.input}
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Recipient Name</label>
                <input
                  style={styles.input}
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>File Path</label>
                <input
                  style={styles.input}
                  type="text"
                  name="filePath"
                  value={formData.filePath}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.modalFooter}>
                <button
                  type="button"
                  style={styles.btnGray}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.btnPrimary}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#f1f5f9" },
  main: { flex: 1, marginLeft: 260 },
  topbar: {
    height: 70,
    background: "#1e3a8a",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    color: "#fff",
  },
  topbarTitle: { margin: 0, color: "#fff" },
  profile: { display: "flex", gap: 10, alignItems: "center" },
  name: { margin: 0, fontWeight: "bold" },
  role: { margin: 0, fontSize: 12, opacity: 0.7 },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: "50%",
    background: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  content: { padding: 30 },
  card: { background: "#fff", borderRadius: 15, padding: 20 },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f1f5f9" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: 600,
    color: "#475569",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 16px", color: "#334155" },
  badgeBlue: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "2px 10px",
    borderRadius: 20,
    fontSize: 12,
  },
  badgePurple: {
    background: "#ede9fe",
    color: "#7c3aed",
    padding: "2px 10px",
    borderRadius: 20,
    fontSize: 12,
  },
  btnPrimary: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
  },
  btnDanger: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnGray: {
    background: "#94a3b8",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
  },
  error: {
    background: "#fef2f2",
    color: "#dc3545",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalBox: {
    background: "#fff",
    borderRadius: 15,
    padding: 30,
    width: 440,
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalTitle: { marginBottom: 15, color: "#1e3a8a" },
  numberBadge: {
    background: "#eff6ff",
    padding: "10px 15px",
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 14,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  formGroup: { marginBottom: 15 },
  label: {
    display: "block",
    marginBottom: 5,
    fontWeight: 600,
    color: "#475569",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    boxSizing: "border-box",
  },
};
