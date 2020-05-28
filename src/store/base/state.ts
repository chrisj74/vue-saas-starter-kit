import { IBaseState } from '@/types';

export default function() {
  return {
    env: {
      platform: null,
      app: null,
    },
    leftDrawerOpen: false,
    loading: false,
    error: null,
    extensionInstalled: false,
    extension: {
      currentTabUrl: null,
      extensionId: null,
      windowId: null,
      tabId: null,
      lastFocusedWindow: null,
      sidebar: {
        sidebarWindowId: null,
        sidebarTabId: null,
      },
    },
  } as unknown as IBaseState;
}
