import { useApiRootStore } from '@/store/apiRootStore';
import { useQuery } from '@tanstack/react-query';

export const useProduct = (key: string | undefined) => {
  const getProductByKey = useApiRootStore((state) => state.getProductByKey);

  const {
    data: productResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['product', key],
    queryFn: () => (key ? getProductByKey(key) : null),
    enabled: !!key,
  });

  return { productResponse, isLoading, isError, error };
};
