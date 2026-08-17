import { useAuth } from "../context/AuthContext";

function Navbar({ setPage }) {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        padding: "15px",
        borderBottom: "1px solid #ccc",
        marginBottom: "20px",
      }}
    >
      <button onClick={() => setPage("dashboard")}>Dashboard</button>

      <button onClick={() => setPage("resources")}>Resources</button>

      <button onClick={() => setPage("contribute")}>Contribute</button>

      <button onClick={() => setPage("bug")}>Report Bug</button>

      {user?.role === "ADMIN" && (
        <button onClick={() => setPage("admin")}>Admin Dashboard</button>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Navbar;
