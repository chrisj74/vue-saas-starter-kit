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
      popup: {
        popupWindowId: null,
      popupTabId: null,
      }
    },
  };
}
