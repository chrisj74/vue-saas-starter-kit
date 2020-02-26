import { IEnvState } from '@/types';

export const setEnv = (state: any, payload: IEnvState) => {
  state.env = payload;
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
