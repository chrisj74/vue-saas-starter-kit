import { IExtensionPopupState } from '@/types';

export const toggleLeftDrawerOpen = (state: any) => {
  state.commit('setLeftDrawerOpen', !state.state.leftDrawerOpen);
};

export const setExtensionPopup = (state: any, payload: IExtensionPopupState) => {
  state.commit('setExtensionPopup', payload);
};

export const setExtensionId = (state: any, payload: string | number) => {
  state.commit('setExtensionId', payload);
};
