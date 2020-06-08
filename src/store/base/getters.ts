import { windowTypeEnum, EnvPlatformsEnum, IBaseState } from '@/types';

export const getLeftDrawerOpen = (state: IBaseState) => {
  return state.leftDrawerOpen;
};

export const getLoading = (state: IBaseState) => {
  return state.loading;
};

export const getError = (state: IBaseState) => {
  return state.error;
};

export const getEnv = (state: IBaseState) => {
  return state.env;
};

export const getExtension = (state: IBaseState) => {
  return state.extension;
};

export const getExtensionInstalled = (state: IBaseState) => {
  return state.extensionInstalled;
};

export const getInIframe = (state: IBaseState) => {
  return state.inIframe;
};

export const getWindowType = (state: IBaseState, getters: any, rootState: any, rootGetters: any) => {
  if (
    state.extension.tabId
    && state.extension.sidebar.sidebarTabId
    && state.extension.tabId === state.extension.sidebar.sidebarTabId
  ) {
    return windowTypeEnum.SIDEBAR;
  } else if (state.env.platform === EnvPlatformsEnum.EXTENSION) {
    return windowTypeEnum.TAB;
  } else if (window.name === 'workalongo') {
    return windowTypeEnum.SIDEBAR;
  } else {
    return windowTypeEnum.BROWSER;
  }
};
