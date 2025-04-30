import { Route, Routes, BrowserRouter } from 'react-router';
import { Home, NotFound } from './pages';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
