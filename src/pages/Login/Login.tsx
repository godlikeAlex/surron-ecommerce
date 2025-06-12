import { AuthLayout } from '@/layouts';
import { LoginForm } from './components/LoginForm';

export const Login = () => {
  return (
    <AuthLayout>
      <AuthLayout.Card title="Вход в систему" titleOrder={2}>
        <LoginForm />
      </AuthLayout.Card>
    </AuthLayout>
  );
};
