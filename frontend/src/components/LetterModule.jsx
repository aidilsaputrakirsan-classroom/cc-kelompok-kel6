import { useState, useEffect } from "react";
import { letterAPI } from "../services/api";

export default function LetterModule({ user }) {
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
      setShowModal(true);
    } catch (err) {
      setError("Failed to get next letter number");
    }
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
        formData.filePath
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

  const handleDeleteLetter = async (id) => {
    if (window.confirm("Yakin mau hapus?")) {
      try {
        await letterAPI.deleteLetter(id);
        fetchLetters();
      } catch (err) {
        setError("Failed to delete letter");
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* TOPBAR */}
      <div style={styles.topbar}>
        <h2>📄 Letter Module</h2>
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
            <h3>Daftar Surat</h3>

            {user?.role === "Sekretaris" && (
              <button style={styles.btnPrimary} onClick={handleOpenModal}>
                + Tambah Surat
              </button>
            )}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : letters.length === 0 ? (
            <p>Tidak ada data surat</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Jenis</th>
                  <th>Judul</th>
                  <th>Pengirim</th>
                  <th>Penerima</th>
                  <th>Tanggal</th>
                  {user?.role === "Sekretaris" && <th>Aksi</th>}
                </tr>
              </thead>

              <tbody>
                {letters.map((l) => (
                  <tr key={l.id}>
                    <td>{l.number}</td>
                    <td>
                      <span
                        style={
                          l.type === "in"
                            ? styles.badgeBlue
                            : styles.badgePurple
                        }
                      >
                        {l.type === "in" ? "Masuk" : "Keluar"}
                      </span>
                    </td>
                    <td>{l.title}</td>
                    <td>{l.sender_name || "-"}</td>
                    <td>{l.recipient_name || "-"}</td>
                    <td>
                      {new Date(l.created_at).toLocaleDateString()}
                    </td>

                    {user?.role === "Sekretaris" && (
                      <td>
                        <button
                          style={styles.btnDanger}
                          onClick={() => handleDeleteLetter(l.id)}
                        >
                          Hapus
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

      {/* MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3>Tambah Surat</h3>

            <p>
              Nomor: <strong>{nextNumber}</strong>
            </p>

            <form onSubmit={handleAddLetter}>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="in">Masuk</option>
                <option value="out">Keluar</option>
              </select>

              <input
                name="title"
                placeholder="Judul"
                value={formData.title}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <textarea
                name="content"
                placeholder="Isi"
                value={formData.content}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="senderName"
                placeholder="Pengirim"
                value={formData.senderName}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="recipientName"
                placeholder="Penerima"
                value={formData.recipientName}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="filePath"
                placeholder="File Path"
                value={formData.filePath}
                onChange={handleChange}
                style={styles.input}
              />

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.btnGray}
                >
                  Batal
                </button>
                <button type="submit" style={styles.btnPrimary}>
                  Simpan
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
  container: { padding: 30, background: "#f1f5f9", minHeight: "100vh" },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profile: { display: "flex", gap: 10, alignItems: "center" },
  name: { margin: 0, fontWeight: "bold" },
  role: { margin: 0, fontSize: 12 },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: "50%",
    background: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  content: {},
  card: { background: "#fff", padding: 20, borderRadius: 12 },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  btnPrimary: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnDanger: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  btnGray: {
    background: "#94a3b8",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
  },
  badgeBlue: {
    background: "#dbeafe",
    padding: "3px 10px",
    borderRadius: 20,
  },
  badgePurple: {
    background: "#ede9fe",
    padding: "3px 10px",
    borderRadius: 20,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    background: "#fff",
    padding: 25,
    borderRadius: 10,
    width: 400,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  error: {
    background: "#fee2e2",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
};