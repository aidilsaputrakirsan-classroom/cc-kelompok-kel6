import { useState, useEffect } from "react";
import { authAPI } from "../services/api";
import Navigation from "./Navigation";

export default function UserManagement({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Anggota",
  });

  useEffect(() => {
    if (user?.role !== "Ketua") return;
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authAPI.listUsers();
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await authAPI.createUser(
        formData.username,
        formData.email,
        formData.password,
        formData.role,
      );
      fetchUsers();
      setShowModal(false);
      setFormData({ username: "", email: "", password: "", role: "Anggota" });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await authAPI.deleteUser(userId);
        fetchUsers();
      } catch (err) {
        setError("Failed to delete user");
      }
    }
  };

  if (user?.role !== "Ketua") {
    return (
      <div style={styles.layout}>
        <Navigation user={user} onLogout={onLogout} />
        <main style={styles.main}>
          <div style={styles.topbar}>
            <h2 style={styles.topbarTitle}>User Management</h2>
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
          <div style={styles.content}>
            <div style={styles.forbidden}>
              <h2>⛔ Access Denied</h2>
              <p>Only Ketua can access User Management.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.layout}>
      <Navigation user={user} onLogout={onLogout} />

      <main style={styles.main}>
        {/* TOPBAR */}
        <div style={styles.topbar}>
          <h2 style={styles.topbarTitle}>User Management</h2>
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
              <h2 style={{ margin: 0 }}>Members</h2>
              <button
                style={styles.btnPrimary}
                onClick={() => setShowModal(true)}
              >
                + Add User
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : users.length === 0 ? (
              <p>No users</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Username</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Created At</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={styles.tr}>
                      <td style={styles.td}>{u.id}</td>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={styles.userAvatar}>
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          {u.username}
                          {u.id === user.id && (
                            <span style={styles.youBadge}>You</span>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={roleColor(u.role)}>{u.role}</span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={
                            u.is_active ? styles.badgeGreen : styles.badgeRed
                          }
                        >
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        <button
                          style={{
                            ...styles.btnDanger,
                            opacity: u.id === user.id ? 0.4 : 1,
                          }}
                          onClick={() => handleDeleteUser(u.id)}
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
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>Add User</h2>
            <form onSubmit={handleAddUser}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Username</label>
                <input
                  style={styles.input}
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Role</label>
                <select
                  style={styles.input}
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Anggota">Anggota</option>
                  <option value="Bendahara">Bendahara</option>
                  <option value="Sekretaris">Sekretaris</option>
                  <option value="Ketua">Ketua</option>
                </select>
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

const roleColor = (role) => {
  const map = {
    Ketua: { background: "#fef9c3", color: "#854d0e" },
    Bendahara: { background: "#dcfce7", color: "#166534" },
    Sekretaris: { background: "#ede9fe", color: "#6b21a8" },
    Anggota: { background: "#dbeafe", color: "#1e40af" },
  };
  return {
    ...(map[role] || map.Anggota),
    padding: "2px 10px",
    borderRadius: 20,
    fontSize: 12,
  };
};

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
  userCell: { display: "flex", alignItems: "center", gap: 8 },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#3b82f6",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: "bold",
    flexShrink: 0,
  },
  youBadge: {
    background: "#fef9c3",
    color: "#854d0e",
    fontSize: 11,
    padding: "1px 6px",
    borderRadius: 20,
  },
  badgeGreen: {
    background: "#dcfce7",
    color: "#16a34a",
    padding: "2px 10px",
    borderRadius: 20,
    fontSize: 12,
  },
  badgeRed: {
    background: "#fee2e2",
    color: "#dc2626",
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
  forbidden: {
    background: "#fff",
    borderRadius: 15,
    padding: 40,
    textAlign: "center",
    color: "#dc2626",
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
  modalBox: { background: "#fff", borderRadius: 15, padding: 30, width: 420 },
  modalTitle: { marginBottom: 20, color: "#1e3a8a" },
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
