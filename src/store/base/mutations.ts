import { IEnvState, IExtensionPopupState } from '@/types';

export const setEnv = (state: any, payload: IEnvState) => {
  state.env = payload;
};

export const setExtensionId = (state: any, payload: string | number) => {
  state.extension.extensionId = payload;
};

export const setExtensionPopup = (state: any, payload: IExtensionPopupState) => {
  state.extension.popup = payload;
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
