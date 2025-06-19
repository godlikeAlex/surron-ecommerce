import { Route, Routes, BrowserRouter } from 'react-router';
import { About, Catalog, Home, Login, NotFound, Registration } from '@/pages';
import { ProtectedRoutes } from './utils/ProtectedRoutes';
import { MainLayout } from './layouts';
import { useEffect } from 'react';
import { apiRootStorageHandleEvent } from './store/storage/apiRootStorage';
import { Profile } from './pages/Profile';
import { ProductDetail } from './pages/ProductDetail';

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
          <Route path="/catalog/*" element={<Catalog />} />
          <Route path="/products/:key" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
          <Route element={<ProtectedRoutes requiredLoginState={false} />}>
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
          </Route>
          <Route element={<ProtectedRoutes requiredLoginState={true} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
