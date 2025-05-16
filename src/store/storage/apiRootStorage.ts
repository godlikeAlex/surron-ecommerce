import { LOCAL_STORAGE_KEY, useApiRootStore } from '../apiRootStore';

export const apiRootStorageHandleEvent = () => {
  const storageEventCallback = (event: StorageEvent) => {
    if (event.key === LOCAL_STORAGE_KEY && event.newValue) {
      void useApiRootStore.persist.rehydrate();
    }
  };

  window.addEventListener('storage', storageEventCallback);

  return () => {
    window.removeEventListener('storage', storageEventCallback);
  };
};
