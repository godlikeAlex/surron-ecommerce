import { RegistrationForm } from './components/RegistrationForm';
import { AuthLayout } from '@/layouts';

export const Registration = () => (
  <AuthLayout>
    <AuthLayout.Card title="Регистрация">
      <RegistrationForm />
    </AuthLayout.Card>
  </AuthLayout>
);
