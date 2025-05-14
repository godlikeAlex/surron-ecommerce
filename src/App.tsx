import { Route, Routes, BrowserRouter } from 'react-router';
import { Home, Login, NotFound, Registration } from '@/pages';
import { useEffect } from 'react';
import { ProtectedRoutes } from './utils/ProtectedRoutes';
//import { useApiRootStore } from './store/apiRootStore';

const App = () => {
  //const {setRefreshToken} = useApiRootStore();

  useEffect(() => {
    // проверить, есть ли рефреш токен, дернуть создание apiRoot с рефрешТокеном
    // const refreshToken = localStorage.getItem(...);
    // if (refreshToken) {
    // setRefreshToken(refreshToken)
    // }
  }, []);

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
