import { RegistrationForm } from './components/RegistrationForm';
import { AuthLayout } from '@/layouts';

const Registration = () => (
  <AuthLayout backgroundVariant="first">
    <AuthLayout.Card title="Регистрация">
      <RegistrationForm />
    </AuthLayout.Card>
  </AuthLayout>
);

export default Registration;
