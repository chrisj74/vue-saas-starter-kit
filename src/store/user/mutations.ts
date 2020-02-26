import * as _ from 'lodash';

export const setUser = (state: any, payload: any) => {
  state.user = payload;
};

export const setAccount = (state: any, payload: any) => {
  state.account = payload;
};

export const setAuth = (state: any, payload: boolean) => {
  state.authSet = payload;
};

export const setActiveProfile = (state: any, payload: any) => {
  state.activeProfile = payload;
};

export const setDefaultProfile = (state: any, payload: any) => {
  state.defaultProfile = payload;
};

export const setProfiles = (state: any, payload: any) => {
  state.profiles = payload;
};

export const setProfileSettings = (state: any, payload: any) => {
  let settings = _.cloneDeep(state.profileSettings);
  settings = _.merge(settings, payload);
  state.profileSettings = settings;
};

export const setError = (state: any, payload: any) => {
  state.userError = payload;
};
