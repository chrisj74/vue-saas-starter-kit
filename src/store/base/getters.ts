import { windowTypeEnum, EnvPlatformsEnum } from '@/types';

export const getLeftDrawerOpen = (state: any) => {
  return state.leftDrawerOpen;
};

export const getLoading = (state: any) => {
  return state.loading;
};

export const getError = (state: any) => {
  return state.error;
};

export const getEnv = (state: any) => {
  return state.env;
};

export const getExtension = (state: any) => {
  return state.extension;
};

export const getWindowType = (state: any, getters: any, rootState: any, rootGetters: any) => {
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
