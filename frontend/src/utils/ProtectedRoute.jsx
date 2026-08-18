import { useAuth } from '../context/AuthContext';

import Login from '../pages/Login';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <Login />;
  }

  return children;
}

export default ProtectedRoute;
