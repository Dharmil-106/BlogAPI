import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth() {
  const { user, token } = useAuth();
  
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
