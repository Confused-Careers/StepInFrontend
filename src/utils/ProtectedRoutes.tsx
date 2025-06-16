import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedUserType: 'individual' | 'company';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedUserType }) => {
  const accessToken = localStorage.getItem('accessToken');
  const userType = localStorage.getItem('userType');

  const isAuthenticated = !!accessToken;
  const isAuthorized = userType === allowedUserType;

  if (!isAuthenticated) {
    return <Navigate to={allowedUserType === 'individual' ? '/individual-login' : '/company/login'} replace />;
  }

  if (!isAuthorized) {
    if (userType === 'company') {
      return <Navigate to="/company/dashboard/jobposts" replace />;
    } else if (userType === 'individual') {
      return <Navigate to="/dashboard/interactive" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const PublicRoute: React.FC = () => {
  const accessToken = localStorage.getItem('accessToken');
  const userType = localStorage.getItem('userType');

  const isAuthenticated = !!accessToken;

  if (isAuthenticated) {
    if (userType === 'company') {
      return <Navigate to="/company/dashboard/jobposts" replace />;
    } else if (userType === 'individual') {
      return <Navigate to="/dashboard/interactive" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};