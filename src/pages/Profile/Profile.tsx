import { AuthLayout } from '@/layouts';
import { ProfileCard } from './components/ProfileCard/ProfileCard';

export const Profile = () => {
  return (
    <AuthLayout>
      <AuthLayout.Card title="Ваш профиль">
        <ProfileCard />
      </AuthLayout.Card>
    </AuthLayout>
  );
};
