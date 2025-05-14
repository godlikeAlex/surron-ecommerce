import { RegistrationForm } from './components/RegistrationForm';
import { AuthLayout } from '@/layouts';

export const Registration = () => (
  <>
    <AuthLayout backgroundVariant="first">
      <AuthLayout.Card title="Регистрация">
        <RegistrationForm />
      </AuthLayout.Card>
    </AuthLayout>
  </>
);
