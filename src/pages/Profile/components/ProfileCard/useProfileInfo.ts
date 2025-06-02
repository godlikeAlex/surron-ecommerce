import { apiRootStore, useApiRootStore } from '@/store/apiRootStore';
import { useQuery } from '@tanstack/react-query';

export const useProfileInfo = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);
  const token = useApiRootStore((state) => state.refreshToken);
  const version = useApiRootStore((state) => state.version);

  const { data, isPending } = useQuery({
    queryKey: ['profile-info', token, version],
    queryFn: async () => {
      const response = await apiRoot.me().get().execute();
      apiRootStore().setVersion(response.body.version);
      return response;
    },
  });

  return { data, isPending };
};
