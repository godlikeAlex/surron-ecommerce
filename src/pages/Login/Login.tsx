import { AuthLayout } from '@/layouts';
import { LoginForm } from './components/LoginForm';

export const Login = () => {
  return (
    <>
      <AuthLayout backgroundVariant="second">
        <AuthLayout.Card title="Вход в систему" titleOrder={2}>
          <LoginForm />
        </AuthLayout.Card>
      </AuthLayout>
    </>
  );
};
