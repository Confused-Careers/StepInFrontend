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
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};