import { Footer, Header } from '@/components';
import { Outlet } from 'react-router';

export const MainLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
