import { apiRootStore } from '@/store/apiRootStore';
import { Navigate, Outlet } from 'react-router';

type ProtectedRoutesProps = {
  requiredLoginState: boolean;
  redirectedPath?: string;
};

export const ProtectedRoutes = ({
  requiredLoginState,
  redirectedPath = '/',
}: ProtectedRoutesProps) => {
  if (apiRootStore().isLoggedIn !== requiredLoginState) {
    return <Navigate to={redirectedPath} replace />;
  }
  return <Outlet />;
};
