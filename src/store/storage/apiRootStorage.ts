import {
  apiRootStore,
  LOCAL_STORAGE_KEY,
  StorageApiRoot,
} from '../apiRootStore';

const isStorageApiRoot = (item: unknown): item is StorageApiRoot => {
  if (typeof item !== 'object' || !item || !('state' in item)) return false;
  if (
    typeof item.state !== 'object' ||
    !item.state ||
    !('isLoggedIn' in item.state) ||
    !('refreshToken' in item.state) ||
    typeof item.state.isLoggedIn !== 'boolean' ||
    typeof item.state.refreshToken !== 'string'
  )
    return false;
  return true;
};

export const checkStorage = () => {
  const storageItem = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!storageItem) return;
  const parsedStorageItem: unknown = JSON.parse(storageItem);
  if (isStorageApiRoot(parsedStorageItem)) return parsedStorageItem;
};

export const apiRootStorageHandleEvent = () => {
  const fromStorage = apiRootStore().fromStorage;

  const storageEventCallback = (event: StorageEvent) => {
    if (event.key === LOCAL_STORAGE_KEY && event.newValue) {
      const value: unknown = JSON.parse(event.newValue);
      if (!isStorageApiRoot(value)) return;
      fromStorage(value);
    }
  };

  window.addEventListener('storage', storageEventCallback);

  return () => {
    window.removeEventListener('storage', storageEventCallback);
  };
};
