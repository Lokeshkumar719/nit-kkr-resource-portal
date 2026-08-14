import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <h3>Welcome {user?.username}</h3>

      <p>Email : {user?.email}</p>

      <p>Role : {user?.role}</p>

      <br />

      <p>
        Use the navigation bar above to test the backend APIs.
      </p>
    </div>
  );
}

export default Dashboard;