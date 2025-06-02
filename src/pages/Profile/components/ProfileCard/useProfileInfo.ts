import { apiRootStore, useApiRootStore } from '@/store/apiRootStore';
import { UseFormReturnType } from '@mantine/form';
import { useQuery } from '@tanstack/react-query';
import { InfoValues } from './ProfileCard';

export const useProfileInfo = (
  setFormInfo: UseFormReturnType<InfoValues, (values: InfoValues) => InfoValues>
) => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);
  const token = useApiRootStore((state) => state.refreshToken);
  const version = useApiRootStore((state) => state.version);

  const { data, isPending } = useQuery({
    queryKey: ['profile-info', token, version],
    queryFn: async () => {
      const response = await apiRoot.me().get().execute();
      apiRootStore().setVersion(response.body.version);
      setFormInfo.setFieldValue('firstName', response.body.firstName || '');
      setFormInfo.setFieldValue('lastName', response.body.lastName || '');
      setFormInfo.setFieldValue('dateOfBirth', response.body.dateOfBirth || '');
      return response;
    },
  });

  return { data, isPending };
};
