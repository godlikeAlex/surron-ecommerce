import { useApiRootStore } from '@/store/apiRootStore';
import { Navigate, Outlet } from 'react-router';

type ProtectedRoutesProps = {
  requiredLoginState: boolean;
  redirectedPath?: string;
};

export const ProtectedRoutes = ({
  requiredLoginState,
  redirectedPath = '/',
}: ProtectedRoutesProps) => {
  const isLoggedIn = useApiRootStore((state) => state.isLoggedIn);
  if (isLoggedIn !== requiredLoginState) {
    return <Navigate to={redirectedPath} replace />;
  }
  return <Outlet />;
};
