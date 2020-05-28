import Vue from 'vue';
import { IEnvState, IExtensionSidebarState, IExtensionIds, IBaseState } from '@/types';

export const setEnv = (state: any, payload: IEnvState) => {
  Vue.set(state, 'env', payload);
};

export const setExtensionInstalled = (state: IBaseState, payload: boolean) => {
  state.extensionInstalled = payload;
};

export const setExtensionId = (state: any, payload: string | number) => {
  Vue.set(state.extension, 'extensionId', payload);
};

export const setExtensionSidebar = (state: any, payload: IExtensionSidebarState) => {
  Vue.set(state.extension, 'sidebar', {...payload});
};

export const setExtensionIds = (state: any, payload: IExtensionIds) => {
  Vue.set(state.extension, 'windowId', payload.windowId);
  Vue.set(state.extension, 'tabId', payload.tabId);
};

export const setExtensionLastFocused = (state: any, payload: number) => {
  Vue.set(state.extension, 'lastFocusedWindow', payload);
};

export const setExtensionCurrentTabUrl = (state: any, payload: string) => {
  Vue.set(state.extension, 'currentTabUrl', payload);
};

export const setLeftDrawerOpen = (state: any, payload: boolean) => {
  state.leftDrawerOpen = payload;
};

export const setLoading = (state: any, payload: boolean) => {
  state.loading = payload;
};

export const setError = (state: any, payload: any) => {
  state.error = payload;
};

export const clearError = (state: any) => {
  state.error = null;
};
