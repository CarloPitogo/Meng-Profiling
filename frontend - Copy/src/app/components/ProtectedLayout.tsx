import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Layout } from './Layout';

export function ProtectedLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const adminOnlyRoutes = ['/faculty', '/instruction', '/search', '/logs'];
  const restrictedForStudents = ['/students', '/scheduling', ...adminOnlyRoutes];
  
  if (user?.role === 'student' && restrictedForStudents.some(route => location.pathname.startsWith(route))) {
    return <Navigate to="/" replace />;
  }

  if (user?.role === 'faculty' && adminOnlyRoutes.some(route => location.pathname.startsWith(route))) {
    return <Navigate to="/" replace />;
  }

  return <Layout />;
}
