import { useNavigate, useLocation } from "react-router-dom";

export default function Navigation({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const canAccessFinance =
    user &&
    (user.role === "Bendahara" ||
      user.role === "Ketua" ||
      user.role === "Anggota");

  const canAccessLetters =
    user &&
    (user.role === "Sekretaris" ||
      user.role === "Ketua" ||
      user.role === "Anggota");

  const canAccessUsers = user && user.role === "Ketua";

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={styles.sidebar}>
      {/* LOGO */}
      <div style={styles.logoWrap}>
        <div style={styles.logoIcon}>S</div>
        <div>
          <h2 style={styles.logoText}>SIKASI</h2>
          <p style={styles.logoSub}>Finance System</p>
        </div>
      </div>

      {/* MENU */}
      <div style={styles.menu}>
        <MenuItem
          label="Dashboard"
          icon={icons.dashboard}
          active={isActive("/")}
          onClick={() => navigate("/")}
        />

        {canAccessFinance && (
          <MenuItem
            label="Keuangan"
            icon={icons.wallet}
            active={isActive("/finance")}
            onClick={() => navigate("/finance")}
          />
        )}

        {canAccessLetters && (
          <MenuItem
            label="Surat"
            icon={icons.mail}
            active={isActive("/letter")}
            onClick={() => navigate("/letter")}
          />
        )}

        {canAccessUsers && (
          <MenuItem
            label="Users"
            icon={icons.users}
            active={isActive("/users")}
            onClick={() => navigate("/users")}
          />
        )}
      </div>

      {/* LOGOUT ONLY */}
      <div style={styles.bottom}>
        <button style={styles.logout} onClick={handleLogout}>
          {icons.logout} Logout
        </button>
      </div>
    </aside>
  );
}

function MenuItem({ label, icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.menuItem,
        ...(active && styles.activeItem),
      }}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

const icons = {
  dashboard: (
    <svg width="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  ),
  wallet: (
    <svg width="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 7H3v10h18V7zm-2 6h-4v-2h4v2z" />
    </svg>
  ),
  mail: (
    <svg width="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M2 4h20v16H2V4zm10 7l10-7H2l10 7z" />
    </svg>
  ),
  users: (
    <svg width="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  logout: (
    <svg width="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 17l5-5-5-5v3H9v4h7v3z" />
      <path d="M4 4h9v2H6v12h7v2H4z" />
    </svg>
  ),
};

const styles = {
  sidebar: {
    position: "fixed",
    width: 260,
    height: "100vh",
    background: "linear-gradient(180deg, #1e3a8a, #1e40af)",
    color: "#fff",
    padding: 20,
    display: "flex",
    flexDirection: "column",
  },

  logoWrap: {
    display: "flex",
    gap: 10,
    marginBottom: 30,
    alignItems: "center",
  },

  logoIcon: {
    width: 40,
    height: 40,
    background: "#fff",
    color: "#1e3a8a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    fontWeight: "bold",
  },

  logoText: { margin: 0 },
  logoSub: { margin: 0, fontSize: 11, opacity: 0.7 },

  menu: { flex: 1 },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    cursor: "pointer",
    marginBottom: 6,
    color: "#c7d2fe",
    transition: "0.2s",
  },

  activeItem: {
    background: "#3b82f6",
    color: "#fff",
  },

  bottom: {
    borderTop: "1px solid rgba(255,255,255,0.2)",
    paddingTop: 15,
  },

  logout: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};