export default function() {
  return {
    env: {
      platform: null,
      app: null,
    },
    leftDrawerOpen: false,
    loading: false,
    error: null,
    extension: {
      extensionId: null,
      windowId: null,
      tabId: null,
      lastFocused: null,
      sidebar: {
        sidebarWindowId: null,
        sidebarTabId: null,
      },
    },
  };
}
