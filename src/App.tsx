import { Route, Routes, BrowserRouter } from 'react-router';
import { Home, Login, NotFound, Registration } from '@/pages';
import { ProtectedRoutes } from './utils/ProtectedRoutes';
import { MainLayout } from './layouts';
import { useEffect } from 'react';
import { apiRootStorageHandleEvent } from './store/storage/apiRootStorage';

const App = () => {
  useEffect(() => {
    const apiRootStorageListener = apiRootStorageHandleEvent();
    return apiRootStorageListener;
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route element={<ProtectedRoutes requiredLoginState={false} />}>
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
