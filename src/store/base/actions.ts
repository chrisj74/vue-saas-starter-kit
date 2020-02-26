export const toggleLeftDrawerOpen = (state: any) => {
  state.commit('setLeftDrawerOpen', !state.state.leftDrawerOpen);
};
