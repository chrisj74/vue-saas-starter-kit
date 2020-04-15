import { IExtensionSidebarState } from '@/types';

export const toggleLeftDrawerOpen = (state: any) => {
  state.commit('setLeftDrawerOpen', !state.state.leftDrawerOpen);
};

export const setExtensionSidebar = (state: any, payload: IExtensionSidebarState) => {
  state.commit('setExtensionSidebar', payload);
};

export const setExtensionId = (state: any, payload: string | number) => {
  state.commit('setExtensionId', payload);
};
