import { Route, Routes, BrowserRouter } from 'react-router';
import { Home, Login, NotFound, Registration } from '@/pages';
import { ProtectedRoutes } from './utils/ProtectedRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route element={<ProtectedRoutes requiredLoginState={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
