import { AuthLayout } from '@/layouts';
import { CartCard } from './components/CartCard';

export const Cart = () => {
  return (
    <AuthLayout>
      <AuthLayout.Card title="Корзина">
        <CartCard />
      </AuthLayout.Card>
    </AuthLayout>
  );
};
